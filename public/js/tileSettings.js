const ytWrap = document.querySelector(".yt-wrap")

//DELETE A TILE FROM A LIST
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
    while (selectedNodes.length > 1) {
      topWrapper.childNodes[positionToDel].childNodes[1].remove()
    }
    //removes the album from the chartnames side-list
    chartNamesWrapper.childNodes[positionToDel].innerHTML = `<span class="chartNameNum">${parseInt(positionToDel) + 1}. </span>`

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
    addtileListeners()
  } else if (e.target.classList.contains("frontPlay")) {
    console.log("you clicked yt play")
    let myListVariable = my_list.chart == undefined ? my_list : my_list.chart

    const artist = myListVariable[e.target.parentNode.getAttribute("rank")].artist
    const album = myListVariable[e.target.parentNode.getAttribute("rank")].album_name
    console.log(artist, album)
    ytPlay(artist, album)
  }
}

//executes the play function for the reccomendesd artists
function reccPlay(sugg_albums, e) {
  if (e.target.parentNode.classList.contains("recc")) {
    if (e.target.classList.contains("frontPlay")) {
      const albumToPlay = sugg_albums[e.target.parentNode.getAttribute("index")]
      ytPlay(albumToPlay.artist, albumToPlay.name)
    }
  }
}

//youtube play function for both the top tiles and reccs tiles
function ytPlay(artist, album) {
  let ytSearch = new XMLHttpRequest()
  ytSearch.open("GET", `http://localhost:4001/yt-listen?artist=${artist}&album=${album}`)
  ytSearch.onload = () => {
    let ytExit
    let ytVid

    const url = ytSearch.responseText.replace("watch?v=", "embed/")
    ytWrap.innerHTML = `<div class="yt-vid"><div class="yt-exit"><i class="fas fa-times"></div><iframe width="560" height="315" src=${url}?rel=0&controls=1&autoplay=1&mute=0 allow="autoplay" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    ytExit = document.querySelector(".yt-exit")
    ytVid = document.querySelector(".yt-vid")

    const slidUpMenu = document.querySelector(".set-slide-up")
    if (slidUpMenu) {
      slidUpMenu.classList.remove("set-slide-up")
    }

    ytExit.addEventListener("click", () => {
      ytVid.remove()
    })
  }
  ytSearch.send()
}

// module.exports = {tileSettings};
