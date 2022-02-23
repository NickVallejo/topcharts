require("dotenv").config()
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const {User} = require('../../index')
const bcrypt = require('bcrypt')

const options = {
    passReqToCallback: true
}

const verifyCallback = async(req, username, password, done) => {
try{
  // const userI = new RegExp(username, 'i')
  await User.findOne({$or: [{ username }, { email: username }]}, async(err, user) => { //uses mongoose to findOne certain email from the user database model
      if(err){throw err}
      req.session.save(async() => {
        if (user && user.password) {
          const passMatch = await bcrypt.compare(password, user.password)
          if (passMatch) { //if a user is found and the password matches, create the userId session property and redirect to dashboard
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
      })
  }).collation({locale: 'en', strength: 2})
} catch(err){
    req.session.login_error = {msg: err.message}
    return done(err)
  }
}

const verifycallbackSSO = async(req, accessToken, refreshToken, profile, done) => {
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
    req.session.login_error = {msg: err.message}
    return done(null, false)
  }
}

const strategy = new LocalStrategy(options, verifyCallback)
const registerStrategy = new LocalStrategy(options, verifyCallback)

const strategyGoogle = new GoogleStrategy({
  clientID: "229441451169-5sa9b25dq62cjea11mislqjcfdmad2qb.apps.googleusercontent.com",
  clientSecret: "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",
  passReqToCallback: true,
  callbackURL: '/auth/google/redirect',
}, verifycallbackSSO)

const strategyFacebook = new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  passReqToCallback: true,
  callbackURL: '/auth/facebook/redirect',
  profileFields: ['id', 'emails', 'name']
}, verifycallbackSSO)

//! binds the user id to the express session cookie to persist the login across pages
//! this is only called when successfully logging in, or whenever an authenticated session is created
passport.serializeUser(async(req, user, done) => {
    req.session.save(() => {
      done(null, user._id)
    })
})

//! calls whenever it needs to check if user is authenticated. Grabs the user id set by passport inside the express session cookie
//! and then checks if a user with that id is in the db. If not, error, if yes, continue
passport.deserializeUser(async(req, userId, done) => {
    await User.findById(userId, async(err, user) => {
      req.session.save(() => {
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
})

passport.use('local', strategy)
passport.use('local-register', registerStrategy)
passport.use(strategyGoogle)
passport.use(strategyFacebook)