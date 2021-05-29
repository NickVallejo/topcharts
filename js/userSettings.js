function numToggle(e) {

const deskNumRadio = document.querySelector("#desk-numRadio")
const mobNumRadio = document.querySelector("#mob-numRadio")
const frontRanks = document.querySelectorAll(".frontRank") 
const numRadio = window.innerWidth > 900 ? deskNumRadio : mobNumRadio
const chartNameNums = document.querySelectorAll('.chartNameNum')

  if(numRadio.checked == false){
    chartNameNums.forEach(num => {
      num.style.display = 'none';
    })
    frontRanks.forEach(rank => {
      console.log('changing')
    rank.style.opacity = '0%'
  })  
  console.log('its false')
  } else if(numRadio.checked == true){
    chartNameNums.forEach(num => {
      num.style.display = 'inline';
    })

    frontRanks.forEach(rank => {
      console.log('changing')
      rank.style.opacity = "100%"
    })  -
    console.log('its true')    
  }
}
