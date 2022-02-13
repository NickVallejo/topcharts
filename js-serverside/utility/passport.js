require("dotenv").config()
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const {User} = require('../../index')
const bcrypt = require('bcrypt')

const inProd = process.env.IN_PROD === "production"

const options = {
    passReqToCallback: true
}

const verifyCallback = async(req, username, password, done) => {
try{
  // const userI = new RegExp(username, 'i')
  await User.findOne({$or: [{ username }, { email: username }]}, async(err, user) => { //uses mongoose to findOne certain email from the user database model

      if(err){throw err}
    
      if (user && user.password) {
        console.log('FOUND A USER TOO')
          if (await bcrypt.compare(password, user.password)) { //if a user is found and the password matches, create the userId session property and redirect to dashboard
            console.log('WE IN HERE')
            return done(null, user)
          } else { //this else stament fires when the email matches but the password is incorrect. Redirects user back to login page
            req.session.login_error = {msg: "Invalid username or password."}
            return done(null, false)
          }
        } else if(user && !user.password){
          req.session.login_error = {msg: "Your account was created with either Google or Facebook SSO. Please sign in through those routes instead."}
          return done(null, false)
        } else { 
          req.session.login_error = {msg: "Invalid username or password."}
          return done(null, false)
        }
  }).collation({locale: 'en', strength: 2})
} catch(err){
    req.session.login_error = {msg: err.message}
    return done(err)
  }
}

const verifyCallbackGoogle = async(req, accessToken, refreshToken, profile, done) => {
  
  try{
    let user
    let name
    let email = profile._json.email
    let id = profile.id
    const facebookRoute = req.route.path.includes('facebook')
    const googleRoute = req.route.path.includes('google')

    if(facebookRoute){
      name = profile.name
      user = await User.findOne({facebookId: id})
    } else if(googleRoute){
      name = profile.displayName
      user = await User.findOne({googleId: id})
    }
  
    if(user) {
      return done(null, user)
    }

    const localUser = await User.findOne({email}).collation({locale: 'en', strength: 2})
  
    if(localUser) {
      req.session.login_error = {msg: "There is already a local account registered with this email."}
      return done(null, false)
    } else{
      let baseName
      let strategyName
      let counter = 1
      let idType

      if(googleRoute){
        baseName = displayName.replace(/\s+/g, '')
        idType = 'googleId'
      } else if(facebookRoute){
        baseName = name.givenName+name.familyName
        idType = 'facebookId'
      }

      const nameLoop = async() => {
        try{
          strategyName = `${baseName}_${id.substr(0, counter)}`
          const displayNameUser = await User.findOne({username: strategyName}).collation({locale: 'en', strength: 2})
  
          if(displayNameUser){
            counter++
            nameLoop()
          } else{
            const user = new User({
              email: email,
              username: strategyName,
            })
            user[idType] = id
            user.save(() => {
              return done(null, user)        
            })
          }
        } catch(err){
          req.session.login_error = {msg: err.message}
          return done(null, false)
        }
      }

      nameLoop()
    }
  } catch(err){
    console.log('INSIDE BIGGER ERROR')
    req.session.login_error = {msg: err.message}
    return done(null, false)
  }

}

const strategy = new LocalStrategy(options, verifyCallback)
const registerStrategy = new LocalStrategy(options, verifyCallback)

const strategyGoogle = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  passReqToCallback: true,
  callbackURL: '/auth/google/redirect',
}, verifyCallbackGoogle)

const strategyFacebook = new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  passReqToCallback: true,
  callbackURL: '/auth/facebook/redirect',
  profileFields: ['id', 'emails', 'name']
}, verifyCallbackGoogle)

//! binds the user id to the express session cookie to persist the login across pages
//! this is only called when successfully logging in, or whenever an authenticated session is created
passport.serializeUser((req, user, done) => {
  console.log('USER SERILAIZIED')
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

passport.use('local', strategy)
passport.use('local-register', registerStrategy)
passport.use(strategyGoogle)
passport.use(strategyFacebook)