const {User} = require("../index")
const {Chart} = require("../index")

//! SAVES A NEW CHART TO USER'S CHARTS LIST
async function chartSave(req, res, next) {
    const { title, chart } = req.body
  
    try {
      const user = await User.findById(req.session.userId)
      if (user) {

        const new_chart = new Chart({
          title,
          chart,
          author: user._id
        })

        //save new chart to chart coll
        await new_chart.save();
        //save new chart id to user chart array
        await user.musicCharts.push(new_chart._id)
        //save user in userc coll
        await user.save()
        next()
      }
    } catch (err) {
      res.json({ message: err })
    }
  }

  global.chartSave = chartSave