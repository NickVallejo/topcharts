let touch, touchMoved, isScrolling;
const delay = 300;
const shortDelay = 100

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

  //starts a touch on an existing tile
  function touchStart(e){
    mobSwitch(e)
    longPress(e)
  }

  function touchMove(){
    console.log('scrolling')
    touchMoved = true;

    clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {
      console.log('scrolling has stopped')
      addtileListeners();
      touchMoved = false;
    }, 66)
  }

  //show tile settings for the tile being long pressed
  function longPress(e){
    if(e.target.childNodes[1] !== undefined && touchMoved != true){

    console.log('LONGPRESS TARGET', e.target.childNodes)
    const all_top = document.querySelectorAll('.top');
    const handler = closeSettings.bind(e.target)

    // this.removeEventListener('touchend', timeOutClear); 

    // all_top.forEach((top) => {
    //     top.removeEventListener("touchend", touchStart)
    // })

    e.target.childNodes[1].style.display = "block";
    e.target.classList.add('info-hover')
      for(i = 1; i < 5; i++){
          e.target.childNodes[i].style.opacity = "1"
          e.target.childNodes[i].style.pointerEvents = "all"
      }

      
    e.target.addEventListener("touchend", tileSettings)
    document.addEventListener("touchstart", handler)

    function closeSettings(e){
      //document.addEventListener('touchmove', tileInfoClose)
      // if(e.target.closest('.tile-hover') == null && 
      // !e.target.classList.contains('frontPlay') && 
      // !e.target.classList.contains('frontDel') && 
      // !e.target.classList.contains('tile-title') )
      if(e.target.classList.contains('tile-hover')){

          this.childNodes[1].style.display = "none";
          this.classList.remove('info-hover')
          for(i = 1; i < 5; i++){
              this.childNodes[i].style.opacity = "0"
              this.childNodes[i].style.pointerEvents = "none"
            }
  
        e.target.removeEventListener("touchend", tileSettings)
        document.removeEventListener("touchstart", handler)
        setTimeout(() => {
          addtileListeners();
        }, 100)
      } 
    }

    // function tileInfoClose(){
    //   const infoHover = document.querySelector('.info-hover')
    //   if(infoHover){
    //     infoHover.childNodes[1].style.display = "none";
    //     for(i = 1; i < 5; i++){
    //       infoHover.childNodes[i].style.opacity = "0"
    //       infoHover.childNodes[i].style.pointerEvents = "none"
    //       }
  
    //       infoHover.removeEventListener("touchend", tileSettings)
    //       document.removeEventListener("touchstart", handler)
    //   }
    // }

  }
}

  //close the settings for the longpressed tile if you're not touching the tile

  function mobSwitch(e){
    if(touchMoved != true){
    const all_top = document.querySelectorAll(".top")
    let fromBox = e.target;
    const fromIndex = e.target.getAttribute("rank");
    // fromBox.style.border = "2px solid #23b12a";
    fromBox.classList.add('select-border')

    console.log('we got to here?', fromBox)
    all_top.forEach(top => {
      top.removeEventListener("touchend", touchStart)
      top.style.opacity = .5;
      fromBox.style.opacity = 1;
    })

    setTimeout(() => {
      document.addEventListener("touchend", switchTo)
    }, 100)

    async function switchTo(e){
      if(touchMoved != true){

      const toIndex = e.target.getAttribute("rank");
      console.log('GOING TO ', e.target, fromIndex, toIndex)

      if(e.target.classList.contains('top') && fromIndex !== toIndex){
        await tileDrag(fromIndex, toIndex)
      }

      fromBox.style.border =  "2px solid #13191b";
      all_top.forEach(top => {
            top.addEventListener("touchend", touchStart)
            document.removeEventListener("touchend", switchTo)
            top.style.opacity = 1;
          })

          const selectBorder = document.querySelector('.select-border')
          selectBorder.classList.remove('select-border')

      // const infoHover = document.querySelector('.info-hover')
      // if(infoHover){
      //   infoHover.childNodes[1].style.display = "none";
      //   for(i = 1; i < 5; i++){
      //     infoHover.childNodes[i].style.opacity = "0"
      //     infoHover.childNodes[i].style.pointerEvents = "none"
      //     }
  
      //     infoHover.removeEventListener("touchend", tileSettings)
      //     document.removeEventListener("touchstart", handler)
      // }
      
    }
  }
  }
  }