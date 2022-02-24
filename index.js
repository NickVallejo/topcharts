require("dotenv").config()
const express = require("express")
const root = express()
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const ytSearch = require('youtube-search')
const expressLayouts = require('express-ejs-layouts')
const bcrypt = require('bcrypt')
const isAuth = require('./js-serverside/utility/authMiddleware').isAuth

const inProd = process.env.IN_PROD === "production"

//! CREATES CONNECTION TO MONGO DATABASE USING MONGOOSE
const db_connect = mongoose.createConnection(
  process.env.db_connect,
  { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
      console.log('connected to database')
    }
  })

const Chart = db_connect.model('Topsters Charts', require("./models/chart_model"), "topsters-chart-data")
const User = db_connect.model('Users', require("./models/user_model"), "topsters-user-data")

exports.User = User
exports.Chart = Chart

//Imported Routes
const auth_route = require("./routes/authRoute")
const login_route = require("./routes/login")
const reg_route = require("./routes/register")
const logout_route = require("./routes/logout")
const profile_route = require("./routes/profileRoute")
const settings_route = require("./routes/settings")
const forgot_route = require("./routes/forgotRoute")
const { authBlockSettings } = require("./js-serverside/utility/authMiddleware")

//Imported Functions
require('./js-serverside/albumSuggs.js')
require('./js-serverside/chartUpdate.js')
require('./js-serverside/chartSave.js')
require('./js-serverside/chartDelete.js')

const SESS_AGE = 1000 * 60 * 60

root.use(expressLayouts)
root.set('view engine', 'ejs')
root.use('/uploads', express.static('uploads'));
root.use(express.static('public'))
root.use(express.json({limit: '50mb'}))
root.use(express.urlencoded({ extended: true, limit: '50mb' }))

const MongoStore = require("connect-mongo")(session)

const port = process.env.PORT || 3000

root.listen(port, (err) => {
  try {
    console.log("Connected to port " + port)
  } catch (err) {
    throw err
  }
})


//! CREATES A STORAGE COLLECTION FOR SESSIONS USING THE DATABASE CONNECTION ESTABLISHED ABOVE
const sessionStore = new MongoStore({
  mongooseConnection: db_connect,
  collection: process.env.SESSION_COLLECTION
})

//! ESTABLISHES THE SESSION MIDDLEWARE THAT PLANTS A SESSION COOKIE ON THE BRWOSER & ADDS A NEW ENTRY TO SESSION STORAGE ON THE SERVER
root.use(
  session({
    name: 'topsters-session',
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore, //uses the session storage established with express-session and connect-mongo modules
    strict: false,
    cookie: {
      maxAge: SESS_AGE,
      // sameSite: inProd ? 'none' : 'lax',
      // secure: inProd ? 'true' : 'auto'
      sameSite: 'lax',
      secure: 'auto'
    },
  })
)

root.use(passport.initialize());
root.use(passport.session());
require('./js-serverside/utility/passport');

//! ROUTES ESTABLISHED FOR LOGIN, LOGOUT, AND REGISTER
root.use("/auth", auth_route)
root.use("/login", login_route)
root.use("/logout", logout_route)
root.use("/register", reg_route)
root.use("/profile", profile_route)
root.use("/settings", settings_route)
root.use("/forgot", forgot_route)

//! SENDS USER TO HOME PAGE
root.get("/", (req, res, next) => {
  // res.sendFile(path.join(__dirname, "pages/home.html"))
  const userInfo = req.user ? req.session.userInfo : false;
  res.render('dashView-home', { home: true, userInfo, layout: './layouts/home' })
})

//! SENDS USER TO DASHBOARD AFTER AUTHCHECK AND REFRESHING ARTISTS
root.get("/dashboard", isAuth, (req, res, next) => {
  const userInfo = req.user ? req.session.userInfo : false;
  res.render('dashView-mine', { home: true, userInfo, layout: './layouts/dashboard-edit' })
})

//! CHECK HERE
root.get('/reset/:token', authBlockSettings, (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    try {
      if (!user) { res.redirect('/forgot') }
      else {
        res.render('dashView-reset', { home: true, token: req.params.token, userInfo: false, layout: './layouts/dashboard' })
      }
    } catch (err) {
      res.status(500).send({ noticeType: 'error', err })
    }
  })
})

//! CHECK HERE
root.post('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async (err, user) => {
    try {
      if (!user) { res.redirect('/forgot') }
      else if (await bcrypt.compare(req.body.confirmPass, user.password)) {
        res.send({ noticeType: 'error', noticeTxt: 'You are trying to change your password with your existing one.' })
      }
      else {
        const salt = await bcrypt.genSalt()
        const hashedNewPass = await bcrypt.hash(req.body.confirmPass, salt)

        user.password = hashedNewPass
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save((err) => {
          req.session.passChangeComplete = true;
          res.status(200).send({ noticeType: 'success', noticeTxt: 'Password successfully changed!' })
          //! Check here
          //localStorage.setItem('passChangeComplete', true);
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ noticeType: 'error', noticeTxt: err });
      res.end();
    }
  })
});

root.get('/about', function (req, res) {
  const userInfo = req.user ? req.session.userInfo : false;
  res.render('about-data', { userInfo, layout: './layouts/about' });
});

//! CHECKS TO SEE IF USER IS LOGGED IN BEFORE GRANTING ACCESS TO DASHBOARD
// function authCheck(req, res, next) {
//   if (req.session.userId && req.path == "/dashboard") {
//     req.session.suggsLoaded = false //sets suggsloaded to false so site knows to call albumSuggs again on refresh
//     next()
//   } else if (req.session.userId) {
//     next()
//   } else {
//     res.redirect("/login")
//   }
// }

//! (ON APP EXECUTE) - GATHER ALL SUGGESTED ALBUMS AND SEND THEM TO FRONT END
root.get("/similar-artists", albumSuggs)

//! (ON APP EXECUTE) - FIND ALL USER CHARTS AND SEND THEM TO FRONT END
root.get("/my-lists", async (req, res, next) => {
  await User.findById(req.user.id, (err, user) => {
    if (!user) {
      res.render('404-data', { layout: './layouts/404' });
      res.end();
    } else {
      res.send(user.musicCharts)
    }
  }).populate('musicCharts')
})

//! UPDATES A CHART AND THEN REFRESHES LIST OF ARTIST NAMES
root.post("/update", chartUpdate)

//! SAVES A NEW CHART AND THEN REFRESHES LIST OF ARTIST NAMES
root.post("/", chartSave)

//! DELETES A CHART AND THEN REFRESHES LIST OF ARTIST NAMES
root.post("/list-delete", chartDelete)

root.post('/title-change', async (req, res) => {
  const { title, newtitle } = req.body;
  const title_ = title.replace(/ /g, "_");
  const newtitle_ = newtitle.replace(/ /g, "_");
  const user = await User.findById(req.user.id).populate('musicCharts')

  if (user) {
    const doesNotHaveNewName = user.musicCharts.every(chart => chart.title !== newtitle_)

    if (doesNotHaveNewName) {
      user.musicCharts.forEach(async chart => {
        try {
          if (chart.title == title_) {
            console.log(chart.title, title_, newtitle_)
            chart.title = newtitle_
            await chart.save();
            res.end(JSON.stringify({ msg: `name changed to ${newtitle_}`, data: newtitle_ }));
            console.log('worked once')
          }
        }
        catch {
          console.log('nope')
        }
      })
    } else {
      res.end(JSON.stringify({ err: `You already have a chart with this name` }));
    }
  }

})

root.get("/privacy-policy", (req, res, next) => {
  const userInfo = req.user ? req.session.userInfo : false
  res.render('privacy-policy', {userInfo: userInfo, title: 'Privacy Policy', layout: './layouts/page' });
})

root.get("/yt-listen", (req, res) => {

  const { artist, album } = req.query

  const opts = {
    maxResults: 10,
    key: process.env.API_KEY
  }

  ytSearch(`${artist} - ${album}`, opts, (err, results) => {
    if (err) return console.log(err)

    else {
      for (i = 0; i < 10; i++) {
        if (!results[i].link.includes('playlist?')) {
          res.end(results[i].link)
          break;
        } else {
          continue;
        }
      }
    }
  })
})

root.get('/search/:query', async(req, res, next) => {
  const query = new RegExp("^"+req.params.query, "i")
  const users = await User.find({username: query}).limit(20)
  const userInfo = req.user ? req.session.userInfo : false
  res.render('dashView-search', { home: true, userInfo: userInfo, users: users, layout: './layouts/dashboard-visit' })
})

//! LEADS TO A VIEW OF A CERTAIN CHART
//! MUST RENDER VIEW.HTML WITH CERTAIN OBJECT DATA USING EJS
root.get('/:username/chart/:chartname', async (req, res) => {
  const { username, chartname } = req.params

  await User.findOne({ username }, async (err, user) => {
    try {
      if (!user) {
        res.render('404-data', { layout: './layouts/404' })
        res.end();
      }

      if (user) {
        const theChart = await user.musicCharts.find(chart => chart.title == chartname).populate('musicCharts')
        if (theChart) {
          if (!req.user) {
            res.render('dashView-user', { home: true, userInfo: false, layout: './layouts/dashboard-visit' })
          } else {
              if (req.user.username == username) {
                res.redirect(`/dashboard?chart=${chartname}`)
              } else {
                res.render('dashView-user', { home: true, userInfo: req.session.userInfo, layout: './layouts/dashboard-visit' })
              }
          }
        }
        else {
          res.render('404-data', { layout: './layouts/404' })
          res.end();
        }
      }
    } catch (err) {
      res.render('404-data', { layout: './layouts/404' })
      res.end();
      console.log('CANT FIND USER WITH THIS USERNAME', err)
    }
  }).populate('musicCharts')
})

//! FIND A USER IN THE DB THAT MATCHES THE URL PATH
//! 404 IF NO USER IS FOUND, OTHERWISE SERVE THEIR PROFILE PAGE
//! CHECKS IF THE PERSON ACCESSING THE PAGE IS VISITING ANOTHER USER'S PROFILE OR THEIR OWN
root.get('/:username', async (req, res) => {

  const username = req.params.username
  // const userI = new RegExp(username, 'i')
  
  await User.findOne({ username }, (err, user) => {
    try{
      if (user) {
        console.log('USER IS FOUND')
        console.log(user.username)
        userFound(user)
      } else {
        console.log('USER NOT FOUND')
        res.render('404-data', { layout: './layouts/404' });
      }
    } catch(err){
      error.log('Caught an error on /:username route')
    }
  }).populate('musicCharts').collation({locale: 'en', strength: 2})

  // BEFORE CHECKING IF ITS YOUR PROFILE, CHECK IF IT EXISTS WITH ANOTHER SEARCH BY req.params
  async function userFound(theUser) {

    //! A USER HAS BEEN FOUND. THIS PART IS JUST FOR AUTHORIZATION
    //if no id youre not logged in so it's not your account. Show visitor view
    if (!req.user) {
      // getFollowerData(false, username, true)
      const profileInfo = { username: theUser.username, musicCharts: theUser.musicCharts, profileImage: theUser.profileImage }
      res.render('user-data', { profileInfo, username: theUser.username, profileCharts: theUser.musicCharts, followers: theUser.followers.length, following: theUser.following.length, myProf: false, userInfo: false, layout: './layouts/profile' })
    } else {
      await User.findById(req.user.id, (err, user) => {
        try {
          if (user) {
            //youre logged in and the url matches your username. Show editor view
            if (req.params.username == user.username) {
              const profileInfo = { username: user.username, musicCharts: user.musicCharts, profileImage: user.profileImage }
              res.render('my-data', { profileInfo, username: user.username, profileCharts: user.musicCharts, followers: user.followers.length, following: user.following.length, myProf: true, userInfo: req.session.userInfo, layout: './layouts/profile' })
              // getFollowerData(true, username, false);
            } else {
              //youre logged in but this is not your profile. show visitor view
              const profileInfo = { username: theUser.username, musicCharts: theUser.musicCharts, profileImage: theUser.profileImage }
              res.render('user-data', { profileInfo, username: theUser.username, profileCharts: theUser.musicCharts, followers: theUser.followers.length, following: theUser.following.length, myProf: false, userInfo: req.session.userInfo, layout: './layouts/profile' })
            }
          }
        }
        catch (err) {
          console.log(err);
        }
      }).populate('musicCharts')
    }
  }

  // async function getFollowerData(myProfile, username, notLogged){
  //   if(myProfile){
  //     User.findById(req.session.userId, (err, user) => {
  //       if(user){
  //        res.render('my-data', {followers: user.followers.length, following: user.following.length, myProf: true, logged: true, userInfo: req.session.userInfo, layout: './layouts/profile'})
  //       }
  //     })
  //   } else if(notLogged == true && username && myProfile == false){
  //     User.findOne({username}, (err, user) => {
  //       res.render('user-data', {followers: user.followers.length, following: user.following.length, myProf: false, logged: false, userInfo: req.session.userInfo, layout: './layouts/profile'})
  //      })
  //   }

  //   else{
  //     User.findOne({username}, (err, user) => {
  //        res.render('user-data', {followers: user.followers.length, following: user.following.length, myProf: false, logged: true, userInfo: '', layout: './layouts/profile'})
  //       })
  //   }
  // }

  // async function noUserFound(){
  //   res.render('404-data', {layout: './layouts/404'});
  // }

})

root.get('*', function (req, res) {
  res.render('404-data', { layout: './layouts/404' });
});

// function headerSet(req, res, next) {
//   console.log('checking if user is logged using middleware')
//   if (!req.session) {
//     return;
//   }
//   if (req.session.userInfo) {
//     console.log('userinfo was set so just continuing')
//     next();
//     return;
//   }
//   if (req.session.userId) {
//     console.log('no userInfo set so setting now')
//     User.findById(req.session.userId, (err, user) => {
//       try {
//         if (user) {
//           req.session.userInfo = { profileImage: user.profileImage, username: user.username, password: user.password, email: user.email, musicCharts: user.musicCharts }
//           req.session.logged = true;
//           console.log(req.session.userInfo)
//           next();
//         }
//       }
//       catch (err) {
//         console.log(err);
//       }
//     })
//   } else {
//     console.log('no userID so no logged session')
//     req.session.logged = false;
//     console.log(req.session.logged);
//     next();
//   }

// }
