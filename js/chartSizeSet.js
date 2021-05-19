
const topSelect = document.querySelectorAll('.top-select')

const width = window.innerWidth;

window.addEventListener('resize', () => {
  addtileListeners();
})

//chcks the top 10 radio button on app execute
topTen.checked = true;

//! SET LISTENERS FOR RADIO BUTTONS TO CHANGE SIZE OF CURRENT CHART
topSelect.forEach((selector) => {
    selector.addEventListener("click", chartSizeSet)
  })

//! SET SELECTED RADIO BUTTON TO CHECKED IF A LIST OF THAT SIZE IS DISPLAYED
function setRadio(length){
    switch(length){
      case 100: topHundred.checked = true
      break;
      case 50: topFifty.checked = true
      break;
      case 20: topTwenty.checked = true
      break;
      case 10: topTen.checked = true
      break;
    }
  }

//! ADD EVENT LISTENERS TO NEWLY SELECTED LIST TILES
//! WE ARE WORKING ON TILE DRAG HERE
function addtileListeners(){
    //redefines all the top tiles
    const all_top = document.querySelectorAll(".top")

    const width = window.innerWidth;

    if('ontouchstart' in document.body){

      all_top.forEach((top) => {
        top.addEventListener("touchstart", touchStart)
        // top.addEventListener("click", mobSwitch)
        top.setAttribute("draggable", "false")
        top.removeEventListener("dragstart", dragDeskMob)
        top.removeEventListener("click", tileSettings)      
        top.removeEventListener("drop", dropDeskMob)
      })
    } else{
    all_top.forEach((top) => {
      top.removeEventListener("touchstart", touchStart)
      top.addEventListener("click", tileSettings)      
      //checks if the dropped tile is from a top tile or a sugg tile
      top.addEventListener("drop", dropDeskMob)
      // top.addEventListener("touchend", dropDeskMob)

      //necessary defaults prevented for correct functionality
      top.addEventListener("dragenter", (e) => e.preventDefault())
      top.addEventListener("dragover", (e) => e.preventDefault())

      // lets you drag a top tile
      top.setAttribute("draggable", "true")
      top.addEventListener("dragstart", dragDeskMob)
    })
  }
}

  function dragDeskMob(e){
    console.log(e.target);
    e.dataTransfer.setData("rank", e.target.getAttribute("rank"))
    e.dataTransfer.setData("switch", true)
  }

  function dropDeskMob(e){
    e.stopImmediatePropagation()
    e.preventDefault();
    console.log(e.target)
    if(e.dataTransfer.getData("switch")){
      console.log("switch!!")
      const dragFromIndex = e.dataTransfer.getData("rank")
      const dragToIndex = e.target.getAttribute("rank")
      tileDrag(dragFromIndex, dragToIndex)
    } else{
      const suggIndex = e.dataTransfer.getData("text/plain")
      const tileIndex = e.target.getAttribute("rank")
      console.log('TILE INDEX 45', tileIndex)
      tileDrop(suggIndex, tileIndex)
    }
  }

//! SET CHART SIZE ON FRONT END
function chartSizeSet(e){

  e.preventDefault();

  const chartSetVal = e.target.getAttribute('value')
  const my_list_status = my_list.title ? my_list.chart : my_list
  const confirmTxt = 'Changing your chart to a smaller size may result in the loss of albums. Are you sure you want to proceed?'

    if(chartSetVal == 'top-ten'){
      if(my_list_status.length > 10){
        if(confirm(confirmTxt)){ 
          radioChange(10, chartSetVal)
        }
      } else{
        radioChange(10, chartSetVal)
      }
    } else if(chartSetVal == 'top-twenty'){
      if(my_list_status.length > 20){
        if(confirm(confirmTxt)){ 
          radioChange(20, chartSetVal)
        }
      } else{
        radioChange(20, chartSetVal)
      }
    } else if(chartSetVal == 'top-fifty'){
      if(my_list_status.length > 50){
        if(confirm(confirmTxt)){ 
          radioChange(50, chartSetVal)
        } 
    } 
    else{
      radioChange(50, chartSetVal)
    }
  } else if (chartSetVal == 'top-hundred'){
      radioChange(100, chartSetVal)
    }

    function radioChange(size, sizeTxt){
      frontEndSet(size)
      setChartNameLength(size)
      document.querySelector(`#${sizeTxt}`).checked = true
    }
  
    //! SET NEW TILE SIZE FOR SAVED OR UNSAVED CHART
    function frontEndSet(size){

      const chartObject = my_list.title != null ? my_list.chart : my_list
      //erase all tiles then replace. Lazy & unnefficient but works
      topWrapper.innerHTML = ''
  
      //add new tile amount for saved chart then update the chart
      if(chartObject.title !== undefined){
      //change my_list to size of selected chart size (10, 20, 50)
      oldSize = chartObject.length
      chartObject.length = size;

      chartTileCycle();
      chartUpdate();
    } 
    //add new tile amount for unsaved chart then save to local storage
    else if(chartObject.title == undefined){
      //change my_list to size of selected chart size (10, 20, 50)
      my_list.length = size;
      chartTileCycle()
      localStorage.setItem("unsavedList", JSON.stringify(my_list))
    }

    //add event listeners to new tiles
    addtileListeners()

    function chartTileCycle(){
      for(i = 0; i < size; i++){
        if(chartObject[i] !== null){
          // topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list.chart[i].album_image})" class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
          topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${chartObject[i].album_image})" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><div class="tile-hover" rank=${i}></div><i class="fas fa-times frontDel"></i><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${chartObject[i].artist} - ${chartObject[i].album_name}</p></div>`)
        } else{
          topWrapper.insertAdjacentHTML('beforeend', `<div class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
        }
      }
    }
  }
  
  //! SET NEW ARTIST NAME DATA FOR SAVED OR UNSAVED CHART
  function setChartNameLength(size){
    chartNamesWrapper.innerHTML = ''

    const chartObject = my_list.title != null ? my_list.chart : my_list
  
    for(i=0; i < size; i++){
      console.log(chartObject[i])
        if(chartObject[i] !== null){
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}>${i+1}. ${chartObject[i].artist} - ${chartObject[i].album_name}</p>`)
        } else{
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}>${i+1}.</p>`)
        }
     }
   }
  }