const express = require('express');
const profile = express.Router();
const path = require('path');

const Users = require('../models/user_model');

profile.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/profile.html"))
})

profile.get('/stuff', async (req, res) => {
    await Users.findById(req.session.userId, (err, user) => {
        if (user) {
          res.send(user.musicCharts)
        }
      })
})

module.exports = profile