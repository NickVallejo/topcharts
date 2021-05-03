const mongoose = require("mongoose")

const chart_schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  chart: {
    type: Object,
    required: true,
  },
  author: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  tags: {
    type: Array,
    default: []
  }
})

 const Chart = mongoose.model("Topsters Charts", chart_schema, 'topsters-chart-data')
 module.exports = Chart