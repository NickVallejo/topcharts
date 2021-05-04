const {User} = require("../index")
const {Chart} = require("../index")

async function chartDelete(req, res, next) {
    console.log("name of the title we were passed " + JSON.stringify(req.body))
    const title = req.body.name

          //find current user by their id
          const user = await User.findById(req.session.userId)
          //find chart with the query string title and user's id as the author
          console.log(`looking for chart with ${title} and ${user._id}`);
          
          await Chart.findOneAndRemove({title, author: user._id}, (err, deleted)=>{
            try{
              const userChartData = user.musicCharts.find(chart => chart == deleted._id)
              const index = user.musicCharts.indexOf(userChartData)
              user.musicCharts.splice(index, 1);
              user.save(()=> {
                next();
              });
            } catch(err){
              console.log('ERROR HERE', err);
            }
          })
        
  
    // await User.findById(req.session.userId)
    //   .then((user) => {
    //     user.musicCharts.forEach((chart) => {
    //       if (req.body.name == chart.title && user.musicCharts.length) {
    //         let index = JSON.stringify(user.musicCharts.indexOf(chart))
    //         user.musicCharts.splice(index, 1)
    //         res.locals.indexOfChart = index //creates a local session var for the index of the chart that was deleted on the back end
    //         user.save() // saves the user after deleting the chart
    //         next()
    //       }
    //     })
    //   })
    //   .catch((err) => console.log(err))
  }

  global.chartDelete = chartDelete