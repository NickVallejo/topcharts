//! ADD EVENT LISTENERS TO NEWLY SELECTED LIST TILES
//! WE ARE WORKING ON TILE DRAG HERE
function addtileListeners(){
      const all_top = document.querySelectorAll(".top")
  
      const width = window.innerWidth;
  
      if('ontouchstart' in document.body){
        all_top.forEach((top) => {
          top.addEventListener("touchend", touchStart)
          top.addEventListener('touchmove', touchMove)
          // top.addEventListener("scroll", touchMove)
          // top.addEventListener("click", mobSwitch)
          top.setAttribute("draggable", "false")
          top.removeEventListener("dragstart", dragDeskMob)
          top.removeEventListener("click", tileSettings)      
          top.removeEventListener("drop", dropDeskMob)
        })
      } else{
      all_top.forEach((top) => {
        top.removeEventListener("touchstart", touchStart)
        top.removeEventListener('touchmove', touchMove)
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
      e.dataTransfer.setData("rank", e.target.getAttribute("rank"))
      e.dataTransfer.setData("switch", true)
    }
  
    function dropDeskMob(e){
      e.stopImmediatePropagation()
      e.preventDefault();
      if(e.dataTransfer.getData("switch")){
        console.log("switch!!")
        const dragFromIndex = e.dataTransfer.getData("rank")
        const dragToIndex = e.target.getAttribute("rank")
        tileDrag(dragFromIndex, dragToIndex)
      } else{
        const suggIndex = e.dataTransfer.getData("text/plain")
        const tileIndex = e.target.getAttribute("rank")
        tileDrop(suggIndex, tileIndex)
      }
    }