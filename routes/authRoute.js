const express = require("express")
const auth = express.Router()
const passport = require('passport')
const {User} = require("../index")

auth.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))
  
//callback route for Google strategy
auth.get('/google/redirect', passport.authenticate('google', {session: true, failureRedirect: '/login'}), (req, res) => {
  res.redirect('/dashboard')
})

auth.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

//callback route for Google strategy
auth.get('/facebook/redirect', passport.authenticate('facebook', {session: true, failureRedirect: '/login'}), (req, res) => {
res.redirect('/dashboard')
})


module.exports = auth