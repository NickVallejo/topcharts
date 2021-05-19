
const express = require("express")
const settings = express.Router()
const path = require("path")
const {User} = require("../index")
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');

//var created called storage
//takes the request, the file object, and a callback as arguments
//almost acts as middleware for every image uploaded
const storage = multer.diskStorage({
  //this property holds a function that sets the file destination
  destination: function(req, file, cb){
    cb(null, 'uploads/')
  },
  //this property holds a function that sets the file name
  filename: function(req, file, cb){
    cb(null, Date.now() + file.originalname);
  }
});

//another piece of qonq middleware that accepts the request, file object and a callback as arguments 
const fileFilterer = (req, file, cb) => {
  //checks if img file mimetype is an acceptable format
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    //checks to make sure image size is under a certain amounts
    if(file.size < 2097152){
      req.fileValidationError = 'Image size too large';
      cb(null, false, 'goes wrong on the image size');
    } else{
      console.log('file is smaller')
      cb(null, true);
    }
  } else{
    req.fileValidationError = 'Not a valid file type';
    cb(null, false, 'goes wrong on the mimetype');
  }
}

//the brain of the operation
//passes the storage and filter "middleware" used above and stores them as property values
//that belong to the object argument passed into the multer function
const upload = multer({
  storage: storage, 
  limits: {
  fileSize: fileFilterer
},
  fileFilter: fileFilterer
});

settings.get('/', (req, res) => {
    if(!req.session.userId){
      res.redirect('/login')
    } else{
      res.render('dashView-mine', {home: true, logged: true, userInfo: req.session.userInfo, layout: './layouts/settings'})
    }           
})


//a method called .single is called as middleware during the /image post process
//since this is a method of the upload object, all our parameters that were set previously
//are magically used and processed with the function
settings.post('/image', upload.single('profileImage'), (req, res, next) => {
  //when the upload.single middleware is complete, the file property is appended to the request object 
  if(req.fileValidationError){
    console.log(req.fileValidationError, 'ERROR')
    res.status(400).send({noticeType: 'error', noticeTxt: req.fileValidationError});
    delete req.fileValidationError
  } else{

  User.findById(req.session.userId, async (err, user) => {
    try{
      console.log(req.session.userInfo)
        if(user){
          //finds you, the user, and makes your profileImage property = the path property appended to the file object
          if(user.profileImage != ''){
            if(fs.existsSync(user.profileImage)){
              fs.unlinkSync(`${user.profileImage}`);
            }
          }

          user.profileImage = req.file.path

          user.save()
            .then(() => {
              console.log('saved', user.profileImage)
              req.session.userInfo.profileImage = user.profileImage;
              //returns the path to the image
              res.send(user.profileImage);
            }
              )
            .catch(err => console.log(err));
          } else{
            res.sendStatus(404);
          }
    }
    catch(err){
        console.log(err)
        res.status(500).send({noticeType: 'error', noticeTxt: 'Error Code (500) Internal Server Error.'});
    }
})
  }
})

settings.post('/email', (req, res, next) => {
  const { email, confirmPass } = req.body

  User.findById(req.session.userId, async (err, user) => {
    try{
      //no user? redirect to login
      if(!user){res.redirect('/login')}
      //if there is a user we jump to this statement
      if(user){

        if(email == user.email){
          res.send({noticeType: 'error', noticeTxt: 'You cannot update your email with your current email.'})
        } else{
          User.findOne({email}, async (err, emailUser) => {
            try{
              if(emailUser){
                res.send({noticeType: 'error', noticeTxt: 'There is already an account with this email.'});
              }
              else if(!await bcrypt.compare(confirmPass, user.password)){
                res.send({noticeType: 'error', noticeTxt: 'Incorrect password. Please try again.'})
              }
            else{
                user.email = email;
                user.save(()=> {
                  res.send({noticeType: 'success', noticeTxt: 'Email successfully changed!'})
                })
              }
            } catch(err){
              console.log(err)
            }
          })
        }
      }
    } catch(err){
      res.send({noticeType: 'error', noticeTxt: 'Error Code (500) Internal Server Error.'})
    }
  })

})

//!PASSCHANGE FUNCTION WAS HERE
settings.post('/password', (req, res, next) => {
  console.log(req.body)
if(req.body.auth){
  const query = {}
} else{
  const { current, newPass, confirmPass } = req.body

  User.findById(req.session.userId, async (err, user) => {
    try{
      console.log(user.password)
      if(!user){
        res.send({noticeType: 'error', notice:'No user found.'});
        return;
      }
      else if(!await bcrypt.compare(current, user.password)){
        res.send({noticeType: 'error', noticeTxt: 'Your existing password is incorrect.'})
      }
      else if(await bcrypt.compare(newPass, user.password)){
        res.send({noticeType: 'error', noticeTxt: 'You are trying to change your password with your existing one.'})
      }
      else{
        const salt = await bcrypt.genSalt()
        const hashedNewPass = await bcrypt.hash(confirmPass, salt)
      
        user.password = hashedNewPass
        user.save();
      
        res.send({noticeType: 'success', noticeTxt: 'You have successfully updated your password!'})
      }
    } catch(err){
      console.log(err);
      res.status(500).send({noticeType: 'error', noticeTxt: 'Error Code (500) Internal Server Error.'});
    }
  })
  }
})

  module.exports = settings;