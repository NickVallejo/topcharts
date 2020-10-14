function checkForUnsaved() {
  // console.log("suggs laoded " + suggsLoaded)
  let unsavedList = JSON.parse(localStorage.getItem("unsavedList"))

  //Checks if an unsaved list was added last session
  if (unsavedList) {
    my_list = unsavedList

    for (i = 0; i < 10; i++) {
      if (my_list[i] !== undefined && my_list[i] !== null) {
        all_top[i].style.backgroundImage = "url(" + my_list[i].album_image + ")"
      } else {
        all_top[i].style.backgroundImage = "none"
      }
    }

    //Put each corresponding album name in the corresponding chartData slot on front end
    my_list.forEach(function (album) {
      if (album !== null) {
        let index = my_list.indexOf(album)
        chartData[index].innerHTML = `${album.artist} - ${album.album_name}`
      }
    })
  }
}
