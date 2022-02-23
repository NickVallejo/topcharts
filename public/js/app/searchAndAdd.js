
//! FUNCTION TO SEARCH FOR ALBUMS
function search(input) {
  sugg_array = []
  suggs_box.innerHTML = ""

  req = new XMLHttpRequest()
  req.open(
    "GET",
    "https://ws.audioscrobbler.com/2.0/?method=album.search&album=" +
      input +
      "&api_key=0bb289309c3ad8b8a89446a23919f273&format=json"
  )
  req.onload = function () {
    const input = document.querySelector('.top_input')
    input.value = ''
    albums = JSON.parse(req.response).results.albummatches.album
    for (i = 0; i < 50; i++) {
      if (albums[0] === undefined) {
        break;
      }
      else if(albums[i] == undefined){
        continue;
      }
      else {
        // if (albums[i].name.includes("&")) {
        //   albums[i].name = albums[i].name.replaceAll("&", "and")
        // }
        // if (albums[i].artist.includes("&")) {
        //   albums[i].artist = albums[i].artist.replaceAll("&", "and")
        // }

        sugg_array.push({
          artist: albums[i].artist,
          album_name: albums[i].name,
          album_image: albums[i].image[3]["#text"],
        })
        var album_sugg = '<img class="sugg_album" index=' + i + " src=" + albums[i].image[3]["#text"] + ">"
        suggs_box.insertAdjacentHTML("beforeend", album_sugg)
      }
    }

    const loadedSuggs = document.querySelectorAll(".sugg_album")

    loadedSuggs.forEach((sugg) => {
      if('ontouchstart' in document.body){
        sugg.addEventListener("touchend", mobSearchAdd)
      } else{
        sugg.addEventListener("dragstart", dragSearchDeskMob)
      }
    })

  }

  req.send()
}

function dragSearchDeskMob(e){
  e.dataTransfer.setData("text/plain", e.target.getAttribute("index"))
}

//! DROPS A TILE FROM SEARCH BOX ONTO A TOP TILE
function tileDrop(suggIndex, tileIndex){

  const all_top = document.querySelectorAll('.top')
  const topWrapper = document.querySelector('.top_wrapper')

  const myListVariable = my_list.chart == undefined ? my_list : my_list.chart;
    //updates my_list with new addition to list
    myListVariable.splice(tileIndex, 1, sugg_array[suggIndex])

    //updates front end image
    all_top[tileIndex].style.backgroundImage = `url(${sugg_array[suggIndex].album_image})`
    all_top[tileIndex].innerHTML = `<p class="frontRank">${parseInt(tileIndex)+1}</p><div class="tile-hover" rank=${tileIndex}></div><i class="fas fa-times frontDel"></i><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${sugg_array[suggIndex].artist} - ${sugg_array[suggIndex].album_name}</p>`

    //adds teh dragstart event listener to the newly filled tile

    if(window.innerWidth > 900){
      all_top[tileIndex].addEventListener("dragstart", newTileDragDeskMob)
    }
    
    //updates front end words for album info on right sidebar
    chartNamesWrapper.childNodes[tileIndex].innerHTML = `<span class="chartNameNum">${parseInt(tileIndex)+1}. </span> ${sugg_array[suggIndex].artist} - ${sugg_array[suggIndex].album_name}`

    index = ""

    if(myListVariable === my_list){
      localStorage.setItem(`${globalUser}-unsavedList`, JSON.stringify(myListVariable))
    } else if(myListVariable === my_list.chart){
      chartUpdate();
    }
    
    numToggle();
}

function newTileDragDeskMob(e){
  e.dataTransfer.setData("text/plain", e.target.getAttribute("rank"))
}


//!FIX THIS TERRIBLE FUNCTION
function tileDrag(dragFromIndex, dragToIndex){

  const all_top = document.querySelectorAll('.top')
  //check if we're working with a saved or unsaved chart
  let myListVariable = my_list.chart == undefined ? my_list : my_list.chart;

    //remove the paly button if one of the tiles is becoming blank
    if(myListVariable[dragFromIndex] == null || myListVariable[dragToIndex] == null){
      const storedHTML = all_top[dragToIndex].innerHTML
      const storedObject = myListVariable[dragToIndex]

      if(myListVariable[dragFromIndex] == null){
        all_top[dragFromIndex].style.backgroundImage = all_top[dragToIndex].style.backgroundImage
        all_top[dragToIndex].style.backgroundImage = 'none'

        all_top[dragToIndex].innerHTML = all_top[dragFromIndex].innerHTML
        all_top[dragFromIndex].innerHTML = storedHTML


        const toRank = all_top[dragToIndex].childNodes[0].innerHTML
        const fromRank = all_top[dragFromIndex].childNodes[0].innerHTML
        all_top[dragToIndex].childNodes[0].innerHTML = fromRank
        all_top[dragFromIndex].childNodes[0].innerHTML = toRank

      }
      if(myListVariable[dragToIndex] == null){
        all_top[dragToIndex].style.backgroundImage = all_top[dragFromIndex].style.backgroundImage
        all_top[dragFromIndex].style.backgroundImage = 'none'

        all_top[dragToIndex].innerHTML = all_top[dragFromIndex].innerHTML
        all_top[dragFromIndex].innerHTML = storedHTML

        const toRank = all_top[dragToIndex].childNodes[0].innerHTML
        const fromRank = all_top[dragFromIndex].childNodes[0].innerHTML
        all_top[dragToIndex].childNodes[0].innerHTML = fromRank
        all_top[dragFromIndex].childNodes[0].innerHTML = toRank
      }

    //switches titles of tiles under the name wrapper
    myListVariable.splice(dragToIndex, 1, myListVariable[dragFromIndex]);
    myListVariable.splice(dragFromIndex, 1, storedObject);

    chartNamesWrapper.childNodes[dragToIndex].innerHTML = myListVariable[dragToIndex] == null ? `<span class="chartNameNum">${parseInt(dragToIndex)+1}. </span>` : `<span class="chartNameNum">${parseInt(dragToIndex)+1}. </span> ${myListVariable[dragToIndex].artist} - ${myListVariable[dragToIndex].album_name}`
    chartNamesWrapper.childNodes[dragFromIndex].innerHTML = myListVariable[dragFromIndex] == null ? `<span class="chartNameNum">${parseInt(dragFromIndex)+1}. </span>` : `<span class="chartNameNum">${parseInt(dragFromIndex)+1}. </span> ${myListVariable[dragFromIndex].artist} - ${myListVariable[dragFromIndex].album_name}`
    }

   else{

  //store one of the objects in a variable to use on the second splice
  const storedObject = myListVariable[dragToIndex]

  //switches titles of tiles under the name wrapper
  myListVariable.splice(dragToIndex, 1, myListVariable[dragFromIndex]);
  myListVariable.splice(dragFromIndex, 1, storedObject);

  //switches backgrounds of tiles
  all_top[dragToIndex].style.backgroundImage = `url(${myListVariable[dragToIndex].album_image})`;
  all_top[dragFromIndex].style.backgroundImage = `url(${myListVariable[dragFromIndex].album_image})`;

  //switches the titles of tiles
  const storedTitle = all_top[dragToIndex].childNodes[4].innerHTML
  all_top[dragToIndex].childNodes[4].innerHTML = myListVariable[dragToIndex] == null ? all_top[dragToIndex].childNodes[4].remove() : all_top[dragFromIndex].childNodes[4].innerHTML
  all_top[dragFromIndex].childNodes[4].innerHTML = myListVariable[dragFromIndex] == null ? all_top[dragFromIndex].childNodes[4].remove() : storedTitle

  chartNamesWrapper.childNodes[dragToIndex].innerHTML = myListVariable[dragToIndex] == null ? `<span class="chartNameNum">${parseInt(dragToIndex)+1}. </span>` : `<span class="chartNameNum">${parseInt(dragToIndex)+1}. </span> ${myListVariable[dragToIndex].artist} - ${myListVariable[dragToIndex].album_name}`
  chartNamesWrapper.childNodes[dragFromIndex].innerHTML = myListVariable[dragFromIndex] == null ? `<span class="chartNameNum">${parseInt(dragFromIndex)+1}. </span>` : `<span class="chartNameNum">${parseInt(dragFromIndex)+1}. </span> ${myListVariable[dragFromIndex].artist} - ${myListVariable[dragFromIndex].album_name}`
    }
  //Save chart to localstorage if it's unsaved, or update an already saved chart
  numToggle();
  if(my_list.chart == undefined){
    localStorage.setItem("unsavedList", JSON.stringify(my_list))
  } else{
    chartUpdate();
  }
}