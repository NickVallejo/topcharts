
const express = require("express")
const settings = express.Router()
const {User} = require("../index")
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');
const isAuth = require('../js-serverside/utility/authMiddleware').isAuth

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
  console.log('in file filter')
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    console.log('image type is correct')
    cb(null, true);
  } else{
    console.log('image type is not correct')
    req.fileValidationError = 'Not a valid file type';
    cb(null, false, 'goes wrong on the mimetype');
  }
}

//the brain of the operation
//passes the storage and filter "middleware" used above and stores them as property values
//that belong to the object argument passed into the multer function
const upload = multer({
  storage: storage, 
  limits: {fileSize: 500000},
  fileFilter: fileFilterer
});

settings.get('/', isAuth, (req, res) => {
    res.render('dashView-mine', {home: true, userInfo: req.session.userInfo, layout: './layouts/settings'})       
})

// function multerErr(err, req, res, next){
//   console.log('in middleware', req.fileValidationError)

//   if(err){
//     err.code == 'LIMIT_FILE_SIZE' ?
//       res.status(400).send({noticeType: 'error', noticeTxt: 'Image size must be under 500kb'})
//     :
//       res.status(400).send({noticeType: 'error', noticeTxt: err.code});
//   } else{
//     next();
//   }
// }

//a method called .single is called as middleware during the /image post process
//since this is a method of the upload object, all our parameters that were set previously
//are magically used and processed with the function
settings.post('/image', isAuth, upload.single('profileImage'), async(req, res, next) => {
  //when the upload.single middleware is complete, the file property is appended to the request object
  if(req.fileValidationError){
    res.status(400).send({noticeType: 'error', noticeTxt: req.fileValidationError});
    delete req.fileValidationError
 } 
 else{
    try{
      await User.findById(req.user.id, async (err, user) => {
            if(user && req.file){
              //finds you, the user, and makes your profileImage property = the path property appended to the file object
              if(user.profileImage != ''){
                if(fs.existsSync(user.profileImage)){
                  fs.unlinkSync(`${user.profileImage}`);
                }
              }
              user.profileImage = req.file.path
              user.save()
                .then(() => {
                  res.send(user.profileImage);
                })
                .catch(err => {throw err});
              } else{
                throw new Error('Internal Server Error. User not found.')              
              }
      })
    }
    catch(err){
        res.status(500).send({noticeType: 'error', noticeTxt: err.message});
    }
  }
})

settings.post('/email', isAuth, (req, res, next) => {
  const { email, confirmPass } = req.body

  User.findById(req.user.id, async (err, user) => {
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
                // req.session.userInfo.email = email
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
      res.send({noticeType: 'error', noticeTxt: err.message})
    }
  })
})

//!PASSCHANGE FUNCTION WAS HERE
settings.post('/password', isAuth, (req, res, next) => {
if(req.body.auth){
  const query = {}
} else{
  const { current, newPass, confirmPass } = req.body

  User.findById(req.user.id, async (err, user) => {
    try{
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

settings.delete('/image', isAuth, async(req, res, next) => {
  try{
    await User.findById(req.user.id, (err, user) => {
          if(user){
            //finds you, the user, and makes your profileImage property = the path property appended to the file object
            if(user.profileImage != ''){
              if(fs.existsSync(user.profileImage)){
                fs.unlinkSync(`${user.profileImage}`);
              }
            }
            user.profileImage = 'images/default-icon.png'
            user.save()
              .then(() => {
                res.end()
              })
              .catch(err => {throw err});
            } else{
              throw new Error('Internal Server Error. User not found.')
            }
    })
  }catch(err){
      res.status(500).send({noticeType: 'error', noticeTxt: err.message});
  }
})

module.exports = settings;