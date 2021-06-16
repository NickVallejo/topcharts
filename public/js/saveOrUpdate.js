const edit = document.querySelector(".chart_title i")

function consolidate() {
  let savedNames = []

  saved_list.forEach((saved) => {
    saved.chart.forEach((album) => {
      if (album != null && !savedNames.includes(album.artist)) {
        savedNames.push(album.artist)
      }
    })
  })

  if (savedNames.length > 5 && suggsLoaded == false) {
    const noReccsTxt = document.querySelector(".no-reccs-txt")
    sugg_load(savedNames)
    suggLoader.classList.add("show-sugg-loader")
    noReccsTxt.remove()
  } else {
    console.log("DENIED the sugg load because suggsLoaded = " + suggsLoaded)
  }

  console.log("FROM CONSOLIDATE", savedNames)
}

//! FUNCTION TO UPDATE A CHART
function chartUpdate() {
  const listToUpdate = saved_list.find((saved) => saved.title == my_list.title)
  listToUpdate.chart = my_list.chart

  req = new XMLHttpRequest()
  req.open("POST", "http://143.198.119.208:4001/update", true)
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  req.onload = () => {
    consolidate()
  }

  req.send(`title=${listToUpdate.title}&updatedChart=${JSON.stringify(listToUpdate.chart)}`)
}

//! FUNCTION TO SAVE A CHART
function chartSave(fromTyped) {

  var format = /[`!@#$%^*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  console.log(format.test(fromTyped), "TESTING");

  if(fromTyped == ''){
    return false;
  }

  if(format.test(fromTyped)){
    alert("Invalid Characters.");
    return false;
  }

  if (saved_list.length >= 10){
    alert("Max chart limit reached for beta.");
    return;
  }

  if (my_list.title == undefined) {
    titleInput = document.querySelector('.title-change')
    titleInput.value = ''
    //my_list is walways reflecting what is currently on screen
    //When we save, we are copying the current my_list to new_array
    let title

    let new_array = Array.from(my_list) //User is prompted for a title for their new list

    console.log(typeof fromTyped)

    typeof fromTyped == "string" ? (title = fromTyped) : (title = prompt("What is the name of this list?"))

    console.log(title)

    var symbolFilterTitle = title.replace(/&/g, "and")
    var title_ = symbolFilterTitle.replace(/ /g, "_") //check if the underscored title is already in the saved_array with filter
    console.log("FINAL OUTPUT", title_)

    if(symbolFilterTitle.length > 35){
      alert('Chart name too long!')
      titleInput.value = ''
      return false;
    }

    const name_check = saved_list.some((saved) => saved.title == title_)
    //If length is 0 there is no other list with that name
    if (name_check == false) {
      //push new_array and it's title as a new object in saved_list
      saved_list.push({ title: title_, chart: new_array })
      //Create an html string with the title as an attr and as title on front end
      frontEndTitle.innerText = symbolFilterTitle
      var saved_front =
        `<div class="saved_item"><h2 class="saved_title" name=${title_}>${symbolFilterTitle}</h2><div class="saved-opts"><i class="fas fa-link share"></i><i class="far fa-trash trash"></i></div></div>`
      //add saved_front to list of front end saved lists
      saved_div.insertAdjacentHTML("beforeend", saved_front)
      //add a listener to the saved_div element, to execute func on click
      saved_div.addEventListener("click", saved_click)
      let savedOnFrontEnd = document.querySelectorAll(".saved_item")
      console.log("saved list ", saved_list)

      //open new POSt request
      req = new XMLHttpRequest()
      req.open("POST", "http://143.198.119.208:4001/", true)
      //Use regular urlencoding as request header content type
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      //onload, log the post request as sent
      req.onload = function () {
        console.log("post request sent...")
        consolidate()
      }

      //Send the title and new chart array as the request body
      req.send("title=" + title_ + "&chart=" + JSON.stringify(new_array))

      my_list = { title: title_, chart: new_array }
      console.log("new list is now complete", my_list)
      localStorage.removeItem("unsavedList")
      addTitleListener(symbolFilterTitle)
      return true
    } else {
      titleInput.value = ''
      alert("You already have a chart with this name")
      return false
    }
  } else {
    console.log("You cant save a saved chart")
    return false;
  }
}

//! ADDS LISTENER WHEN CAHRT IS SELECTED OR TITLE OF CHART IS CHANGED
function addTitleListener(saved_name) {
  console.log(saved_name)
  const titleChanger = document.querySelector(".title-change") //the input field that shows up
  const chartTitle = document.querySelector(".title-wrap") // the wrapper of the title for hover events
  const edit = document.querySelector(".chart_title i")
  const chartTitleh3 = document.querySelector(".chart_title h3")

  const textCapture = saved_name //name selected from the displayed list or the newly changed name

  titleChanger.value = ""

  edit.addEventListener("click", () => {
    titleChanger.placeholder = `${textCapture.replace(/_/g, " ")}` // makes the placeholder the name of the chart
    titleChanger.classList.add("show-change") //shows the input bar
    titleChanger.focus()
    window.addEventListener("keydown", (e) => {
      e.stopPropagation()
      if (e.key == "Enter" && titleChanger.value) {
        titleChange(e, titleChanger, textCapture)
      }
    })

    document.querySelector("body").addEventListener("click", (e) => {
      if (
        titleChanger.classList.contains("show-change") &&
        !e.target.classList.contains("edit") &&
        !e.target.classList.contains("title-change")
      ) {
        titleChanger.classList.remove("show-change")
      }
    })
  })
}

//! UPDATE AN EXISTING CHART'S TITLE
function titleChange(e, titleChanger, textCapture) {
  const titleChanger2 = document.querySelector(".title-change") //the input field that shows up
  titleChanger2.classList.remove("show-change")

  if (my_list.title == undefined) {
    console.log("new list unsaved")
    chartSave(titleChanger.value)
  } else {
    e.stopPropagation()

    textCapture = titleChanger.placeholder //need to update the textcapture value idk why

    const currentTitle = document.querySelector(".chart_title h3")
    const savedOnFront = document.querySelectorAll(".saved_title")
    const newTitleFiltered = titleChanger.value.replace(/&/g, "and")

    if(newTitleFiltered.length > 35){
      titleInput = document.querySelector('.title-change')
      titleInput.value = ''
      alert('Chart name too long!')
      return;
    }

    if (e.key == "Enter" && titleChanger.value) {
      const req = new XMLHttpRequest()

      req.open("POST", "/title-change")
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

      req.onload = () => {
        const response = JSON.parse(req.responseText)
        if (!response.err) {
          currentTitle.innerText = response.data.replace(/_/g, " ") // change title on top of chart
          //gets the idnex of the title to change it's name in the saved array
          const titleIndex = saved_list.indexOf(
            saved_list.find((item) => item.title === textCapture.replace(/ /g, "_"))
          )
          //changes title in the saved array
          saved_list[titleIndex].title = response.data
          //changes title on the front end saved cahrts list
          savedOnFront[titleIndex].innerText = response.data.replace(/_/g, " ")
          //changes the attribute of the element as well
          savedOnFront[titleIndex].setAttribute("name", response.data)
          //changes the placeholder of the input field to the new name
          titleChanger.placeholder = response.data.replace(/_/g, " ")
          addTitleListener(response.data) // adds the listener again with the new title
        } else {
          alert(response.err)
          console.log(response)
        }
      }
      req.send(`title=${textCapture}&newtitle=${newTitleFiltered}`)
      titleChanger.value = ""
    }
  }
}
