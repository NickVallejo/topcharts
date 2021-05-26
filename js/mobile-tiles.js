let touch;
const delay = 300;

function mobSearchAdd(){

    document.removeEventListener("touchstart", mobSearchPlace);

    const all_top = document.querySelectorAll('.top')
    const fromIndex = this.getAttribute('index');
    
    this.style.border = "2px solid #23b12a";

    all_top.forEach(top => {
      top.removeEventListener("touchstart", touchStart)
    })

    const handler = mobSearchPlace.bind(this)

    setTimeout(()=>{
      document.addEventListener("touchstart", handler);
    }, 0.01)

   async function mobSearchPlace(e){
        if(e.target.classList.contains('top')){
            const toIndex = e.target.getAttribute('rank')
            await tileDrop(fromIndex, toIndex)
        }
        // document.removeEventListener("touchstart", mobSearchPlace);
        document.removeEventListener("touchstart", handler);
        this.style.border = "none";
        addtileListeners();
    }

}

function timeOutClear(e){
    clearTimeout(touch)
    //start a switch with another tile
    mobSwitch(e);
    e.target.removeEventListener('touchend', timeOutClear); 
  }


  //starts a touch on an existing tile
  function touchStart(e){
    if(e.target.classList.contains('top')){
      e.preventDefault();
      const handler = longPress.bind(this)
      //if the touch is held for delays ms then trigger a function
      if(this.childNodes[1] !== undefined){
        touch = setTimeout(handler, delay)
      }
      //if the touch is ended before the timout function above, then do timeoutClear
      e.target.addEventListener('touchend', timeOutClear); 
    }
  }

  //show tile settings for the tile being long pressed
  function longPress(){
    console.log(this)
    const all_top = document.querySelectorAll('.top');
    const handler = closeSettings.bind(this)

    this.removeEventListener('touchend', timeOutClear); 

    document.addEventListener("touchstart", handler)

    all_top.forEach((top) => {
        top.removeEventListener("touchstart", touchStart)
    })

    this.addEventListener("touchstart", tileSettings)

      this.childNodes[1].style.display = "block";
      for(i = 1; i < 5; i++){
          this.childNodes[i].style.opacity = "1"
          this.childNodes[i].style.pointerEvents = "all"
      }

    function closeSettings(e){

      if(e.target.closest('.tile-hover') == null && 
      !e.target.classList.contains('frontPlay') && 
      !e.target.classList.contains('frontDel') && 
      !e.target.classList.contains('tile-title') ){
  
          console.log(this.childNodes)
          this.childNodes[1].style.display = "none";
          for(i = 1; i < 5; i++){
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

  function mobSwitch(e){
    const all_top = document.querySelectorAll(".top")
    let fromBox = e.target;
    const fromIndex = e.target.getAttribute("rank");
    fromBox.style.border = "2px solid #23b12a";

    all_top.forEach(top => {
      top.removeEventListener("touchstart", touchStart)
      document.addEventListener("touchstart", switchTo)
      top.style.opacity = .5;
      fromBox.style.opacity = 1;
    })

    async function switchTo(e){
      const toIndex = e.target.getAttribute("rank");

      if(e.target.classList.contains('top') && fromIndex !== toIndex){
        await tileDrag(fromIndex, toIndex)
      }

      fromBox.style.border =  "2px solid #13191b";
      all_top.forEach(top => {
            top.addEventListener("touchstart", touchStart)
            document.removeEventListener("touchstart", switchTo)
            top.style.opacity = 1;
      })
      
    }
  }