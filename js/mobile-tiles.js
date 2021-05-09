let touch;
const delay = 500;

function timeOutClear(e){
    clearTimeout(touch)
    mobSwitch(e);
    e.target.removeEventListener('touchend', timeOutClear); 
  }

  function touchStart(e){
    e.preventDefault();
    touch = setTimeout(longPress.bind(this), delay)
    e.target.addEventListener('touchend', timeOutClear); 
  }

  function longPress(){
    const all_top = document.querySelectorAll('.top');

    this.removeEventListener('touchend', timeOutClear); 
    document.addEventListener("touchstart", closeSettings.bind(this))

    this.removeEventListener("touchstart", touchStart, {once: true})
    this.addEventListener("touchstart", tileSettings)
    this.childNodes[1].style.display = "block";
    for(i = 1; i < 5; i++){this.childNodes[i].style.opacity = "1"}

    all_top.forEach((top) => {
      top.removeEventListener("touchstart", touchStart, {once: true})
    })
  }

  function closeSettings(e){

    console.log(e.target)
    console.log(e.target.closest('.tile-hover'))

    const closeRank = this.getAttribute('rank')
    const all_top = document.querySelectorAll(`.top`);
    const top = all_top[closeRank]

    if(e.target.closest('.tile-hover') == null){
      this.childNodes[1].style.display = "none";
      for(i = 1; i < 5; i++){this.childNodes[i].style.opacity = "0"}
  
      this.addEventListener("touchstart", touchStart, {once: true})
      this.removeEventListener("touchstart", tileSettings)
      document.removeEventListener("touchstart", closeSettings.bind(this))
      addtileListeners();
    } 
  }

  function mobSwitch(e){
    const all_top = document.querySelectorAll(".top")
    let fromBox = e.target;
    const fromIndex = e.target.getAttribute("rank");
    fromBox.style.border = "2px solid gold";

    all_top.forEach(top => {
      top.removeEventListener("touchstart", touchStart, {once: true})
      document.addEventListener("touchstart", switchTo)
      top.style.opacity = .5;
      fromBox.style.opacity = 1;
    })

    async function switchTo(e){
      const toIndex = e.target.getAttribute("rank");

      if(e.target.classList.contains('top') && fromIndex !== toIndex){
        console.log('we switched')
        await tileDrag(fromIndex, toIndex)
      }

      fromBox.style.border =  "none";
      all_top.forEach(top => {
            top.addEventListener("touchstart", touchStart, {once: true})
            document.removeEventListener("touchstart", switchTo)
            top.style.opacity = 1;
      })
      
    }
  }