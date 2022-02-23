function addtileListeners(){
      //redefines all the top tiles
      const all_top = document.querySelectorAll(".top")
  
      if('ontouchstart' in document.body){
        all_top.forEach((top) => {
          top.addEventListener("touchend", touchStart)
          top.addEventListener('touchmove', touchMove)
          top.removeEventListener("click", tileSettings)      
        })
      } else{
      all_top.forEach((top) => {
        top.removeEventListener("touchend", touchStart)
        top.removeEventListener('touchmove', touchMove)
        top.addEventListener("click", tileSettings)      
      })
    }
  }