const User = require("../models/user_model")

async function chartDelete(req, res, next) {
    console.log("name of the title we were passed " + JSON.stringify(req.body))
  
    await User.findById(req.session.userId)
      .then((user) => {
        user.musicCharts.forEach((chart) => {
          if (req.body.name == chart.title && user.musicCharts.length) {
            let index = JSON.stringify(user.musicCharts.indexOf(chart))
            user.musicCharts.splice(index, 1)
            res.locals.indexOfChart = index //creates a local session var for the index of the chart that was deleted on the back end
            user.save() // saves the user after deleting the chart
            next()
          }
        })
      })
      .catch((err) => console.log(err))
  }

  global.chartDelete = chartDelete