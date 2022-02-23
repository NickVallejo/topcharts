const eyes = document.querySelectorAll('.fa-eye');
const regForm = document.querySelector('.reg-form')
const captchaInput = document.getElementById('g-recaptcha-response')

eyes.forEach(eye => {
    eye.addEventListener('click', (e) => {
        let inputType = e.target.parentNode.childNodes[1].type
        console.log(inputType)

        if(inputType == "password"){
            e.target.parentNode.childNodes[1].type = "text";
            e.target.style.opacity = "0.7"
        } else{
            e.target.parentNode.childNodes[1].type = "password";
            e.target.style.opacity = "0.3"
        }
    })
})