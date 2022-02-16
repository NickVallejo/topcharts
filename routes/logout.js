const express = require("express")
const logout = express.Router()
const path = require("path")

//! POST ROUTE FOR LOGGING OUT AND DESTROYING THE SESSION
logout.post("/", (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = logout
