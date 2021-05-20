const mongoose = require("mongoose")
const db_connect = require('../index')

// const userStoreConnection = mongoose.createConnection(
//   "mongodb+srv://nicovallejo:weareborg@cluster0-p0vwz.azure.mongodb.net/test?retryWrites=true&w=majority",
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     try {
//       console.log("Connected to user storage...")
//     } catch (err) {
//       console.log(err)
//     }
//   }
// )

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    // index: {
    //   unique: true,
    //   collation: {
    //     locale: 'en',
    //     strength: 1
    //   }
    // }
  },
  username: {
    type: String,
    required: true,
    // index: {
    //   unique: true,
    //   collation: {
    //     locale: 'en',
    //     strength: 1
    //   }
    // }
  },
  password: {
    type: String,
    required: true,
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
    default: ''
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
})

const User = userSchema
module.exports = User
