const express = require("express")
const forgot = express.Router()
const validator = require("validator")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
require("dotenv").config()

const { User } = require("../index")
const { authBlockSettings } = require("../js-serverside/utility/authMiddleware")

//! CHECK HERE
forgot.get("/", authBlockSettings, (req, res) => {
    res.render("dashView-forgot", { home: true, userInfo: false, layout: "./layouts/dashboard" })
})

//! CHECK HERE
forgot.post("/", recoveryGen, recoverySend)

//! CHECK HERE
function recoveryGen(req, res, next) {

  try{
    const recoveryEmail = req.body.recoveryEmail
    const emailValid = validator.isEmail(recoveryEmail)
    
    if (!emailValid) {
      res.send({ errorNotice: "error", noticeTxt: "Invalid Email." })
    } else {
      User.findOne({ email: recoveryEmail }, async (err, user) => {
          if (!user) {
            res.send({ errorNotice: "error", noticeTxt: "No user with this email found." })
          } else {
            await crypto.randomBytes(20, (err, buf) => {
              const token = buf.toString("hex")
  
              user.resetPasswordToken = token
              user.resetPasswordExpires = Date.now() + 3600000
  
              user.save(() => {
                req.user = user
                req.token = token
                next()
              })
            })
          }
      })
    }
  } catch(err){
    res.send({ errorNotice: "error", noticeTxt: err.message })
  }
}

//! CHECK HERE
async function recoverySend(req, res, next) {
  const {hostname, protocol} = req
  const recoveryUrl = `${protocol}s://${hostname}`

  console.log('RECOVERY EMAIL', req.body.recoveryEmail)

  const smtpTransport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    secure: true,
    auth: {
      user: process.env.EMAIL_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    to: req.body.recoveryEmail,
    from: process.env.GMAIL_EMAIL,
    subject: "Topsters Password Reset",
    text: `Check this link to reset your password. ${recoveryUrl}/reset/${req.token}. Not you? Ignore this email.`,
  }

  smtpTransport.sendMail(mailOptions, (err) => {

    if (!err) {
      res.send({ errorNotice: "success", noticeTxt: "Your confirmation email has been sent!" })
    } else {
      console.log(err)
      res
        .status(500)
        .send({ errorNotice: "error", noticeTxt: "recoverySend() Error" })
    }
  })
}

module.exports = forgot
