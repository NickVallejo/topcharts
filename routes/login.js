const express = require("express")
const userPages = express.Router()
const path = require("path")
const passport = require("passport")

const Users = require("../models/user_model")

//! MIDDLEWARE FUNCTION TO CHECK IF USER IS ALREADY LOGGED IN WHEN TRYING TO ACCESS THE LOGIN PAGE
function logCheck(req, res, next) {
  if (req.session.userId) {
    res.redirect("/dashboard")
  } else {
    next()
  }
}

//! GET ROUTE FOR THE LOGIN PAGE
userPages.get("/", logCheck, (req, res) => { //check if already logged in, and if not, send the user to the login page
  res.sendFile(path.join(__dirname, "../pages/login.html"))
})


//!POST ROUTE THAT REDIRECTS USER TO DASHBOARD AFTER VALID LOGIN
userPages.post("/", async (req, res, next) => {
  const { email, password } = req.body //puls the email and password from the body of the post request

  await Users.findOne({ email }, (err, user) => { //uses mongoose to findOne certain email from the user database model
    if (user) {
      console.log("user found")
      if (user.password == password) { //if a user is found and the password matches, create the userId session property and redirect to dashboard
        console.log("password match")
        req.session.userId = user._id
        res.redirect("/dashboard")
      } else { //this else stament fires when the email matches but the password is incorrect. Redirects user back to login page
        res.redirect("/login")
        console.log("Incorrect password...")
      }
    } else { //this else statement fires when there was no user with that email found. Redirects user back to login page
      res.redirect("/login")
      console.log("Invalid credentials...")
    }
  })
})

module.exports = userPages
