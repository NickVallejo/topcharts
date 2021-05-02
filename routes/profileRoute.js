const express = require('express');
const profile = express.Router();
const path = require('path');

const Users = require('../models/user_model');

//! RETRIEVE CHART DATA WHEN THE PROFILE PAGE IS REACHED
//! ROUTE WILL FIND THE CHART DATA THAT CORRESPONDS WITH THE USERNAME IN THE URL
profile.post('/charts', async (req, res) => {

  const {username} = req.body
    await Users.findOne({username}, (err, user) => {
        if (user) {
          res.send(user)
        }
      })
})

profile.get('/onechart', async (req, res) => {

const username = req.query.username
const chartname = req.query.chartname
  
  await Users.findOne({username}, (err, userFound) => {

    if(userFound){
      userFound.musicCharts.forEach(chartFound => {
        if(chartFound.title == chartname){
          res.send({user: userFound.username, chart: chartFound})
          res.end()
        }
      })
    } else{
      console.log('NO USER FOUND')
      res.end();
    }
  })

})

//! SENDS BACK THE USERNAME OF THE CURRENT USER LOGGED IN
profile.get('/username', async (req, res) => {
console.log('looking for user from header')
  await Users.findById(req.session.userId, (err, user) => {
    try{
      if(!user){
        console.log('no id has been set')
        res.render('404-data', {layout: './layouts/404'})
      }
      else{
        console.log('header user found')
        res.send(user)
      }
      res.end();
    } catch(err){
      console.log(err);
      res.end();
    }
  })
})

module.exports = profile