// function saveUpdateManager() {

//   if (my_list.title == undefined) {
//     console.log("The manager knows we want to save")
//     chartSave()
//   } else {
//     console.log("The manager knows we want to update")
//     chartUpdate()
//   }
// }

//! FUNCTION TO UPDATE A CHART
function chartUpdate() {
  const listToUpdate = saved_list.find((saved) => saved.title == my_list.title)
  listToUpdate.chart = my_list.chart

  req = new XMLHttpRequest()
  req.open("POST", "http://localhost:4000/update", true)
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  req.onload = () => {
    sugg_load()
  }
  

  req.send(`title=${listToUpdate.title}&updatedChart=${JSON.stringify(listToUpdate.chart)}`)
}

//! FUNCTION TO SAVE A CHART
function chartSave() {
  if (my_list.title == undefined) {
    //my_list is walways reflecting what is currently on screen
    //When we save, we are copying the current my_list to new_array

    let new_array = Array.from(my_list) //User is prompted for a title for their new list

    const title = prompt("What is the name of this list?") //this takes the title input and turns spaces to underscores

    var title_ = title.replace(/ /g, "_") //check if the underscored title is already in the saved_array with filter

    const name_check = saved_list.some((saved) => saved.title == title_)
    //If length is 0 there is no other list with that name
    if (name_check == false) {
      //push new_array and it's title as a new object in saved_list
      saved_list.push({ title: title_, chart: new_array })
      //Create an html string with the title as an attr and as title on front end
      frontEndTitle.innerHTML = "<h3>" + title + "</h3>"
      var saved_front =
        '<div class="saved_item"><h2 class="saved_title" name=' +
        title_ +
        ">" +
        title +
        '</h2><i class="fa fa-trash" aria-hidden="true"></i></div>'
      //add saved_front to list of front end saved lists
      saved_div.insertAdjacentHTML("beforeend", saved_front)
      //add a listener to the saved_div element, to execute func on click
      saved_div.addEventListener("click", saved_click)
      let savedOnFrontEnd = document.querySelectorAll(".saved_item")
      console.log("saved list ", saved_list)

      //open new POSt request
      req = new XMLHttpRequest()
      req.open("POST", "http://localhost:4000/", true)
      //Use regular urlencoding as request header content type
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      //onload, log the post request as sent
      req.onload = function () {
        console.log("post request sent...")
        sugg_load()
      }

      //Send the title and new chart array as the request body
      req.send("title=" + title_ + "&chart=" + JSON.stringify(new_array))

      my_list = { title: title_, chart: new_array }
      console.log("new list is now complete", my_list)
      localStorage.removeItem("unsavedList")
    } else {
      alert("You already have a list with this name")
      chartUpdate()
    }
  } else {
    console.log("You cant save a saved chart")
  }
}
