const express = require("express")
const logout = express.Router()
const path = require("path")

//! POST ROUTE FOR LOGGING OUT AND DESTROYING THE SESSION
logout.post("/", (req, res) => {
  console.log(req.session)
  req.session.destroy() //destroys the session, killing the userId session property and forcing the user to re-authenticate again
  res.sendFile(path.join(__dirname, "../pages/login.html")) //redirects user back to the login page
  console.log(req.session) //console logs the session object for dev purposes
})

module.exports = logout
