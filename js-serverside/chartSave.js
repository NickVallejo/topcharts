const User = require("../models/user_model")
const Chart = require("../models/chart_model")

//! SAVES A NEW CHART TO USER'S CHARTS LIST
async function chartSave(req, res, next) {
    const { title, chart } = req.body
  
    const new_chart = new Chart({
      title,
      chart,
    })
  
    try {
      const user = await User.findById(req.session.userId)
      if (user) {
        await user.musicCharts.push(new_chart)
        await user.save()
        next()
      }
    } catch (err) {
      res.json({ message: err })
    }
  }

  global.chartSave = chartSave