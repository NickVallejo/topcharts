function numToggle(e) {

  const deskNumRadio = document.querySelector("#desk-numRadio")
  const mobNumRadio = document.querySelector("#mob-numRadio")
const frontRanks = document.querySelectorAll(".frontRank") 

const numRadio = window.innerWidth > 900 ? deskNumRadio : mobNumRadio;

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
