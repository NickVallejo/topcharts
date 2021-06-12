const urlParams = new URLSearchParams(window.location.search)
const chartView = urlParams.get('chart')
console.log(chartView)

function checkForView(){
  if(chartView){
    list_display(chartView)
  }
}

//! CHECKS IF THE LIST WAS DELETED OR SELECTED
function saved_click(event) {
  //clicked html element stored in variable
  const save_clicked = event.target

  if (save_clicked.classList.contains("saved_title")) {
    list_display(save_clicked)
  } else if (save_clicked.classList.contains("trash")) {
    list_trash(save_clicked.parentNode.parentNode)
  } else if(save_clicked.classList.contains('share')){
    list_share(save_clicked.parentNode.parentNode)
  }
}

function list_share(save_clicked){
  const profileName = document.querySelector('.prof-go').getAttribute('href').replace("/", "");
  const chartName = save_clicked.childNodes[0].getAttribute("name")
  const urlString = `${window.location.origin}/${profileName}/chart/${chartName}`

  navigator.clipboard.writeText(urlString).then((err) => {
    if(!err){
      noticeInit("success", 'URL copied to clipboard!')
    } else{
      noticeInit("error", 'Error occurred. Could not copy to clipboard.')
    }
  })
}

//! FUNCTION TO DISPLAY THE LIST
function list_display(save_clicked) {

  if('ontouchstart' in document.body || window.innerWidth < 900){
    saved_list_closer()
  }

  if(typeof save_clicked == 'string'){
    var clicked_save_name = save_clicked
  } else{
    var clicked_save_name = save_clicked.getAttribute("name")
  }

  //get that clicked element's name attribute and store in variable
  var clickedNameNoScore = clicked_save_name.replace(/_/g, " ")

function titleSavePrompt(){

    const chartName = prompt('Enter Chart Title Here:')
    if(chartName != null){
      const saved = chartSave(chartName)

      if(saved == false){
        titleSavePrompt()
      } else{
        return
      }
    }
}


if(my_list.chart == undefined){
  const allEmpty = my_list.every(album => album == undefined)
  if(!allEmpty){
    const saveOrNot = confirm('You are exiting an unsaved chart. Do you wish to save?')
    if(saveOrNot == true){
      titleSavePrompt()
    }
  }
}

//check if the name attr of the clicked save matches one in the saved array, then add it to a new array
  var savedChart = saved_list.find((saved) => saved.title == clicked_save_name) 
  my_list = savedChart //my_list now references the reloaded chart
  setRadio(my_list.chart.length) //check the radio button that corresponds with the selected list's size
  frontEndTitle.innerText = clickedNameNoScore

  //Erase all current tiles and replace with selected list
  topWrapper.innerHTML = '';
  for(i = 0; i < my_list.chart.length; i++){
    if (my_list.chart[i] !== undefined && my_list.chart[i] !== null) {
      topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list.chart[i].album_image})" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><div class="tile-hover" rank=${i}></div><i class="fas fa-times frontDel"></i><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${my_list.chart[i].artist} - ${my_list.chart[i].album_name}</p>
      </div>`)
    } else {
      topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url()" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p></div>`)
    }
    console.log('in display loop!');
}
  //erase all current chart artist names and replace with selected list
  chartNamesWrapper.innerHTML = ''
  for(i = 0; i < my_list.chart.length; i++){
  if (my_list.chart[i] !== null && my_list.chart[i] !== undefined) {
    chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}> <span class="chartNameNum">${i+1}. </span> ${my_list.chart[i].artist} - ${my_list.chart[i].album_name}</p>`)
  } else{
    chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}><span class="chartNameNum">${i+1}. </span></p>`)
  }
  }

  //if an unsaved list was on the project board when you changed charts, it will be deleted
  if (localStorage.getItem("unsavedList")) {
    localStorage.removeItem("unsavedList")
  }

  //add new listeners depending on if the chart selected increased or decreased in tile size
  addtileListeners()
  addTitleListener(clicked_save_name)
  numToggle()
}

//! FUNCTION TO TRASH THE LIST
function list_trash(save_clicked, profile) {
  var del_title = save_clicked.childNodes[0].getAttribute("name")
  console.log(profile)

  var del = new XMLHttpRequest()
  del.open("POST", "/list-delete", true)
  del.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

  del.onload = function () {
    if(profile == undefined){
      console.log(del.responseText)
      let savedOnFrontEnd = document.querySelectorAll(".saved_item")
      savedOnFrontEnd[del.responseText].remove()
      saved_list.splice(del.responseText, 1)
  
      if (frontEndTitle.textContent.replace(/ /g, "_") == del_title) {
        list_new()
      }
    } else{
      save_clicked.remove();
    }
  }
  del.send("name=" + del_title)
}
