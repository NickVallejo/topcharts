function checkForUnsaved() {
  let unsavedList = JSON.parse(localStorage.getItem(`${globalUser}-unsavedList`))

  //Checks if an unsaved list was added last session
  if (unsavedList) {
    topWrapper.innerHTML = ''
    chartNamesWrapper.innerHTML = ''

    my_list = unsavedList

    setRadio(my_list.length)

    for (i = 0; i < my_list.length; i++) {
      if (my_list[i] !== undefined && my_list[i] !== null) {
        topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list[i].album_image})" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><div class="tile-hover" rank=${i}></div><i class="fas fa-times frontDel"></i><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${my_list[i].artist} - ${my_list[i].album_name}</p>`)
      } else {
        topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url()" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p></div>`)
      }
    }

    //Put each corresponding album name in the corresponding chartData slot on front end
    for(i = 0; i < my_list.length; i++){
      if (my_list[i] !== null) {
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}><span class="chartNameNum">${i+1}. </span>${my_list[i].artist} - ${my_list[i].album_name}</p>`)
      } else{
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}><span class="chartNameNum">${i+1}. </span></p>`)
      }
    }
    }
   else{
    if(loaded_lists.length > 0){
      list_display(loaded_lists[0].title)
    } else{
      list_new()
    }
  }
}
