const mongoose = require('mongoose')
const express = require("express")
const regPages = express.Router()
const path = require("path")
const {User} = require("../index")
const validator = require("validator")
const bcrypt = require('bcrypt')

//! MIDDLEWARE FUNCTION TO CHECK IF USER IS ALREADY LOGGED IN WHEN TRYING TO ACCESS THE REGISTER PAGE
function logCheck(req, res, next) { //checks to see if a user session is set. If so, redirect to the dashboard. If not, go to the desired register or login page.
  if (req.session.userId) {
    res.redirect("/dashboard")
  } else {
    next()
  }
}

//! MIDDLEWARE FUNCTION TO VALIDATE REGISTER CREDENTIALS
async function regWare(req, res, next) {

  console.log(User);
  
  console.log('posted', req.body)

  const { email, password, password2, username } = req.body //pulls the email, the password, and the retyped password from the request body

  const errs = [] //keeps a log of what was not a valid register input

  if (email) {
    const emailValid = validator.isEmail(email) //uses the validator api to check if the email uses valid syntax and returns a true or false

    if (!emailValid) {
      errs.push({ msg: "Invalid email..." }) //if email does not contain valid syntax, push an error to the error array
    } else {
      console.log('we got here')
      await User.findOne({ email }, (err, user) => { //if email is valid syntax, check to see if the db already contains a user with that email
        if(err){
          console.log(err)
        }
        
        if (user) {
          errs.push({ msg: "Email in use..." }) //if mongoose finds a user with that email, push an error to the error array
        } else {
          console.log("Email is free...") //
        }
      })
    }
  }

  if(username){

    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    console.log(format.test(username), "TESTING");

    if(format.test(username)){
      errs.push({msg: "username contains special characters"})
    }

    if(username.length > 12){
      errs.push({ msg: "Username too long" }) //if email, password, or retyped password is missing from the request body, push an error to the error array   
    }

    else{
      await User.findOne({username}, (err, user) => {
        if(user){
          errs.push({msg: "username taken"})
        }
      })
    }
  }

  if (!email || !password || !password2 || !username) {
    errs.push({ msg: "Missing field" }) //if email, password, or retyped password is missing from the request body, push an error to the error array
  }

  if (password.length < 6) {
    errs.push({ msg: "Password too weak" }) //if password i less than 6 chars, push an error to the error array
  }

  if (password && password2 && password !== password2) { //if the password does not match the retyped password, push an error to the error array
    errs.push({ msg: "Passwords did not match" })
  }

  if (errs.length > 0) { //if the error array is greater than 1, keep the user on the register page and display the errors
    const errorInputs = [username, email, password]
    res.render('dashView-register', {layout: './layouts/dashboard', home: false, errs: errs, logged: false, userInfo: '', inputs: errorInputs})
  } else {
    console.log('no errors, moving on')
    next() //if the error array is empty, move on
  }
}

//! GET ROUTE FOR THE REGISTER PAGE
regPages.get("/", logCheck, (req, res) => { //check if already logged in, and if not, send the user to the register page
    res.render('dashView-register', {home: false, errs: false, inputs: false, logged: false, userInfo: '', layout: './layouts/dashboard', })
})

//! POST ROUTE THAT REDIRECTS USER TO DASHBOARD IF REGISTERED CORRECTLY
regPages.post("/", regWare, async (req, res, next) => { //the request body will be validated by the regWare middleware, then passed to this function

  const { email, password, username } = req.body //pull the email and password from the request body
  if( res.locals.errs){
    res.redirect('/register')
  }
  try{
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, salt)

    const newUser = new User({ //use mongoose to create a new instance of the user class with the inputted email and pass
      email,
      username,
      password: hashedPass,
    })
  
    await newUser.save().then(console.log(newUser, 'NEW USER')) //save the new instance of the user class to the database with mongoose
    req.session.userId = newUser._id   //the userId property == the user's default ._id property, making it easy to find the user by the current session
    res.redirect("/dashboard") //finally, after saving the registered user to the database and creating the session property, the user is brought to the dashboard
  } catch{
    res.status(500).send()
  }
  
})

module.exports = regPages
