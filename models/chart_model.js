const mongoose = require("mongoose")
const db_connect = require('../index')

const chartSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  chart: {
    type: Object,
    required: true,
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
  },
  tags: {
    type: Array,
    default: []
  }
})

const Chart = chartSchema
module.exports = Chart