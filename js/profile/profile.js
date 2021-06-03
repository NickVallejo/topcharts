const notice = document.querySelector(".notice-wrap")
const chartBox = document.querySelector(".profile-charts")
const followBtn = document.querySelector(".follow-btn")
const profImgSubmit = document.querySelector("#profile-image-submit")
const profImgDisplay = document.querySelector("#profile-img-display")
const profImgDisplayLg = document.querySelector(".profile-img-display-lg")
const passNew = document.querySelector(".pass-pass-new")
const passConfirm = document.querySelector(".pass-pass-confirm")
const passCurrentPass = document.querySelector(".pass-curr-pass")

//Password change values
const passChangeForm = document.querySelector("#passChangeForm")
const emailChangeForm = document.querySelector("#emailChangeForm")

const formSubmit = document.querySelectorAll(".popup .new-btn")

if (emailChangeForm) {
  emailChangeForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formEl = document.forms.emailChangeForm
    const formData = new FormData(formEl)

    console.log(formData.get("confirmPass"))

    if (!formData.get("confirmPass") || !formData.get("email")) {
      noticeInit("error", "Form fields missing. Please try again.")
    } else {
      const req = new XMLHttpRequest()
      req.open("POST", "/settings/email", true)
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

      req.onload = () => {
        const data = JSON.parse(req.responseText)
        console.log(data)
        noticeInit(data.noticeType, data.noticeTxt)
        if (data.noticeType == "success") {
          const emailChangeInput = document.querySelector(".email-change-wrap input")
          emailChangeInput.value = formData.get("email")
          removeEditOverlay(false)
        } else if (data.noticeType == "error") {
          const emailPassConfirmInput = document.querySelector(".email-pass-confirm")
          emailPassConfirmInput.value = ""
        }
      }
      req.onerror = () => {
        noticeInit("error", req.responseText)
      }

      req.send(`email=${formData.get("email")}&confirmPass=${formData.get("confirmPass")}`)
    }
  })
}

//if there is a profile iamge submit on the page, add this listener
if (profImgSubmit) {
  profImgSubmit.addEventListener("change", () => {
    //the element has an array property that holds the raw file stored inside it.
    //We just need the first item in the array since we are only acepting one image
    const profImg = profImgSubmit.files[0]
    //a new instance of the formData class is created
    const formData = new FormData()

    //we append the raw image file to the form and name it profileImage
    formData.append("profileImage", profImg)

    const req = new XMLHttpRequest()
    req.open("POST", "settings/image")

    req.onload = () => {
      if (req.status == 400) {
        const data = JSON.parse(req.responseText)
        noticeInit(data.noticeType, data.noticeTxt)
      } else {
        const myNewProfImg = req.responseText.replace(/\\/g, "/")
        profImgDisplay.style.backgroundImage = `url(${myNewProfImg})`
        profImgDisplayLg.style.backgroundImage = `url(${myNewProfImg})`
        noticeInit("success", "Profile picture successfully changed!")
      }
    }

    req.send(formData)
  })
}

function chartListeners() {
  const profCharts = document.querySelectorAll(".prof-chart")
  profCharts.forEach((chart) => {
    chart.addEventListener("click", (e) => {
      if (e.target.classList.contains("prof-chart-del")) {
        list_trash(e.target.parentNode, true)
      }
    })
  })
}

//! LOOK FOR CHARTS BASED ON THE USER IN THE URL PATH
const getProfileData = async (myProfile) => {
  const req = new XMLHttpRequest()
  req.open("POST", "http://192.168.0.11:4001/profile/charts")
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

  //get the pathname and look for charts based on this username
  const pathname = window.location.pathname.replace("/", "")
  console.log(pathname)

  req.onload = () => {
    const data = JSON.parse(req.responseText)

    console.log(data)

    data.musicCharts.forEach((chart) => {
      const title = chart.title.replace(/_/g, " ")
      const firstFour = []
      const albums = JSON.parse(chart.chart)

      albums.forEach((album) => {
        console.log(album)
        if (firstFour.length !== 4 && album !== null) {
          firstFour.push(album.album_image)
        }
      })

      while (firstFour.length < 4) {
        firstFour.push("https://i.imgur.com/8w4GEqb.png")
      }

      console.log(firstFour)
      const exitOrNot = myProfile ? '<i class="fas fa-times prof-chart-del"></i>' : ""

      chartBox.insertAdjacentHTML(
        "beforeend",
        `<div class="prof-chart"><a href="/${data.username}/chart/${chart.title}" name=${chart.title.replace(
          / /g,
          "_"
        )}><h3 class="prof-chart-title">${title}</h3><div class="prof-chart-wrapper"><div class="prof-chart-cover"></div><img src=${
          firstFour[0]
        }><img src=${firstFour[1]}><img src=${firstFour[2]}><img src=${firstFour[3]}></div></a>${exitOrNot}</div>`
      )
    })

    profCharts = document.querySelectorAll(".prof-chart")
    chartListeners(profCharts)
  }

  req.send(`username=${pathname}`)
}

if (passChangeForm) {
  passChangeForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formEl = document.forms.passChangeForm
    const formData = new FormData(formEl)

    console.log(formData.get("confirmPass"))

    if (!formData.get("current") || !formData.get("newPass") || !formData.get("confirmPass")) {
      noticeInit("error", "Form fields missing. Please try again.")
    } else if (formData.get("newPass") !== formData.get("confirmPass")) {
      passNew.value = ""
      passConfirm.value = ""
      noticeInit("error", "The passwords you entered were not identical. Please try again.")
    } else if (formData.get("confirmPass").length < 6) {
      noticeInit("error", "Password too weak. Please try again.")
    } else {
      const req = new XMLHttpRequest()
      req.open("POST", "/settings/password", true)
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

      req.onload = () => {
        const data = JSON.parse(req.responseText)
        console.log(data)
        noticeInit(data.noticeType, data.noticeTxt)
        if (data.noticeType == "success") {
          removeEditOverlay(false)
        } else if (data.noticeType == "error") {
          passCurrentPass.value = ""
          passConfirm.value = ""
        }
      }
      req.onerror = () => {
        noticeInit("error", req.responseText)
      }

      req.send(
        `current=${formData.get("current")}&newPass=${formData.get("newPass")}&confirmPass=${formData.get(
          "confirmPass"
        )}`
      )
    }
  })
}

const noticeInit = (noticeType, noticeTxt) => {
  console.log(noticeType, noticeTxt)
  notice.innerHTML = `<div class="notice ${noticeType}-notice"><span>${noticeTxt}</span></div>`
  notice.style.opacity = "1"
  setTimeout(() => {
    notice.style.opacity = "0"
  }, 5000)
}

chartListeners()
