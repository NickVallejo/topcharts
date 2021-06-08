let touch, touchMoved, isScrolling;

function mobSearchAdd(e){
  console.log('mob search add triggered')
    document.removeEventListener("touchend", mobSearchPlace)

    const all_top = document.querySelectorAll('.top')
    const fromIndex = e.target.getAttribute('index')
    const chosen = e.target
    
    e.target.style.border = "2px solid #23b12a"

    all_top.forEach(top => {
      top.removeEventListener("touchend", touchStart)
    })

    setTimeout(()=>{
      document.addEventListener("touchend", mobSearchPlace)
    }, 50)

   async function mobSearchPlace(e){

      if(e.target.classList.contains('sugg_album')){
        console.log(e.target)
        console.log(chosen)

            if(e.target != chosen){
              console.log('picked first if')
              mobSearchAdd(e);
              chosen.style.border = "none"; 
            } else{
              console.log('picked second if')
              chosen.style.border = "none"; 
            }
      }

      else if(e.target.classList.contains('top') && touchMoved != true){
            const toIndex = e.target.getAttribute('rank')
            await tileDrop(fromIndex, toIndex)

            chosen.style.border = "none";
            setTimeout(() => {
              addtileListeners();
            }, 50)
        } 
        
      else{
            chosen.style.border = "none";
        }

      document.removeEventListener("touchend", mobSearchPlace)
    }
}

function touchStart(e){  
  const suggAlbums = document.querySelectorAll('.sugg_album')
  console.log("NEW TOUCH START")

    //If currently not scrolling, do this on touchstart
    if(touchMoved != true && e.target.classList.contains('top')){
    const all_top = document.querySelectorAll(".top")
    const fromIndex = e.target.getAttribute("rank");
    let fromBox = e.target;

    //add select border whether it's a filled tile or not
    fromBox.classList.add('select-border')

    //remove event listeners for thee sugg albums in the search field
    suggAlbums.forEach(album => {
      album.removeEventListener('touchend', mobSearchAdd)
    })

    //if it's a filled tile, add some styles that are hidden
    if(fromBox.childNodes[1] != undefined){
      fromBox.childNodes[1].style.display = "block";
      for(i = 1; i < 5; i++){
          fromBox.childNodes[i].style.opacity = "1"
          fromBox.childNodes[i].style.pointerEvents = "all"
      }
      fromBox.addEventListener("touchend", tileSettings)
    }

    //make the other tiles darker and remove the touchstart event listener 
    all_top.forEach(top => {
      top.removeEventListener("touchend", touchStart)
      top.style.opacity = .5;
      fromBox.style.opacity = 1;
    })

    //add the switchTo event lsitener
    setTimeout(()=>{
      document.addEventListener("touchend", switchTo)
    },1)


    async function switchTo(e){

      console.log('SWITCH TO TRIGGERED')
      //if a the currently seelected tile is tapped, a random area is tapped, or a sugg_album is tapped
      if(
      touchMoved != true &&
      e.target.closest('.top') == null || 
      touchMoved == true && e.target.classList.contains('tile-hover') ||
      e.target.classList.contains('tile-hover') ||
      e.target.classList.contains('sugg_album')
      ){

      reAdd()
      
      console.log('FIRST BIG IF')

      //remove selection border
      fromBox.classList.remove('select-border')

      //remove extra select styles if it was a filled tile
      if(fromBox.childNodes[1] != undefined){
        fromBox.childNodes[1].style.display = "none"
            for(i = 1; i < 5; i++){
              fromBox.childNodes[i].style.opacity = "0"
              fromBox.childNodes[i].style.pointerEvents = "none"
            }
            fromBox.removeEventListener("touchend", tileSettings)
        }
      }

      else if(touchMoved != true && e.target.classList.contains("top")){

      console.log('SECOND BIG IF')
      
      const toBox = e.target;
      const toIndex = e.target.getAttribute("rank");
      const theBox = toBox.childNodes[1] == undefined ? toBox : fromBox

      await tileDrag(fromIndex, toIndex)

      fromBox.classList.remove('select-border')

      if(fromBox.childNodes[1] != undefined){
        fromBox.childNodes[1].style.display = "none"
            for(i = 1; i < 5; i++){
              fromBox.childNodes[i].style.opacity = "0"
              fromBox.childNodes[i].style.pointerEvents = "none"
            }
            fromBox.removeEventListener("touchend", tileSettings)
      }

      if(toBox.childNodes[1] != undefined){
        toBox.childNodes[1].style.display = "none"
            for(i = 1; i < 5; i++){
              toBox.childNodes[i].style.opacity = "0"
              toBox.childNodes[i].style.pointerEvents = "none"
            }
            toBox.removeEventListener("touchend", tileSettings)
        }

      reAdd()

    } 

    function reAdd(){
      //no matter where a switch to is made, turn the sugg album event listeners back on
      suggAlbums.forEach(album => {
        album.addEventListener('touchend', mobSearchAdd)
      })

      document.removeEventListener("touchend", switchTo)

      setTimeout(() => {
          all_top.forEach(top => {
            top.addEventListener("touchend", touchStart)
            top.style.opacity = 1;
        })
      }, 10)
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
}

function touchMove(){
  console.log('SCROLLING')
  touchMoved = true;

  clearTimeout(isScrolling);

  isScrolling = setTimeout(() => {
    console.log('STOPPED SCROLLING')
    touchMoved = false;
  }, 65)
}