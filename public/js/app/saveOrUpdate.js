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
}

//! FUNCTION TO UPDATE A CHART
function chartUpdate() {
  const listToUpdate = saved_list.find((saved) => saved.title == my_list.title)
  listToUpdate.chart = my_list.chart
  console.log('LSIT TO UPDATE', listToUpdate.chart)

  req = new XMLHttpRequest()
  req.open("POST", "/update", true)
  req.setRequestHeader("Content-Type", "application/json")
  req.onload = () => {
    consolidate()
  }

  req.send(JSON.stringify({title: listToUpdate.title, updatedChart: listToUpdate.chart}))
}

//! FUNCTION TO SAVE A CHART
function chartSave(fromTyped) {

  var format = /[!@#$%^*()_+\-=\[\]{};"\\|,.<>\/~]/;
  // console.log(format.test(fromTyped), "TESTING");

    console.log('its a string')
    console.log(format.test(fromTyped))

    const titlePass = titleTester(fromTyped)
    if(titlePass == false){
      return false
    }

    if (saved_list.length >= 10) {
      alert("Max chart limit reached for beta.")
      return
    }

  else if (my_list.title == undefined) {
    titleInput = document.querySelector('.title-change')
    titleInput.value = ''
    //my_list is walways reflecting what is currently on screen
    //When we save, we are copying the current my_list to new_array
    let title

    let new_array = Array.from(my_list) //User is prompted for a title for their new list

    typeof fromTyped == "string" ? (title = fromTyped) : (title = prompt("What is the name of this list?"))

    console.log(title)

    var symbolFilterTitle = title.replace(/&/g, "and")
    var title_ = symbolFilterTitle.replace(/ /g, "_") //check if the underscored title is already in the saved_array with filter
    console.log("FINAL OUTPUT", title_)

    const name_check = saved_list.some((saved) => saved.title == title_)
    //If length is 0 there is no other list with that name
    if (name_check == false) {
      //push new_array and it's title as a new object in saved_list
      saved_list.push({ title: title_, chart: new_array })
      //Create an html string with the title as an attr and as title on front end
      frontEndTitle.innerText = symbolFilterTitle
      var saved_front =
        `<div class="saved_item"><h2 class="saved_title" name=${title_}>${symbolFilterTitle}</h2><div class="saved-opts"><i class="fas fa-link share"></i><i class="fa-solid fa-x trash"></i></div></div>`
      //add saved_front to list of front end saved lists
      saved_div.insertAdjacentHTML("beforeend", saved_front)
      //add a listener to the saved_div element, to execute func on click
      saved_div.addEventListener("click", saved_click)
      let savedOnFrontEnd = document.querySelectorAll(".saved_item")
      console.log("saved list ", saved_list)

      //open new POSt request
      req = new XMLHttpRequest()
      req.open("POST", "/", true)
      //Use regular urlencoding as request header content type
      req.setRequestHeader("Content-Type", "application/json")
      //onload, log the post request as sent
      req.onload = function () {
        consolidate()
      }

      //Send the title and new chart array as the request body
      req.send(JSON.stringify({title: title_, chart: new_array}))

      my_list = { title: title_, chart: new_array }
      
      localStorage.removeItem(`${globalUser}-unsavedList`)
      addTitleListener(symbolFilterTitle)
      return true
    } else {
      titleInput.value = ''
      alert("You already have a chart with this name")
      return false
    }
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

function titleTester(title){
  const titleInput = document.querySelector('.title-change')
  const format = /[!@#$%^*()_+\-=\[\]{};"\\|,.<>\/~]/;

  if (title.length > 35) {
    titleInput.value = ''
    alert('Chart name too long!')
    return false;
  } else if(format.test(title)){
    alert('invalid characters!')
    titleInput.value = ''
    return false;
  } else if(title == ''){
    return false;
  }
  return true
}

//! UPDATE AN EXISTING CHART'S TITLE
function titleChange(e, titleChanger, textCapture) {
  const titleChanger2 = document.querySelector(".title-change") //the input field that shows up
  titleChanger2.classList.remove("show-change")

  console.log('so far so good::', textCapture)
  if (my_list.title == undefined) {
    chartSave(titleChanger.value)
  } else {
    e.stopPropagation()

    const titleName = document.querySelector('.chart_title h3').innerText
    textCapture = titleName

    const currentTitle = document.querySelector(".chart_title h3")
    const savedOnFront = document.querySelectorAll(".saved_title")
    const newTitleFiltered = titleChanger.value.replace(/&/g, "and")

    // if (newTitleFiltered.length > 35) {
    //   titleInput = document.querySelector('.title-change')
    //   titleInput.value = ''
    //   alert('Chart name too long!')
    //   return;
    // }
    const titlePass = titleTester(newTitleFiltered)
    if(titlePass == false){
      return
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
