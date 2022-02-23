require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express")
const regPages = express.Router()
const {User} = require("../index")
const validator = require("validator")
const bcrypt = require('bcrypt')
const authBlock = require('../js-serverside/utility/authMiddleware').authBlock
const passport = require('passport');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

let errs = []

const blacklist = ['settings', 'donate', 'login', 'register', 'about', 'forgot']

//! MIDDLEWARE FUNCTION TO VALIDATE REGISTER CREDENTIALS
async function regWare(req, res, next) {
  errs = []
  const { email, password, password2, username} = req.body //pulls the email, the password, and the retyped password from the request body//keeps a log of what was not a valid register input
  const token = req.body['g-recaptcha-response']
  let human

  console.log('CONFIRMING TOKEN', token)
  
  if(token){
    const secret = process.env.GOOGLE_SERVER_SECRET
    const verify = new XMLHttpRequest()
    verify.open('POST', `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`)
    verify.send()
  
    verify.onload = () => {
      human = JSON.parse(verify.responseText).success
      !human && errs.push({msg: "Captcha Failed"})
    }
  } else{
    errs.push({msg: "Google Captcha left unchecked"})
  }

  try{
    if (email) {
      const emailValid = validator.isEmail(email) //uses the validator api to check if the email uses valid syntax and returns a true or false

      if (!emailValid) {
        errs.push({ msg: "Invalid email" }) //if email does not contain valid syntax, push an error to the error array
      } else {
        await User.findOne({email}, (err, user) => { //if email is valid syntax, check to see if the db already contains a user with that email
          if(email.length > 30){
            errs.push({ msg: "Email too long" }) //if mongoose finds a user with that email, push an error to the error array
          }
          if (user) {
            errs.push({ msg: "Email in use" }) //if mongoose finds a user with that email, push an error to the error array
          }
        })
      }
    }

    if(username){

      var format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

      if(format.test(username)){
        errs.push({msg: "Username contains special characters"})
      }

      const found = blacklist.find(el => el.toUpperCase() === username.toUpperCase())

      if(found){
        errs.push({ msg: "Invalid username" })
      }

      if(username.length > 20){
        errs.push({ msg: "Username too long" }) //if email, password, or retyped password is missing from the request body, push an error to the error array   
      }

      else{
        await User.findOne({username}, (err, user) => {
          if(user){
            errs.push({msg: "Username taken"})
          }
        }).collation({locale: 'en', strength: 2})
      }
    }

    if (!email || !password || !password2 || !username) {
      errs.push({ msg: "Missing field" }) //if email, password, or retyped password is missing from the request body, push an error to the error array
    }

    if (password.length < 6) {
      errs.push({ msg: "Password too weak" }) //if password i less than 6 chars, push an error to the error array
    }

    if(password.length > 20){
      errs.push({msg: 'Password too long'})
    }

    if (password && password2 && password !== password2) { //if the password does not match the retyped password, push an error to the error array
      errs.push({ msg: "Passwords did not match" })
    }

    if (errs.length > 0) { //if the error array is greater than 1, keep the user on the register page and display the errors
      const errorInputs = [username, email, password]
      res.render('dashView-register', {layout: './layouts/dashboard', home: false, errs: errs, userInfo: false, inputs: errorInputs})
    } else {
      console.log('no errors, moving on')
      next() //if the error array is empty, move on
    }
  } catch(err){
    errs.push({msg: 'Internal Server Error'})
    const errorInputs = [username, email, password]
    res.render('dashView-register', {layout: './layouts/dashboard', home: false, errs: errs, userInfo: false, inputs: errorInputs})
  }
}

const regSave = async(req, res, next) => {
  const { email, password, username } = req.body //pull the email and password from the request body
  try{
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, salt)

    const newUser = new User({ //use mongoose to create a new instance of the user class with the inputted email and pass
      email,
      username,
      password: hashedPass,
    })
  
    await newUser.save().then(async(user) => {next()})
    .catch(err => {throw err})

    //save the new instance of the user class to the database with mongoose
    //req.session.userId = newUser._id   //the userId property == the user's default ._id property, making it easy to find the user by the current session
    //finally, after saving the registered user to the database and creating the session property, the user is brought to the dashboard
  } catch(err){
    const errorInputs = [username, email, password]
    errs.push({msg: 'Internal Server Error'})
    res.render('dashView-register', {layout: './layouts/dashboard', home: false, errs: errs, userInfo: false, inputs: errorInputs})
  }
}

//! GET ROUTE FOR THE REGISTER PAGE
regPages.get("/", authBlock, (req, res) => { //check if already logged in, and if not, send the user to the register page
    errs = []
    res.render('dashView-register', {home: false, errs: false, inputs: false, userInfo: false, layout: './layouts/dashboard', })
})

//! POST ROUTE THAT REDIRECTS USER TO DASHBOARD IF REGISTERED CORRECTLY
regPages.post("/", regWare, regSave, passport.authenticate('local-register', {
  session: true,
  failureRedirect: '/register',
  successRedirect: '/dashboard'
}))

module.exports = regPages
