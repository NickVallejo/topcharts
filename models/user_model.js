const mongoose = require("mongoose")
const db_connect = require('../index')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  musicCharts: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Topsters Charts'
      }
  ],
  followers: {
    type: Array,
    default: []
  },
  following: {
    type: Array,
    default: []
  },
  profileImage: {
    type: String,
    default: 'images/default-icon.png'
  },
  googleId: {
    type: Number,
    required: false
  },
  facebookId: {
    type: Number,
    required: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
})

const User = userSchema
module.exports = User
