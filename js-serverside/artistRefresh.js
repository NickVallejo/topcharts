const User = require("../models/user_model")

//! REPOPULATES THE ENTIRE LIST OF ARTIST NAMES ON SAVE, UPDATE, OR DELETE
//! SCREW MODIFYING THE CURRENT ARTISTNAMES ARRAY. JUST WIPE THE THING AND PUSH THEM ALL BACK IN
async function artistRefresh(req, res, next) {
    req.session.artistNames = [] //empties the artistnames session property, or creates it for the first time, depending on if this is first log or not
  
    const user = await User.findById(req.session.userId) //finds the current user by session id
  
    if (user.musicCharts.length) { //pushes every single artist from every single album in the user's charts to an array
      await new Promise((resolve, reject) => {
        user.musicCharts.forEach((chart) => {
          JSON.parse(chart.chart).forEach((album) => {
            if (album !== null && album !== undefined && !req.session.artistNames.includes(album.artist)) {
              req.session.artistNames.push(album.artist)
            }
          })
        })
        resolve()
      })
  
      await req.session.save() //saves the session and the artistNames property
    }
    next()
  }

  global.artistRefresh = artistRefresh