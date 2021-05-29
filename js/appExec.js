var input = document.querySelector(".top_input")
var suggs_box = document.querySelector(".input_suggs")
var saves = document.querySelectorAll(".save")
var load = document.querySelector(".load")
var clears = document.querySelectorAll(".clear")
var saved_div = document.querySelector(".saved")
var reccs = document.querySelector(".album_reccs")
const all_top = document.querySelectorAll('.top')
const frontEndTitle = document.querySelector(".chart_title h3")
const chartData = document.querySelectorAll(".albumInfo")
const chartNamesWrapper = document.querySelector('.chart_names')
const frontRanks = document.querySelectorAll(".frontRank")
const topTen = document.getElementById('top-ten')
const topTwenty = document.getElementById('top-twenty')
const topFifty = document.getElementById('top-fifty')
const topHundred = document.getElementById('top-hundred')
const topWrapper = document.querySelector('.top_wrapper')
const numRadios = document.querySelectorAll(".chartNums")
const suggLoader = document.querySelector('.sugg-loader')
let sugg_array

let savedOnFrontEnd
let suggsLoaded = false
let my_list = new Array(10)
var saved_list = []

saves.forEach(save => {
  save.addEventListener("click", chartSave)
}) 

clears.forEach(clear => {
  clear.addEventListener("click", list_new)
}) 

numRadios.forEach(radio => {
  radio.addEventListener("click", numToggle)
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

  if(my_list.chart == undefined){
    const allEmpty = my_list.every(album => album == undefined)
    if(!allEmpty){
      const saveOrNot = confirm('You are exiting an unsaved chart. Do you wish to save?')
      if(saveOrNot == true){
        const chartName = prompt('Enter Chart Title Here:')
        chartSave(chartName)
        alert(`${chartName.replace(/&/g, 'and')} saved!`)
      }
    }
  }

  topWrapper.innerHTML = ''
  chartNamesWrapper.innerHTML = ''

  my_list = new Array(10)
  setRadio(my_list.length)

  for(i=0; i< my_list.length; i++){
    chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}><span class="chartNameNum">${i+1}.</span></p>`)
  }

  for (i = 0; i < my_list.length; i++) {
    topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url()" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p></div>`)
  }

  frontEndTitle.textContent = "Chart Title:"
  localStorage.removeItem("unsavedList")
  addtileListeners()
  addTitleListener('Enter Title Here...')
  numToggle()
}

async function list_load() {

  try {
    await new Promise((resolve, reject) => {
      req = new XMLHttpRequest()
      req.open("GET", "http://192.168.0.11:4001/my-lists", true)
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      req.onload = () => {
        console.log("Get request sent to database...")

        loaded_lists = JSON.parse(req.responseText)
        loaded_lists.forEach((load) => {
          saved_list.push({ title: load.title, chart: JSON.parse(load.chart) })
          var space_title = load.title.replace(/_/g, " ")
          var saved_front = `<div class="saved_item"><h2 class="saved_title" name="${load.title}">${space_title}</h2><i class="far fa-trash"></i></div>`;
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

function sugg_load(savedNames) {

  console.log('SAVED NAMES IN SUGG_LOAD', savedNames)

  sugg_loader = new XMLHttpRequest()
  sugg_loader.open("GET", `http://192.168.0.11:4001/similar-artists?artistNames=${encodeURIComponent(JSON.stringify(savedNames))}`)
  sugg_loader.onload = function () {
    if (sugg_loader.responseText !== "") {
      suggLoader.classList.remove('show-sugg-loader');
      var sugg_albums = JSON.parse(sugg_loader.responseText)
      console.log("YOUR SUGGESTED ALBUMS ARE HERE", sugg_albums)

      sugg_albums.forEach((sugg, index) => {
        if (sugg.image[2]["#text"] !== undefined) {
          const img = `<div class="recc-wrap"><div class="tile-hover"></div><div class="recc" index="${index}" style="background-image: url(${sugg.image[2]["#text"]})"><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${sugg.artist} - ${sugg.name}</p></div></div>`
          reccs.insertAdjacentHTML("beforeend", img)
        }
      })

      //adds the tilesettings listener to the recc'd albums
      const eachRecc = document.querySelectorAll('.recc');
      eachRecc.forEach(rec => {
        rec.addEventListener('click', (e) => {
          reccPlay(sugg_albums, e)
        })
      })

      suggsLoaded = true
      console.log("SUGGS LOADED HAS BEEN MADE TRUE")
    }
          document.removeEventListener('click', suggLoadAborter)
  }
  
  sugg_loader.send();

  document.addEventListener('click', suggLoadAborter)
  
  function suggLoadAborter(e) {
    if(e.target.tagName == 'A'){
      sugg_loader.abort();
      document.removeEventListener('click', suggLoadAborter)
    }
  }
}

async function appExecute() {

  await list_load().then(checkForUnsaved).then(checkForView).then(consolidate)
  .catch(err => {
    console.log(err)
  })

  if(all_top){
    await addtileListeners()
    await addTitleListener('Enter Title Here...')
  }
}

appExecute()
