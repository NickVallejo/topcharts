var input = document.querySelector(".top_input")
var suggs_box = document.querySelector(".input_suggs")
var save = document.querySelector(".save")
var load = document.querySelector(".load")
var clear = document.querySelector(".clear")
var saved_div = document.querySelector(".saved")
var reccs = document.querySelector(".album_reccs")
const all_top = document.querySelectorAll('.top')
const frontEndTitle = document.querySelector(".chart_title")
const chartData = document.querySelectorAll(".albumInfo")
const numRadio = document.querySelector(".chartNums")
const chartNamesWrapper = document.querySelector('.chart_names')
const frontRanks = document.querySelectorAll(".frontRank")
const topTen = document.getElementById('top-ten')
const topTwenty = document.getElementById('top-twenty')
const topFifty = document.getElementById('top-fifty')
const topWrapper = document.querySelector('.top_wrapper')
const profGo = document.querySelector('.prof-go')
let sugg_array

let savedOnFrontEnd
let suggsLoaded = false
let my_list = new Array(10)
var saved_list = []

save.addEventListener("click", chartSave)
clear.addEventListener("click", list_new)
numRadio.addEventListener("click", numToggle)

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

  topWrapper.innerHTML = ''
  chartNamesWrapper.innerHTML = ''

  my_list = new Array(10)
  setRadio(my_list.length)

  for(i=0; i< my_list.length; i++){
    chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}>${i+1}.</p>`)
  }

  for (i = 0; i < my_list.length; i++) {
    topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url()" class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
  }

  frontEndTitle.textContent = "Chart Title:"
  localStorage.removeItem("unsavedList")
  addtileListeners()
}


//! RETRIEVE THE PROFILE CURRENTLY BEING USED AND HEAD TO THAT PATH
const getMyProfile = () => {
  const req = new XMLHttpRequest();

  req.open('GET', 'http://localhost:4000/profile/username');

  req.onload = () => {
      const user = req.responseText
      console.log(user)
      window.location = `http://localhost:4000/${req.responseText}`
  }

  req.send();
}

profGo.addEventListener("click", getMyProfile)

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
    reject({err: 'problem here'})
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

async function appExecute() {
  await list_load().then(sugg_load).then(checkForUnsaved).then(checkForView)
  if(all_top){
    addtileListeners()
  }
}

appExecute()
