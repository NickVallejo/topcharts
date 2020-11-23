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
  } else if (save_clicked.classList.contains("fa-trash")) {
    list_trash(save_clicked.parentNode)
  }
}

//! FUNCTION TO DISPLAY THE LIST
function list_display(save_clicked) {

  if(typeof save_clicked == 'string'){
    var clicked_save_name = save_clicked
  } else{
    var clicked_save_name = save_clicked.getAttribute("name")
  }

  //get that clicked element's name attribute and store in variable
  var clickedNameNoScore = clicked_save_name.replace(/_/g, " ")

//check if the name attr of the clicked save matches one in the saved array, then add it to a new array
  var savedChart = saved_list.find((saved) => saved.title == clicked_save_name) 
  my_list = savedChart //my_list now references the reloaded chart
  setRadio(my_list.chart.length) //check the radio button that corresponds with the selected list's size
  frontEndTitle.innerHTML = "<h3>" + clickedNameNoScore + "</h3>"
  console.log("current list", my_list)

  //Erase all current tiles and replace with selected list
  topWrapper.innerHTML = '';
  for(i = 0; i < my_list.chart.length; i++){
    if (my_list.chart[i] !== undefined && my_list.chart[i] !== null) {
      topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list.chart[i].album_image})" class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p><p class="frontPlay">></p></div>`)
    } else {
      topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url()" class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
    }
    console.log('in display loop!');
}

  //erase all current chart artist names and replace with selected list
  chartNamesWrapper.innerHTML = ''
  for(i = 0; i < my_list.chart.length; i++){
  if (my_list.chart[i] !== null && my_list.chart[i] !== undefined) {
    chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}> ${i+1}. ${my_list.chart[i].artist} - ${my_list.chart[i].album_name}</p>`)
  } else{
    chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}> ${i+1}.</p>`)
  }
  }

  //if an unsaved list was on the project board when you changed charts, it will be deleted
  if (localStorage.getItem("unsavedList")) {
    localStorage.removeItem("unsavedList")
  }

  //add new listeners depending on if the chart selected increased or decreased in tile size
  addtileListeners()
}

//! FUNCTION TO TRASH THE LIST
function list_trash(save_clicked) {
  var del_title = save_clicked.childNodes[0].getAttribute("name")

  var del = new XMLHttpRequest()
  del.open("POST", "/list-delete")
  del.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

  del.onload = function () {
    let savedOnFrontEnd = document.querySelectorAll(".saved_item")
    console.log("Deleting list with index number of " + del.responseText)
    savedOnFrontEnd[del.responseText].remove()
    saved_list.splice(del.responseText, 1)

    if (frontEndTitle.textContent.replace(/ /g, "_") == del_title) {
      list_new()
    }

    console.log(saved_list)
  }
  del.send("name=" + del_title)
}
