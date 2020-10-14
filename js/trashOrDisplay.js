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
  //CLEARS INFO FROM PREVIOUSLY DISPLAYED CHART
  chartData.forEach((albumInfo) => {
    albumInfo.innerHTML = ""
  })

  all_top.forEach((album) => {
    album.style.backgroundImage = "none"
  })

  //get that clicked element's name attribute and store in variable
  var clicked_save_name = save_clicked.getAttribute("name")
  var clickedNameNoScore = clicked_save_name.replace(/_/g, " ")

  var savedChart = saved_list.find((saved) => saved.title == clicked_save_name) //check if the name attr of the clicked save, matches one in the saved array, then add it to a new array
  my_list = savedChart //my_list now references the reloaded chart
  frontEndTitle.innerHTML = "<h3>" + clickedNameNoScore + "</h3>"
  console.log("current list", my_list)

  my_list.chart.forEach((album) => {
    const albumIndex = my_list.chart.indexOf(album)

    if (album !== undefined && album !== null) {
      all_top[albumIndex].style.backgroundImage = "url(" + album.album_image + ")"
    } else {
      all_top[albumIndex].style.backgroundImage = "none"
    }
  })

  //Put each corresponding album name in the corresponding chartData slot on front end
  my_list.chart.forEach(function (album) {
    const albumIndex = my_list.chart.indexOf(album)

    if (album !== null && album !== undefined) {
      chartData[albumIndex].innerHTML = `${album.artist} - ${album.album_name}`
    }
  })

  //if an unsaved list was on the project board when you changed charts, it will be deleted
  if (localStorage.getItem("unsavedList")) {
    localStorage.removeItem("unsavedList")
  }
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
