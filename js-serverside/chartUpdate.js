const User = require("../models/user_model")

//! UPDATES AN EXISTING CHART
async function chartUpdate(req, res, next) {
    //May need to pass in query where it specifies what kind of chart (music, movie, videogame)
    const { title, updatedChart } = req.body
  
    try {
      const user = await User.findById(req.session.userId)
  
      if (user) {
        let chartToUpdate = await user.musicCharts.find((chart) => chart.title == title)
        const index = await user.musicCharts.indexOf(chartToUpdate)
        user.musicCharts[index].chart = updatedChart //This is the line where the chart is updated
        user.markModified("musicCharts")
        await user.save()
      }
    } catch (err) {
      console.log(err)
    }
  
    next()
  }

  global.chartUpdate = chartUpdate