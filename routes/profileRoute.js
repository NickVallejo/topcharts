const express = require('express');
const profile = express.Router();
const isAuth = require('../js-serverside/utility/authMiddleware').isAuth

const {User} = require("../index")

//! RETRIEVE CHART DATA WHEN THE PROFILE PAGE IS REACHED
//! ROUTE WILL FIND THE CHART DATA THAT CORRESPONDS WITH THE USERNAME IN THE URL
profile.post('/charts', async (req, res) => {

  const {username} = req.body
  try{
    if(username){
      await User.findOne({username}, (err, user) => {
        if (user) {
          res.send(user)
        } else{
          res.status(404).send()
        }
      })
    } else{throw new Error('Invalid request body')}
  } catch(err){
    res.send(err.message)
  }
})

profile.get('/onechart', async (req, res) => {

const username = req.query.username
const chartname = req.query.chartname
try{
  if(username && chartname){
      await User.findOne({username}, (err, userFound) => {
        if(userFound){
          userFound.musicCharts.forEach(chartFound => {
            if(chartFound.title == chartname){
              res.send({user: userFound.username, chart: chartFound})
              res.end()
            }
          })
        } else{
          res.status(404).send();
        }
      }).populate('musicCharts')
  } else{
    throw new Error('Invalid request body')
  }
} catch(err){
  res.send(err.message)
}

})

//! SENDS BACK THE USERNAME OF THE CURRENT USER LOGGED IN
profile.get('/username', async (req, res) => {
  await User.findById(req.user.id, (err, user) => {
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