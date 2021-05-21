let touch;
const delay = 300;

function timeOutClear(e){
    clearTimeout(touch)
    //start a switch with another tile
    e.target.removeEventListener('touchend', timeOutClear); 
  }


  //starts a touch on an existing tile
  function touchStart(e){
    if(e.target.classList.contains('top')){
      e.preventDefault();
      const handler = longPress.bind(this)
      //if the touch is held for delays ms then trigger a function
      touch = setTimeout(handler, delay)
      //if the touch is ended before the timout function above, then do timeoutClear
      e.target.addEventListener('touchend', timeOutClear); 
    }
  }

  //show tile settings for the tile being long pressed
  function longPress(){
    const all_top = document.querySelectorAll('.top');
    const handler = closeSettings.bind(this)

    this.removeEventListener('touchend', timeOutClear); 

    document.addEventListener("touchstart", handler)

    all_top.forEach((top) => {
        top.removeEventListener("touchstart", touchStart)
    })

    this.addEventListener("touchstart", tileSettings)

    console.log(this.childNodes);

    this.childNodes[1].style.display = "block";
    for(i = 1; i < 4; i++){
        this.childNodes[i].style.opacity = "1"
        this.childNodes[i].style.pointerEvents = "all"
    }

    function closeSettings(e){

      if(e.target.closest('.tile-hover') == null && 
      !e.target.classList.contains('frontPlay') && 
      !e.target.classList.contains('frontDel') && 
      !e.target.classList.contains('tile-title') ){
  
        this.childNodes[1].style.display = "none";
        for(i = 1; i < 4; i++){
            this.childNodes[i].style.opacity = "0"
            this.childNodes[i].style.pointerEvents = "none"
          }
  
        this.removeEventListener("touchstart", tileSettings)
        document.removeEventListener("touchstart", handler)
        addtileListeners();
      } 
    }
  }

  //close the settings for the longpressed tile if you're not touching the tile