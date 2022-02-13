const express = require("express")
const logout = express.Router()
const path = require("path")

//! POST ROUTE FOR LOGGING OUT AND DESTROYING THE SESSION
logout.get("/", (req, res) => {
  req.session.destroy()
  req.logout();
  res.redirect('/login');
})

module.exports = logout
