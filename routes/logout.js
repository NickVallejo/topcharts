const express = require("express")
const logout = express.Router()
const path = require("path")

//! POST ROUTE FOR LOGGING OUT AND DESTROYING THE SESSION
logout.get("/", (req, res) => {
  console.log(req.session)
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.redirect('/login')
  }) //destroys the session, killing the userId session property and forcing the user to re-authenticate again
  console.log(req.session) //console logs the session object for dev purposes
})

module.exports = logout
