const topSelect = document.querySelectorAll('.top-select')

//chcks the top 10 radio button on app execute
topTen.checked = true;

//! SET LISTENERS FOR RADIO BUTTONS TO CHANGE SIZE OF CURRENT CHART
topSelect.forEach((selector) => {
    selector.addEventListener("click", chartSizeSet)
  })

//! SET SELECTED RADIO BUTTON TO CHECKED IF A LIST OF THAT SIZE IS DISPLAYED
function setRadio(length){
    switch(length){
      case 50: topFifty.checked = true
      break;
      case 20: topTwenty.checked = true
      break;
      case 10: topTen.checked = true
      break;
    }
  }

//! ADD EVENT LISTENERS TO NEWLY SELECTED LIST TILES
function addtileListeners(){
    const all_top = document.querySelectorAll(".top")
    all_top.forEach((top) => {
      top.addEventListener("click", tileSettings)
      
      top.addEventListener("drop", (e) => {
        e.preventDefault();
        console.log('droppeD!')
        console.log(`sugg tile of index ${e.dataTransfer.getData("text/plain")} dropped on top tyle of rank ${e.target.getAttribute("rank")}`);
      })
    })
    console.log('listeners added', all_top)
  }

//! SET CHART SIZE ON FRONT END
function chartSizeSet(){

  const my_list_status = my_list.title ? my_list.chart : my_list
  console.log('dependant variable', my_list_status)

    if(topTen.checked){
      if(my_list_status.length > 10 || mmy_list_status.length > 10){
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
      frontEndSet(50)
      setChartNameLength(50)
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
          topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list.chart[i].album_image})" class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
        } else{
          topWrapper.insertAdjacentHTML('beforeend', `<div class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
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
          topWrapper.insertAdjacentHTML('beforeend', `<div style="background-image: url(${my_list[i].album_image})" class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
        } else{
          topWrapper.insertAdjacentHTML('beforeend', `<div class="top" rank=${i} active="no"><p class="frontRank">${i+1}</p><p class="frontDel">x</p></div>`)
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

 module.exports = {addtileListeners}