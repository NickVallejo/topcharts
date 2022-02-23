const express = require("express")
const logout = express.Router()
const path = require("path")

//! POST ROUTE FOR LOGGING OUT AND DESTROYING THE SESSION
logout.get("/", async(req, res) => {
  await req.logout()
  await delete req.user
  req.session.userInfo = false
  req.session.save(() => {
    res.redirect('/')
  })
})

module.exports = logout
