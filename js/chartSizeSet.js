
const topSelect = document.querySelectorAll('.top-select')

const width = window.innerWidth;

//chcks the top 10 radio button on app execute
if(topTen != null){
  topTen.checked = true;
}

//! SET LISTENERS FOR RADIO BUTTONS TO CHANGE SIZE OF CURRENT CHART
if(topSelect != null){
  topSelect.forEach((selector) => {
    selector.addEventListener("click", chartSizeSet)
  })
}

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
      topWrapper.innerHTML = ''

      console.log('OUTSIDE FUNC', chartObject)

      chartObject.length = size;
      chartTileCycle()
  
      if(chartObject.title !== undefined){
        chartUpdate();
      } 
      else{
        localStorage.setItem("unsavedList", JSON.stringify(my_list))
      }

      //add event listeners to new tiles
      addtileListeners()

      function chartTileCycle(){
        console.log('INSIDE FUNC', chartObject)
        for(i = 0; i < size; i++){
          if(chartObject[i] !== undefined && chartObject[i] !== null){
            // topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list.chart[i].album_image})" class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
            topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${chartObject[i].album_image})" class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><div class="tile-hover" rank=${i}></div><i class="fas fa-times frontDel"></i><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${chartObject[i].artist} - ${chartObject[i].album_name}</p></div>`)
          } else{
            topWrapper.insertAdjacentHTML('beforeend', `<div class="top top${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p></div>`)
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
        if(chartObject[i] !== null && chartObject[i] !== undefined){
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}><span class="chartNameNum">${i+1}.</span> ${chartObject[i].artist} - ${chartObject[i].album_name}</p>`)
        } else{
        chartNamesWrapper.insertAdjacentHTML('beforeend', `<p class="albumInfo" rank=${i}><span class="chartNameNum">${i+1}.</span></p>`)
        }
     }
   }
  }