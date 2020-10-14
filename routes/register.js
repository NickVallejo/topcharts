const root = require("../index")
const express = require("express")
const regPages = express.Router()
const path = require("path")
const User = require("../models/user_model")
const validator = require("validator")

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
  const { email, password, password2 } = req.body //pulls the email, the password, and the retyped password from the request body

  const errs = [] //keeps a log of what was not a valid register input

  if (email) {
    const emailValid = validator.isEmail(email) //uses the validator api to check if the email uses valid syntax and returns a true or false

    if (!emailValid) {
      errs.push({ msg: "Invalid email..." }) //if email does not contain valid syntax, push an error to the error array
    } else {
      await User.findOne({ email }, (err, user) => { //if email is valid syntax, check to see if the db already contains a user with that email
        if (user) {
          errs.push({ msg: "Email in use..." }) //if mongoose finds a user with that email, push an error to the error array
        } else {
          console.log("Email is free...") //
        }
      })
    }
  }

  if (!email || !password || !password2) {
    errs.push({ msg: "Missing field..." }) //if email, password, or retyped password is missing from the request body, push an error to the error array
  }

  if (password.length < 6) {
    errs.push({ msg: "Password too weak..." }) //if password i less than 6 chars, push an error to the error array
  }

  if (password && password2 && password !== password2) { //if the password does not match the retyped password, push an error to the error array
    errs.push({ msg: "Passwords did not match..." })
  }

  if (errs.length > 0) { //if the error array is greater than 1, keep the user on the register page and display the errors
    res.redirect("/register")
    console.log(errs) //! Display the errors on the front-end
  } else {
    next() //if the error array is empty, move on
  }
}


//! GET ROUTE FOR THE REGISTER PAGE
regPages.get("/", logCheck, (req, res) => { //check if already logged in, and if not, send the user to the register page
  res.sendFile(path.join(__dirname, "../pages/register.html"))
})


//! POST ROUTE THAT REDIRECTS USER TO DASHBOARD IF REGISTERED CORRECTLY
regPages.post("/", regWare, async (req, res, next) => { //the request body will be validated by the regWare middleware, then passed to this function
  const { email, password } = req.body //pull the email and password from the request body

  const newUser = new User({ //use mongoose to create a new instance of the user class with the inputted email and pass
    email,
    password,
  })

  await newUser.save() //save the new instance of the user class to the database with mongoose

  //adds the pivotal userId property to the req.session object, permitting user to access dashboard and chart pages
  //the userId property == the user's default ._id property, making it easy to find the user by the current session
  req.session.userId = newUser._id

  await User.findById(req.session.userId, (err, user) => { //Function for the console that finds the user by their session id and dispalys the user in the console
    console.log("Here is the user... " + user)
  })

  res.redirect("/dashboard") //finally, after saving the registered user to the database and creating the session property, the user is brought to the dashboard
})

module.exports = regPages
