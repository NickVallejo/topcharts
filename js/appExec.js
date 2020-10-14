var input = document.querySelector(".top_input")
var suggs_box = document.querySelector(".input_suggs")
var save = document.querySelector(".save")
var load = document.querySelector(".load")
var clear = document.querySelector(".clear")
var saved_div = document.querySelector(".saved")
var reccs = document.querySelector(".album_reccs")
const all_top = document.querySelectorAll(".top")
var frontEndTitle = document.querySelector(".chart_title")
const chartData = document.querySelectorAll(".albumInfo")
const numRadio = document.querySelector(".chartNums")
const frontRanks = document.querySelectorAll(".frontRank")
let sugg_array

let savedOnFrontEnd
let suggsLoaded = false
let my_list = new Array(10)
var saved_list = []

save.addEventListener("click", chartSave)
clear.addEventListener("click", list_new)
numRadio.addEventListener("click", numToggle)

//! ADDS EVENT LISTENERS TO ALL TILES
all_top.forEach((top) => {
  top.addEventListener("click", trashTile)
})

//! DETECTS A PRESS OF "ENTER"
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 13) {
    if (input.value) {
      search(input.value)
    }
  }
})

//! CLEARS PROJECT BOARD FOR NEW LIST
function list_new() {
  chartData.forEach((albumInfo) => {
    albumInfo.innerHTML = ""
  })

  my_list = new Array(10)

  for (i = 0; i < 10; i++) {
    all_top[i].style.backgroundImage = "none"
  }

  frontEndTitle.textContent = "Chart Title:"
  localStorage.removeItem("unsavedList")
}

async function appExecute() {
  await list_load().then(sugg_load).then(checkForUnsaved)
}

async function list_load() {
  try {
    await new Promise((resolve, reject) => {
      req = new XMLHttpRequest()
      req.open("GET", "http://localhost:4000/my-lists", true)
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      req.onload = () => {
        console.log("Get request sent to database...")

        loaded_lists = JSON.parse(req.responseText)
        loaded_lists.forEach((load) => {
          saved_list.push({ title: load.title, chart: JSON.parse(load.chart) })
          var space_title = load.title.replace(/_/g, " ")
          var saved_front =
            '<div class="saved_item"><h2 class="saved_title" name=' +
            load.title +
            ">" +
            space_title +
            '</h2><i class="fa fa-trash" aria-hidden="true"></i></div>'
          saved_div.insertAdjacentHTML("beforeend", saved_front)
          saved_div.addEventListener("click", saved_click)
        })

        console.log("saved list reloaded", saved_list)
        resolve()
      }

      req.send()
    })
  } catch {
    reject()
  }
}

function sugg_load() {
  sugg_loader = new XMLHttpRequest()
  sugg_loader.open("GET", "http://localhost:4000/similar-artists")
  sugg_loader.onload = function () {
    if (sugg_loader.responseText !== "") {
      var sugg_albums = JSON.parse(sugg_loader.responseText)
      console.log("YOUR SUGGESTED ALBUMS ARE HERE", sugg_albums)

      sugg_albums.forEach(function (sugg) {
        if (sugg.image[2]["#text"] !== undefined) {
          let img = `<a class="similar" href=${sugg.url} target="_blank"><img src=${sugg.image[2]["#text"]} alt=${sugg.name}></a>`
          reccs.insertAdjacentHTML("beforeend", img)
        }
      })

      suggsLoaded = true
      console.log("SUGGS LOADED HAS BEEN MADE TRUE")
    }
  }

  if (suggsLoaded == false) {
    console.log("PASSED the sugg load because suggsLoaded = " + suggsLoaded)
    sugg_loader.send()
  } else {
    console.log("DENIED the sugg load because suggsLoaded = " + suggsLoaded)
  }
}

appExecute()
