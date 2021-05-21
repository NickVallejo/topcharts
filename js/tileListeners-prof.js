function addtileListeners(){
    console.log('checking')
      //redefines all the top tiles
      const all_top = document.querySelectorAll(".top")
  
      if('ontouchstart' in document.body){
        console.log('touchstart detected')
        all_top.forEach((top) => {
          top.addEventListener("touchstart", touchStart)
          top.removeEventListener("click", tileSettings)      
        })
      } else{
        console.log('touchstart not detected')
      all_top.forEach((top) => {
        top.removeEventListener("touchstart", touchStart)
        top.addEventListener("click", tileSettings)      
      })
    }
  }