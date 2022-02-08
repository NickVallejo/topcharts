const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../../index')
const bcrypt = require('bcrypt')

const options = {
    passReqToCallback: true
}

const verifyCallback = async(req, username, password, done) => {
  
const userI = new RegExp(username, 'i')
console.log('user', userI, username, 'password', password)
  await User.findOne({$or: [{ username: userI }, {email: userI}]}, async (err, user) => { //uses mongoose to findOne certain email from the user database model
    try{
      if (user) {
          console.log('user was found')
        if (await bcrypt.compare(password, user.password)) { //if a user is found and the password matches, create the userId session property and redirect to dashboard
            console.log('everythign worked')
            return done(null, user)
        } else { //this else stament fires when the email matches but the password is incorrect. Redirects user back to login page
          console.log('PASSWORD DID NOT MATCH')
          req.session.login_error = {msg: "Invalid credentials"}
          return done(null, false)
        }
      } else { //this else statement fires when there was no user with that email found. Redirects user back to login page
        console.log('no user found>?')
        req.session.login_error = {msg: "Invalid credentials"}
        return done(null, false)
        }
    } catch(err){
      console.log('ERROR')
      req.session.login_error = {msg: err.message}
      return done(err)
    }
  })
}

const strategy = new LocalStrategy(options, verifyCallback)

passport.use(strategy)

//! binds the user id to the express session cookie to persist the login across pages
//! this is only called when logging in, or whenever an authenticated session is created
passport.serializeUser((req, user, done) => {
    done(null, user._id)
})

//! calls whenever it needs to check if user is authenticated. Grabs the user id set by passport inside the express session cookie
//! and then checks if a user with that id is in the db. If not, error, if yes, continue
passport.deserializeUser((req, userId, done) => {
    User.findById(userId, (err, user) => {
        err && done(err)
        
        if(user){
          req.session.userInfo = { profileImage: user.profileImage, username: user.username, password: user.password, email: user.email, musicCharts: user.musicCharts }
          req.session.suggsLoaded = false
          done(null, user)
        } else{
          req.session.userInfo = false
          done(null, false)
        }
    })
})