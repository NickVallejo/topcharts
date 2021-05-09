
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

    if(width < 900){

      all_top.forEach((top) => {
        top.addEventListener("touchstart", touchStart, {once: true})
        // top.addEventListener("click", mobSwitch)
        top.setAttribute("draggable", "false")
        top.removeEventListener("dragstart", dragDeskMob)
        top.removeEventListener("click", tileSettings)      
        top.removeEventListener("drop", dropDeskMob)
      })
    } else{
    all_top.forEach((top) => {
      top.removeEventListener("touchstart", touchStart, {once: true})
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
function chartSizeSet(){

  const my_list_status = my_list.title ? my_list.chart : my_list
  console.log('dependant variable', my_list_status)

    if(topTen.checked){
      if(my_list_status.length > 10 || my_list_status.length > 10){
        if(confirm('Changing your chart to a smaller size may result in the loss of albums. Are you sure you want to proceed?')){ 
          frontEndSet(10)
          setChartNameLength(10) 
        }
      } else{
        frontEndSet(10)
        setChartNameLength(10) 
      }
    } else if(topTwenty.checked){
      if(my_list_status.length > 20 || my_list_status.length > 20){
        if(confirm('Changing your chart to a smaller size may result in the loss of albums. Are you sure you want to proceed?')){ 
          frontEndSet(20)
          setChartNameLength(20) 
        }
      } else{
        frontEndSet(20)
        setChartNameLength(20) 
      }
    } else if(topFifty.checked){
      if(my_list_status.length > 50 || my_list_status.length > 50){
        if(confirm('Changing your chart to a smaller size may result in the loss of albums. Are you sure you want to proceed?')){ 
          frontEndSet(50)
          setChartNameLength(50) 
        } 
    } 
    else{
      frontEndSet(50)
      setChartNameLength(50)
    }
  } else if (topHundred.checked){
      frontEndSet(100)
      setChartNameLength(100)
    }
  
    //! SET NEW TILE SIZE FOR SAVED OR UNSAVED CHART
    function frontEndSet(size){
      //erase all tiles then replace. Lazy & unnefficient but works
      topWrapper.innerHTML = '';
  
      //add new tile amount for saved chart then update the chart
      if(my_list.title !== undefined){
      //change my_list to size of selected chart size (10, 20, 50)
      oldSize = my_list.chart.length
      my_list.chart.length = size;
  
      for(i = 0; i < size; i++){
        if(my_list.chart[i]!== null && my_list.chart[i]!== undefined){
          // topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list.chart[i].album_image})" class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
          topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list.chart[i].album_image})" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><div class="tile-hover" rank=${i}></div><i class="fas fa-times frontDel"></i><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${my_list.chart[i].artist} - ${my_list.chart[i].album_name}</p></div>`)
        } else{
          topWrapper.insertAdjacentHTML('beforeend', `<div class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
        }
      }
      chartUpdate();
    } 
    //add new tile amount for unsaved chart then save to local storage
    else if(my_list.title == undefined){
      //change my_list to size of selected chart size (10, 20, 50)
      my_list.length = size;
  
      for(i = 0; i < size; i++){
        if(my_list[i]!== null && my_list[i]!== undefined){
          topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list[i].album_image})" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><div class="tile-hover" rank=${i}></div><i class="fas fa-times frontDel"></i><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${my_list[i].artist} - ${my_list[i].album_name}</p></div>`)
        } else{
          topWrapper.insertAdjacentHTML('beforeend', `<div class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
        }
      }
      localStorage.setItem("unsavedList", JSON.stringify(my_list))
    }

    //add event listeners to new tiles
    addtileListeners()
  }
  
  //! SET NEW ARTIST NAME DATA FOR SAVED OR UNSAVED CHART
  function setChartNameLength(size){
    chartNamesWrapper.innerHTML = ''
  
    if(my_list.title !== undefined){
      for(i=0; i < size; i++){
        if(my_list.chart[i] !== null && my_list.chart[i] !== undefined){
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}>${i+1}. ${my_list.chart[i].artist} - ${my_list.chart[i].album_name}</p>`)
        } else{
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}>${i+1}.</p>`)
        }
      }
    } else if(my_list.title == undefined){
      for(i=0; i < size; i++){
        if(my_list[i] !== null && my_list[i] !== undefined){
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}>${i+1}. ${my_list[i].artist} - ${my_list[i].album_name}</p>`)
      } else{
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}>${i+1}.</p>`)
      }
    }
    }
  }
  }