//! ADD EVENT LISTENERS TO NEWLY SELECTED LIST TILES
//! WE ARE WORKING ON TILE DRAG HERE
function addtileListeners(){
    console.log('checking')
      //redefines all the top tiles
      const all_top = document.querySelectorAll(".top")
  
      const width = window.innerWidth;
  
      if('ontouchstart' in document.body){
        console.log('touchstart detected')
        all_top.forEach((top) => {
          top.addEventListener("touchstart", touchStart)
          // top.addEventListener("click", mobSwitch)
          top.setAttribute("draggable", "false")
          top.removeEventListener("dragstart", dragDeskMob)
          top.removeEventListener("click", tileSettings)      
          top.removeEventListener("drop", dropDeskMob)
        })
      } else{
        console.log('touchstart not detected')
      all_top.forEach((top) => {
        top.removeEventListener("touchstart", touchStart)
        top.addEventListener("click", tileSettings)      
        //checks if the dropped tile is from a top tile or a sugg tile
        top.addEventListener("drop", dropDeskMob)
        // top.addEventListener("touchend", dropDeskMob)
  
        //necessary defaults prevented for correct functionality
        top.addEventListener("dragenter", (e) => e.preventDefault())
        top.addEventListener("dragover", (e) => e.preventDefault())
  
        // lets you drag a top tile
        top.setAttribute("draggable", "true")
        top.addEventListener("dragstart", dragDeskMob)
      })
    }
  }
  
    function dragDeskMob(e){
      console.log(e.target);
      e.dataTransfer.setData("rank", e.target.getAttribute("rank"))
      e.dataTransfer.setData("switch", true)
    }
  
    function dropDeskMob(e){
      e.stopImmediatePropagation()
      e.preventDefault();
      console.log(e.target)
      if(e.dataTransfer.getData("switch")){
        console.log("switch!!")
        const dragFromIndex = e.dataTransfer.getData("rank")
        const dragToIndex = e.target.getAttribute("rank")
        tileDrag(dragFromIndex, dragToIndex)
      } else{
        const suggIndex = e.dataTransfer.getData("text/plain")
        const tileIndex = e.target.getAttribute("rank")
        console.log('TILE INDEX 45', tileIndex)
        tileDrop(suggIndex, tileIndex)
      }
    }