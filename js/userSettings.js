function numToggle() {

  const numRadio = document.querySelector(".chartNums")
const frontRanks = document.querySelectorAll(".frontRank") 

  console.log(frontRanks)
  if(numRadio.checked == false){
    frontRanks.forEach(rank => {
      console.log('changing')
    rank.style.opacity = '0%'
  })  
  console.log('its false')
  } else if(numRadio.checked == true){
    frontRanks.forEach(rank => {
      console.log('changing')
      rank.style.opacity = "100%"
    })  -
    console.log('its true')    
  }
}
