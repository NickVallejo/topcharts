const mongoose = require("mongoose")

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
    unique: true
  },
  username: {
    type: String,
    required: true
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

const User = mongoose.model("User", userSchema, "topsters-user-data")

module.exports = User
