const notice = document.querySelector('.notice-wrap')

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

const noticeInit = (noticeType, noticeTxt, time) => {
  showTime = time ? time : 5000
  notice.innerHTML = `<div class="notice ${noticeType}-notice"><span>${noticeTxt}</span></div>`
  notice.style.opacity = "1"
  setTimeout(() => {
    notice.style.opacity = "0"
  }, showTime)
}