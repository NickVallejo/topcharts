const ytWrap = document.querySelector('.yt-wrap')

//DELETE A TILE FROM A LIST
function tileSettings(e) {
  console.log('clicked!')
  if (e.target.classList.contains("frontDel")) {
    const position = e.target
    const positionToDel = position.parentNode.getAttribute("rank")
    console.log(positionToDel)
    topWrapper.childNodes[positionToDel].style.backgroundImage = ""
    topWrapper.childNodes[positionToDel].childNodes[2].remove()
    chartNamesWrapper.childNodes[positionToDel].textContent = `${parseInt(positionToDel)+1}.`

    if (my_list.title !== undefined) {
      my_list.chart.splice(positionToDel, 1, null)
      console.log("list after splice", my_list)
      chartUpdate()
    } else {
      my_list.splice(positionToDel, 1, null)
      console.log(my_list)
      localStorage.setItem("unsavedList", JSON.stringify(my_list))
    }
  } else if(e.target.classList.contains("frontPlay")){
      let ytSearch = new XMLHttpRequest()
      let ytAlbum

      if(my_list.chart !== undefined){
        ytAlbum = my_list.chart[e.target.parentNode.getAttribute('rank')]
        console.log(ytAlbum)
      } else{
        ytAlbum = my_list[e.target.parentNode.getAttribute('rank')]
        console.log(ytAlbum)
      }

      ytSearch.open("GET", `http://localhost:4000/yt-listen?artist=${ytAlbum.artist}&album=${ytAlbum.album_name}`)
      ytSearch.onload = () => {

        let ytExit
        let ytVid

        const url = ytSearch.responseText.replace("watch?v=", "embed/")
        ytWrap.innerHTML = `<div class="yt-vid"><p class="yt-exit">X</p><iframe width="560" height="315" src=${url}?rel=0&controls=1&autoplay=1&mute=0 allow="autoplay" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
        ytExit = document.querySelector('.yt-exit')
        ytVid = document.querySelector('.yt-vid')
        
        ytExit.addEventListener('click', () => {
            ytVid.remove()
        })
      }
      ytSearch.send()
  }
}


