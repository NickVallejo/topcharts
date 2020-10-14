//! FUNCTION TO SEARCH FOR ALBUMS
function search(input) {
  sugg_array = []
  suggs_box.innerHTML = ""

  req = new XMLHttpRequest()
  req.open(
    "GET",
    "http://ws.audioscrobbler.com/2.0/?method=album.search&album=" +
      input +
      "&api_key=0bb289309c3ad8b8a89446a23919f273&format=json"
  )
  req.onload = function () {
    albums = JSON.parse(req.response).results.albummatches.album

    for (i = 0; i < 50; i++) {
      if (albums[0] === undefined) {
        break
      } else {
        if (albums[i].name.includes("&")) {
          albums[i].name = albums[i].name.replace("&", "and")
        } else if (albums[i].artist.includes("&")) {
          albums[i].artist = albums[i].artist.replace("&", "and")
        }

        sugg_array.push({
          artist: albums[i].artist,
          album_name: albums[i].name,
          album_image: albums[i].image[3]["#text"],
        })
        var album_sugg = '<img class="sugg_album" index=' + i + " src=" + albums[i].image[1]["#text"] + ">"
        suggs_box.insertAdjacentHTML("beforeend", album_sugg)
      }
    }

    console.log("SUGGESTED ARRAY IS HEREs", sugg_array)
    const loadedSuggs = document.querySelectorAll(".sugg_album")

    loadedSuggs.forEach((sugg) => {
      sugg.addEventListener("click", (event) => {
        var index = event.target.getAttribute("index")
        sugg_click(index) //pass the index of the sugg we clicked
      })
    })
  }

  req.send()
}

//! FUNCTION TO ADD A SEARCHED ALBUM
function sugg_click(index) {
  //when a top10 square is clicked, execute this func
  $(".top")
    .unbind()
    .click(function () {
      if (index) {
        //this rank would be same index num as it is in my_list
        let clicked_rank = $(this).attr("rank")
        //if title property is undefined, that means the list hasn't been saved yet
        if (my_list.title == undefined) {
          //updates my_list with new addition to list
          my_list.splice(clicked_rank, 1, sugg_array[index])

          //updates front end iamge
          $(this).css("background-image", "url(" + sugg_array[index].album_image + ")")

          //updates front end words for album info on right sidebar
          chartData[clicked_rank].innerHTML = `${sugg_array[index].artist} - ${sugg_array[index].album_name}`
          console.log(my_list)
          index = ""

          localStorage.setItem("unsavedList", JSON.stringify(my_list))
        } else {
          my_list.chart.splice(clicked_rank, 1, sugg_array[index])
          $(this).css("background-image", "url(" + sugg_array[index].album_image + ")")
          chartData[clicked_rank].innerHTML = `${sugg_array[index].artist} - ${sugg_array[index].album_name}`
          console.log(my_list)
          index = ""
          chartUpdate()
        }
      }
    })
}
