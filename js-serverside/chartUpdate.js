const {User} = require("../index")
const {Chart} = require("../index")

//! UPDATES AN EXISTING CHART
async function chartUpdate(req, res, next) {
    //May need to pass in query where it specifies what kind of chart (music, movie, videogame)
    const { title, updatedChart } = req.body
  
    try {
      //find current user by their id
      const user = await User.findById(req.user.id)
      //find chart with the query string title and user's id as the author
      const chart = await (Chart.findOne({title, author: user._id}));

      if(user && chart){
        chart.chart = updatedChart;
        chart.save();
      }
      res.end()
      }
     catch (err) {
      console.log(err)
    }

  }

  global.chartUpdate = chartUpdate