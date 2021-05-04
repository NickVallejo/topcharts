const {User} = require("../index")
const {Chart} = require("../index")

//! UPDATES AN EXISTING CHART
async function chartUpdate(req, res, next) {
    //May need to pass in query where it specifies what kind of chart (music, movie, videogame)
    const { title, updatedChart } = req.body
  
    try {
      console.log('updating with this title:', title)
      //find current user by their id
      const user = await User.findById(req.session.userId)
      //find chart with the query string title and user's id as the author
      const chart = await (Chart.findOne({title, author: user._id}));

      if(user && chart){
        chart.chart = updatedChart;
        chart.save();
      }
  
      // if (user) {
      //   let chartToUpdate = await user.musicCharts.find((chart) => chart.title == title)
      //   const index = await user.musicCharts.indexOf(chartToUpdate)
      //   user.musicCharts[index].chart = updatedChart //This is the line where the chart is updated
      //   user.markModified("musicCharts")
      //   await user.save()
      next()
      }
     catch (err) {
      console.log(err)
    }

  }

  global.chartUpdate = chartUpdate