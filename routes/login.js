const express = require("express")
const userPages = express.Router()
const path = require("path")
const bcrypt = require('bcrypt')

const {User} = require("../index")

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
  // res.sendFile(path.join(__dirname, "../pages/login.html"))

  console.log('Pass Change Session', req.session.passChangeComplete);
  const passChanged = req.session.passChangeComplete ? true : false

  if(passChanged == true){
    delete req.session.passChangeComplete
  }

    res.render('dashView-login', {home: false, passChanged, errs: false, logged: false, userInfo: '', layout: './layouts/dashboard'})
})


//!POST ROUTE THAT REDIRECTS USER TO DASHBOARD AFTER VALID LOGIN
userPages.post("/", async (req, res, next) => {
  const { username, password } = req.body //pulls the email and password from the body of the post request
  const errs = [];

  await User.findOne({$or: [{ username: username }, {email: username}]}, async (err, user) => { //uses mongoose to findOne certain email from the user database model
    try{
      if (user) {
        console.log("user found")
        if (await bcrypt.compare(password, user.password)) { //if a user is found and the password matches, create the userId session property and redirect to dashboard
          console.log("password match")
          req.session.userId = user._id
          res.redirect("/dashboard")
        } else { //this else stament fires when the email matches but the password is incorrect. Redirects user back to login page
          errs.push({msg:"Incorrect password"})
          res.render('dashView-login', {layout: './layouts/dashboard', passChanged: false, home: false, logged: false, userInfo: '', errs: errs})
        }
      } else { //this else statement fires when there was no user with that email found. Redirects user back to login page
        errs.push({msg: "Invalid credentials"})
        res.render('dashView-login', {layout: './layouts/dashboard', passChanged: false, home: false, logged: false, userInfo: '', errs: errs})
      }
    } catch{
      res.status(500).send();
    }
    
  })
})

module.exports = userPages
