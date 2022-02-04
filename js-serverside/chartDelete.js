const {User} = require("../index")
const {Chart} = require("../index")

async function chartDelete(req, res, next) {
    console.log("name of the title we were passed " + JSON.stringify(req.body))
    const title = req.body.name

          //find current user by their id
          const user = await User.findById(req.user.id)
          //find chart with the query string title and user's id as the author
          console.log(`looking for chart with ${title} and ${user._id}`);
          
          await Chart.findOne({title, author: user._id}, (err, deleted)=>{
            try{
              
              if(deleted){
                deleted.remove()
                const userChartData = user.musicCharts.find(chart => JSON.stringify(chart) == JSON.stringify(deleted._id))
                
                console.log(deleted._id, 'REMVOED FROM CHART COL')
                console.log(userChartData, 'REMOVED FROM USER CHART ARRAY')

  
                const index = user.musicCharts.indexOf(userChartData)
                res.locals.indexOfChart = JSON.stringify(index)
                console.log('INDEX OF CHART', index)
                user.musicCharts.splice(index, 1);
                user.save(()=> {
                  res.end(res.locals.indexOfChart)
                });
              } else{
                console.log('no doc found')
              }
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