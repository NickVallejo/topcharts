let touch, touchMoved, isScrolling;

function mobSearchAdd(e){

//   const loadedSuggs = document.querySelectorAll(".sugg_album")

//   loadedSuggs.forEach((sugg) => {
//     sugg.removeEventListener("touchend", mobSearchAdd)
// })

    if(handler){
      document.removeEventListener("touchend", handler)
    }

    const all_top = document.querySelectorAll('.top')
    const fromIndex = this.getAttribute('index')
    const handler = mobSearchPlace.bind(this)
    
    this.style.border = "2px solid #23b12a"

    all_top.forEach(top => {
      top.removeEventListener("touchend", touchStart)
    })

    setTimeout(()=>{
      document.addEventListener("touchend", handler);
    }, 50)

   async function mobSearchPlace(e){

      if(e.target.classList.contains('.sugg_album')){
            mobSearchAdd(e);
      }

      else if(e.target.classList.contains('top')){
            const toIndex = e.target.getAttribute('rank')
            await tileDrop(fromIndex, toIndex)

            this.style.border = "none";
            setTimeout(() => {
              addtileListeners();
            }, 50)
        } else{
            this.style.border = "none";
            setTimeout(() => {
              addtileListeners();
            }, 50)
        }
        // document.removeEventListener("touchstart", mobSearchPlace);
        // document.removeEventListener("touchend", handler);

        // loadedSuggs.forEach((sugg) => {
        //     sugg.addEventListener("touchend", mobSearchAdd)
        // })
    }
}

function touchStart(e){  
    if(touchMoved != true){
    const all_top = document.querySelectorAll(".top")
    let fromBox = e.target;
    const fromIndex = e.target.getAttribute("rank");

    fromBox.classList.add('select-border')

    if(fromBox.childNodes[1] != undefined){
      fromBox.childNodes[1].style.display = "block";
      for(i = 1; i < 5; i++){
          fromBox.childNodes[i].style.opacity = "1"
          fromBox.childNodes[i].style.pointerEvents = "all"
      }
      fromBox.addEventListener("touchend", tileSettings)
    }

    all_top.forEach(top => {
      top.removeEventListener("touchend", touchStart)
      top.style.opacity = .5;
      fromBox.style.opacity = 1;
    })

    setTimeout(() => {
      document.addEventListener("touchend", switchTo)
    }, 100)

    async function switchTo(e){

      if(e.target.closest('.top') == null){
        console.log('NUL NUL NUL')
        document.removeEventListener("touchend", switchTo)

        if(fromBox.childNodes[1] != undefined){
          fromBox.childNodes[1].style.display = "none"
              for(i = 1; i < 5; i++){
                fromBox.childNodes[i].style.opacity = "0"
                fromBox.childNodes[i].style.pointerEvents = "none"
              }
              fromBox.removeEventListener("touchend", tileSettings)
          }
      }

      if(touchMoved != true && 
        !e.target.classList.contains("frontPlay") && 
        !e.target.classList.contains("frontRank") &&
        !e.target.classList.contains("tile-title")
        ){
      
      const toBox = e.target;
      const toIndex = e.target.getAttribute("rank");
      const theBox = toBox.childNodes[1] == undefined ? toBox : fromBox
      console.log('GOING TO ', e.target, fromIndex, toIndex)

      if(e.target.classList.contains('top') && fromIndex !== toIndex){
        await tileDrag(fromIndex, toIndex)
      }

      fromBox.style.border =  "2px solid #13191b";
      all_top.forEach(top => {
            top.addEventListener("touchend", touchStart)
            top.style.opacity = 1;
      })

      document.removeEventListener("touchend", switchTo)

      if(theBox.childNodes[1] != undefined){
        theBox.childNodes[1].style.display = "none"
            for(i = 1; i < 5; i++){
              theBox.childNodes[i].style.opacity = "0"
              theBox.childNodes[i].style.pointerEvents = "none"
            }
            theBox.removeEventListener("touchend", tileSettings)
        }

          const selectBorder = document.querySelector('.select-border')
          selectBorder.classList.remove('select-border')
    
    }
  }

    function tileSettings(e) {
      if (e.target.classList.contains("frontDel")) {
        const position = e.target
        const positionToDel = position.parentNode.getAttribute("rank")
        console.log(positionToDel)
        //deletes the background image
        topWrapper.childNodes[positionToDel].style.backgroundImage = ""
        //loops through the element, deleting everything but the rank number
        const selectedNodes = topWrapper.childNodes[positionToDel].childNodes

        //removes all the nodes associated with "filled tile" functionality (ie. play, delete, title, etc.)
        while(selectedNodes.length > 1){
          topWrapper.childNodes[positionToDel].childNodes[1].remove();
        }
        //removes the album from the chartnames side-list
        chartNamesWrapper.childNodes[positionToDel].textContent = `${parseInt(positionToDel)+1}.`

        //removes the element from the list array nad updates
        if (my_list.title !== undefined) {
          my_list.chart.splice(positionToDel, 1, null)
          console.log("list after splice", my_list)
          chartUpdate()
        } else {
          my_list.splice(positionToDel, 1, null)
          console.log(my_list)
          localStorage.setItem("unsavedList", JSON.stringify(my_list))
        }
        addtileListeners();
      } else if(e.target.classList.contains("frontPlay")){
        console.log('you clicked yt play')
        let myListVariable = my_list.chart == undefined ? my_list : my_list.chart;

        const artist = myListVariable[e.target.parentNode.getAttribute('rank')].artist
        const album = myListVariable[e.target.parentNode.getAttribute('rank')].album_name
        console.log(artist, album)
        ytPlay(artist, album)
      } else if(e.target.classList.contains("tile-hover")){
        console.log('tile HOVER DETEDCTED')
        this.childNodes[1].style.display = "none";
        this.classList.remove('info-hover')
        for(i = 1; i < 5; i++){
            this.childNodes[i].style.opacity = "0"
            this.childNodes[i].style.pointerEvents = "none"
          }

        e.target.removeEventListener("touchend", tileSettings)
        setTimeout(() => {
          addtileListeners();
        }, 100)
      }
    }
  }
}

function touchMove(){
  console.log('scrolling')
  touchMoved = true;

  clearTimeout(isScrolling);

  isScrolling = setTimeout(() => {
    console.log('scrolling has stopped')
    // addtileListeners();
    touchMoved = false;
  }, 66)
}