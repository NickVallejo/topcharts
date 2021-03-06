const express = require("express")
const userPages = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const {User} = require("../index")
const authBlock = require('../js-serverside/utility/authMiddleware').authBlock

//! GET ROUTE FOR THE LOGIN PAGE
userPages.get("/", authBlock, (req, res) => { //check if already logged in, and if not, send the user to the login page
  const passChanged = req.session.passChangeComplete ? true : false
  const logErrors = req.session.login_error ? req.session.login_error : false

    console.log('LOG ERRORS/??', logErrors, req.session.id)
    if(req.session.login_error){
      delete req.session.login_error
    }
  
    if(passChanged == true){
      delete req.session.passChangeComplete
    }
  
    res.render('dashView-login', {home: false, passChanged, username: '', errs: logErrors, userInfo: false, layout: './layouts/dashboard'})
})

//!POST ROUTE THAT REDIRECTS USER TO DASHBOARD AFTER VALID LOGIN
userPages.post("/", passport.authenticate('local', {
  session: true,
  failureRedirect: '/login',
  successRedirect: '/dashboard'
}))

module.exports = userPages
