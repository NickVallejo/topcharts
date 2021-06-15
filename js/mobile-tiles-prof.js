let touch, touchMoved, isScrolling

function touchMove() {
  console.log("scrolling")
  touchMoved = true

  clearTimeout(isScrolling)

  isScrolling = setTimeout(() => {
    console.log("scrolling has stopped")
    // addtileListeners();
    touchMoved = false
  }, 100)
}

function touchStart(e) {
  if (touchMoved != true && e.target.childNodes[1] != undefined) {
    console.log("switch from")
    const all_top = document.querySelectorAll(".top")
    let fromBox = e.target
    const fromIndex = e.target.getAttribute("rank")
    const inspected = document.querySelector(".tile-inspect")

    if (inspected) {
      inspected.classList.remove("tile-inspect")
      inspected.childNodes[1].style.display = "none"
      for (i = 1; i < 4; i++) {
        inspected.childNodes[i].style.opacity = "0"
        inspected.childNodes[i].style.pointerEvents = "none"
      }
      inspected.removeEventListener("touchend", tileSettings)
    }

    if (fromBox.childNodes[1] != undefined) {
      fromBox.classList.add("tile-inspect")
      fromBox.childNodes[1].style.display = "block"
      for (i = 1; i < 4; i++) {
        fromBox.childNodes[i].style.opacity = "1"
        fromBox.childNodes[i].style.pointerEvents = "all"
      }
      fromBox.addEventListener("touchend", tileSettings)
    }

    all_top.forEach((top) => {
      top.removeEventListener("touchend", touchStart)
    })

    setTimeout(() => {
      document.addEventListener("touchend", switchTo)
    }, 0.0001)

    async function switchTo(e) {
      console.log("switch to")

      if (
        e.target.closest(".top") == null ||
        (touchMoved == true && e.target.classList.contains("tile-hover")) ||
        e.target.classList.contains("tile-hover")
      ) {
        console.log("inside first condditional")
        all_top.forEach((top) => {
          top.addEventListener("touchend", touchStart)
        })

        document.removeEventListener("touchend", switchTo)

        if (fromBox.childNodes[1] != undefined) {
          fromBox.classList.remove("tile-inspect")
          fromBox.childNodes[1].style.display = "none"
          for (i = 1; i < 4; i++) {
            fromBox.childNodes[i].style.opacity = "0"
            fromBox.childNodes[i].style.pointerEvents = "none"
          }
          fromBox.removeEventListener("touchend", tileSettings)
        }

        return
      } else if (
        touchMoved != true &&
        !e.target.classList.contains("frontPlay") &&
        !e.target.classList.contains("frontRank") &&
        !e.target.classList.contains("tile-title")
      ) {
        console.log("inside second conditional")

        const toBox = e.target
        const toIndex = e.target.getAttribute("rank")
        const theBox = toBox.childNodes[1] == undefined ? toBox : fromBox

        //! THIS IS THE SAME

        if (fromBox.childNodes[1] != undefined) {
          fromBox.classList.remove("tile-inspect")
          fromBox.childNodes[1].style.display = "none"
          for (i = 1; i < 4; i++) {
            fromBox.childNodes[i].style.opacity = "0"
            fromBox.childNodes[i].style.pointerEvents = "none"
          }
          fromBox.removeEventListener("touchend", tileSettings)
        }

        if (toBox.childNodes[1] != undefined) {
          toBox.classList.add("tile-inspect")
          toBox.childNodes[1].style.display = "block"
          for (i = 1; i < 4; i++) {
            toBox.childNodes[i].style.opacity = "1"
            toBox.childNodes[i].style.pointerEvents = "all"
          }
          toBox.addEventListener("touchend", tileSettings)
        }

        all_top.forEach((top) => {
          top.addEventListener("touchend", touchStart)
        })

        document.removeEventListener("touchend", switchTo)
      }

      function tileSettings(e) {
        console.log(window.viewChart, "YA")

        if (e.target.classList.contains("frontPlay")) {
          let ytSearch = new XMLHttpRequest()
          let ytAlbum

          ytAlbum = window.viewChart[e.target.parentNode.getAttribute("rank")]
          console.log(ytAlbum)

          ytSearch.open(
            "GET",
            `http://localhost:4001/yt-listen?artist=${ytAlbum.artist}&album=${ytAlbum.album_name}`
          )
          ytSearch.onload = () => {
            let ytExit
            let ytVid

            const url = ytSearch.responseText.replace("watch?v=", "embed/")
            ytWrap.innerHTML = `<div class="yt-vid"><p class="yt-exit">X</p><iframe width="560" height="315" src=${url}?rel=0&controls=1&autoplay=1&mute=0 allow="autoplay" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
            ytExit = document.querySelector(".yt-exit")
            ytVid = document.querySelector(".yt-vid")

            const slidUpMenu = document.querySelector(".set-slide-up")
            if (slidUpMenu) {
              slidUpMenu.classList.remove("set-slide-up")
            }

            console.log("PANG PANG PANG")

            ytExit.addEventListener("click", () => {
              ytVid.remove()
            })
          }
          ytSearch.send()
        } else if (e.target.classList.contains("tile-hover")) {
          console.log("tile HOVER DETEDCTED")
          this.childNodes[1].style.display = "none"
          this.classList.remove("tile-inspect")
          for (i = 1; i < 4; i++) {
            this.childNodes[i].style.opacity = "0"
            this.childNodes[i].style.pointerEvents = "none"
          }

          e.target.removeEventListener("touchend", tileSettings)
          setTimeout(() => {
            addtileListeners()
          }, 100)
        }
      }
    }
  }
}
//close the settings for the longpressed tile if you're not touching the tile
