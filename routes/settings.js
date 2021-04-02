const root = require("../index")
const express = require("express")
const settings = express.Router()
const path = require("path")
const User = require("../models/user_model")
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilterer = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    console.log('image type passed');
    console.log(file);
    if(file.size < 2097152){
      console.log('file size passed')
      cb(new Error('file size too large'), true);
    }
    cb(null, true);
  } else{
    console.log('neither check passed')
    cb(new Error('other error with image'), false);
  }
}

const upload = multer({
  storage: storage, 
  limits: {
  fileSize: fileFilterer
},
  fileFilter: fileFilterer
});

settings.get('/', (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        try{
            if(user){
                res.render('dashView-mine', {home: true, layout: './layouts/settings'})
              } else{
                res.redirect('/login')
              }
        }
        catch(err){
            console.log(err)
        }
  })
})

settings.post('/image', upload.single('profileImage'), (req, res, next) => {
  console.log(req.file);
  User.findById(req.session.userId, (err, user) => {
    try{
        if(user){
            user.profileImage = req.file.path
            user.save()
            .then(() => {
              console.log('Image saved to profile.', user.profileImage);
              res.send(user.profileImage);
            }
              )
            .catch(err => console.log(Err));
          } else{
            res.sendStatus(404);
          }
    }
    catch(err){
        console.log(err)
        res.sendStatus(500);
    }
})
})

  module.exports = settings;