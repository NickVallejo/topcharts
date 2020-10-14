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
})

module.exports = mongoose.model("Topsters Charts", chart_schema)
