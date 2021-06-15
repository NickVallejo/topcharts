const eyes = document.querySelectorAll('.fa-eye');

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