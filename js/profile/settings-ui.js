const passEdit = document.querySelector('.password-change-wrap i');
const emailEdit = document.querySelector('.email-change-wrap i');

const emailForm = document.querySelector('#emailChangeForm');
const passForm = document.querySelector('#passChangeForm');

const popup = document.querySelector('.popup');

passEdit.addEventListener('click', showEditOverlay);
emailEdit.addEventListener('click', showEditOverlay);

function showEditOverlay(e){


    if(e.target.classList.contains('email-edit')){
        emailForm.classList.add('setting-form-show');
    } else if(e.target.classList.contains('password-edit')){
        passForm.classList.add('setting-form-show');
    }

    popup.classList.add('popup-show')

    popup.addEventListener('click', removeEditOverlay);
}

function removeEditOverlay(e){
    if(e == false){
        const formShow = document.querySelector('.setting-form-show')
        popup.classList.remove('popup-show')
        setTimeout(()=> {
            formShow.classList.remove('setting-form-show')
        },400)
    }
    else if(e.target.classList.contains('popup-show')){
        const formShow = document.querySelector('.setting-form-show')
        popup.classList.remove('popup-show')
        setTimeout(()=> {
            formShow.classList.remove('setting-form-show')
        },400)
    }
}