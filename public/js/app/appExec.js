var input = document.querySelector(".top_input")
var suggs_box = document.querySelector(".input_suggs")
var saves = document.querySelectorAll(".save")
var load = document.querySelector(".load")
var clears = document.querySelectorAll(".clear")
var saved_div = document.querySelector(".saved")
var reccs = document.querySelector(".album_reccs")
const all_top = document.querySelectorAll(".top")
const frontEndTitle = document.querySelector(".chart_title h3")
const chartData = document.querySelectorAll(".albumInfo")
const chartNamesWrapper = document.querySelector(".chart_names")
const frontRanks = document.querySelectorAll(".frontRank")
const topTen = document.getElementById("top-ten")
const topTwenty = document.getElementById("top-twenty")
const topFifty = document.getElementById("top-fifty")
const topHundred = document.getElementById("top-hundred")
const topWrapper = document.querySelector(".top_wrapper")
const numRadios = document.querySelectorAll(".chartNums")
const listRadio = document.querySelector("#listRadio")
const suggLoader = document.querySelector(".sugg-loader")
const user = document.querySelector("header #profile-img-display").getAttribute("name")

let sugg_array

let savedOnFrontEnd
let suggsLoaded = false
let my_list = new Array(10)
var saved_list = []

// saves.forEach((save) => {
//   save.addEventListener("click", chartSave)
// })

clears.forEach((clear) => {
  clear.addEventListener("click", list_new)
})

numRadios.forEach((radio) => {
  radio.addEventListener("click", numToggle)
})

listRadio.addEventListener("click", numToggle)

window.addEventListener('resize', () => {
  listRadio.checked = true
  numToggle()
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
  if (my_list.chart == undefined) {
    const allEmpty = my_list.every((album) => album == undefined)
    if (!allEmpty) {
      const saveOrNot = confirm("Hey! You are exiting an unsaved chart. Do you wish to save?")
      const saver = () => {
        if (saveOrNot == true) {
          const chartName = prompt("Enter Chart Title Here:")
          const valid = titleTester(chartName)
          if(valid){
            chartSave(chartName)
            alert(`${chartName.replace(/&/g, "and")} saved!`)
          } else{
            saver()
          }
        }
      }
      saver()
    }
  }

  topWrapper.innerHTML = ""
  chartNamesWrapper.innerHTML = ""

  my_list = new Array(10)
  setRadio(my_list.length)

  for (i = 0; i < my_list.length; i++) {
    chartNamesWrapper.insertAdjacentHTML(
      "beforeend",
      `<p class="albumInfo" rank=${i}><span class="chartNameNum">${i + 1}. </span></p>`
    )
  }

  for (i = 0; i < my_list.length; i++) {
    topWrapper.insertAdjacentHTML(
      "beforeend",
      `<div style="background-image: url()" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i + 1
      }</p></div>`
    )
  }

  frontEndTitle.textContent = "Name chart to save:"
  localStorage.removeItem(`${globalUser}-unsavedList`)
  addtileListeners()
  addTitleListener("Enter Title Here...")
  numToggle()
}


async function list_load() {
  try {
    await new Promise((resolve, reject) => {
      req = new XMLHttpRequest()
      req.open("GET", "/my-lists", true)
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      req.onload = () => {
        console.log(JSON.parse(req.responseText))
        loaded_lists = JSON.parse(req.responseText)
        
        loaded_lists.forEach((load) => {
          saved_list.push({ title: load.title, chart: load.chart })
          var space_title = load.title.replace(/_/g, " ")
          var saved_front = `<div class="saved_item"><h2 class="saved_title" name="${load.title}">${space_title}</h2><div class="saved-opts"><i class="fas fa-link share"></i><i class="fa-solid fa-x trash"></i></div></div>`
          saved_div.insertAdjacentHTML("beforeend", saved_front)
          saved_div.addEventListener("click", saved_click)
        })

        console.log("saved list reloaded", saved_list)
        resolve()
      }

      req.send()
    })
  } catch {
    reject({ err: "problem here" })
  }
}

function sugg_load(savedNames) {
  sugg_loader = new XMLHttpRequest()
  sugg_loader.open(
    "GET",
    `/similar-artists?artistNames=${encodeURIComponent(JSON.stringify(savedNames))}`,
    true
  )
  sugg_loader.onload = function () {
    if (sugg_loader.responseText !== "") {
      suggLoader.classList.remove("show-sugg-loader")
      var sugg_albums = JSON.parse(sugg_loader.responseText)

      sugg_albums.forEach((sugg, index) => {
        if (sugg.image[2]["#text"] !== undefined) {
          const img = `<div class="recc-wrap"><div class="tile-hover"></div><div class="recc" index="${index}" style="background-image: url(${sugg.image[2]["#text"]})"><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${sugg.artist} - ${sugg.name}</p></div></div>`
          reccs.insertAdjacentHTML("beforeend", img)
        }
      })

      //adds the tilesettings listener to the recc'd albums
      const eachRecc = document.querySelectorAll(".recc")
      eachRecc.forEach((rec) => {
        rec.addEventListener("click", (e) => {
          reccPlay(sugg_albums, e)
        })
      })

      suggsLoaded = true
    }
    document.removeEventListener("click", suggLoadAborter)
  }

  sugg_loader.send()

  document.addEventListener("click", suggLoadAborter)

  function suggLoadAborter(e) {
    if (e.target.tagName == "A") {
      sugg_loader.abort()
      document.removeEventListener("click", suggLoadAborter)
    }
  }
}

async function appExecute() {
  await list_load()
    .then(checkForUnsaved)
    .then(checkForView)
    .then(consolidate)
    .catch((err) => {
      console.log(err)
    })

  if (all_top) {
    await addtileListeners()
    await addTitleListener("Enter Title Here...")
  }
}

appExecute()
