const express = require('express');
const forgot = express.Router();
const validator = require("validator")
const crypto = require('crypto')
const nodemailer = require('nodemailer');

const {User} = require('../models/user_model');

//! CHECK HERE
forgot.get('/', (req, res) => {
    if(req.session.userId){
      res.redirect('/settings');
    } else{
      res.render('dashView-forgot', {home: true, logged: false, userInfo: '', layout: './layouts/dashboard'})
    }
  })
  
  //! CHECK HERE
forgot.post('/', recoveryGen, recoverySend)

  //! CHECK HERE
function recoveryGen(req, res, next){
    const recoveryEmail = req.body.recoveryEmail;
    const emailValid = validator.isEmail(recoveryEmail)
  
    console.log(recoveryEmail)
  
    if(!emailValid){
      res.send({errorNotice: 'error', noticeTxt: 'Invalid Email.'})
    } else{
      User.findOne({email: recoveryEmail}, async (err, user) => {
        try{
          if(!user){
            res.send({errorNotice: 'error', noticeTxt: 'No user with this email found.'})
          } else{
            
            await crypto.randomBytes(20, (err, buf) => {
              const token = buf.toString('hex');
  
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
  
                user.save(() => {
                  console.log('we saved');
                  console.log(user.resetPasswordToken)
                  req.user = user;
                  req.token = token;
                  next();
                  });
            })
          }
        } catch(err){
          res.status(500).send({errorNotice: 'error', noticeTxt: 'Error Code (500) Internal Server Error.'})
        }
      })
    }
  }
  
  //! CHECK HERE
  async function recoverySend(req, res, next){
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth:{
        user: 'nico.vallejo97@gmail.com',
        pass: 'Blingboi2K'
      }
    })
  
    const mailOptions = {
      to: req.user.email,
      from: 'nico.vallejo97@gmail.com',
      subject: 'Topsters Password Reset',
      text: `Check this link to reset your password. http://localhost:4001/reset/${req.token}`
    }
  
    smtpTransport.sendMail(mailOptions, (err) => {
      if(!err){
        res.send({errorNotice: 'success', noticeTxt: 'Your confirmation email has been sent!'})
      } else{
        console.log(err)
        res.status(500).send({errorNotice: 'error', noticeTxt: 'Error Code (500) Internal Server Error. Email failed to send.'})
      }
    })
  }

module.exports = forgot