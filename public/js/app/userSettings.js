const notice = document.querySelector('.notice-wrap')
const globalUser = document.querySelector('body[name]').getAttribute('name')

function numToggle(e) {

const deskNumRadio = document.querySelector("#desk-numRadio")
const mobNumRadio = document.querySelector("#mob-numRadio")
const frontRanks = document.querySelectorAll(".frontRank") 
const numRadio = window.innerWidth > 900 ? deskNumRadio : mobNumRadio
const listRadio = document.querySelector('#listRadio')
const chartNameNums = document.querySelectorAll('.chartNameNum')
const chartNameList = document.querySelector('.chart_names')
const display = document.querySelector('.display-screen .display')

// YO
  if(listRadio.checked == false){
    chartNameList.classList.add('hide-chartlist')
    display.classList.add('display-full')
  } else if(listRadio.checked == true){
    chartNameList.classList.remove('hide-chartlist')
    display.classList.remove('display-full')
  }
// BYE
  if(numRadio.checked == false){
    chartNameNums.forEach(num => {
      num.style.display = 'none';
    })
    frontRanks.forEach(rank => {
    rank.style.opacity = '0%'
  })  
  } else if(numRadio.checked == true){
    chartNameNums.forEach(num => {
      num.style.display = 'inline';
    })

    frontRanks.forEach(rank => {
      rank.style.opacity = "100%"
    })
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