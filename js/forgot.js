const forgotForm = document.querySelector('#forgotForm');
const passChangeForm = document.querySelector('#passChangeForm');
const notice = document.querySelector('.notice-wrap');
const succTxt = document.querySelector('.success-txt');

const noticeInit = (noticeType, noticeTxt) => {
    notice.innerHTML = `<div class="notice ${noticeType}-notice"><span>${noticeTxt}</span></div>`;
    notice.style.opacity = '1';
    setTimeout(() => {
        notice.style.opacity = '0';
    }, 5000)
}

if(passChangeForm){
    passChangeForm.addEventListener('submit', (e) => {
       
        e.preventDefault();
        const formEl = document.forms.passChangeForm;
        const formData = new FormData(formEl);
    
        console.log(formData.get('confirmPass'));
    
        if(!formData.get('newPass') || !formData.get('confirmPass')){
            noticeInit('error', 'Form fields missing. Please try again.');
        } else if(formData.get('newPass') !== formData.get('confirmPass')){
            noticeInit('error', 'The passwords you entered were not identical. Please try again.');
        } else if(formData.get('confirmPass').length < 6){
            noticeInit('error', 'Password too weak. Please try again.');
        } 
        
        else{
            const req = new XMLHttpRequest();
            req.open('POST', passChangeForm.getAttribute('action'), true);
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    
            req.onload = () => {
                const data = JSON.parse(req.responseText);
                console.log(data);
                if(data.noticeType == "success"){
                    window.location.href = "/login"
                } else{
                    noticeInit(data.noticeType, data.noticeTxt);
                }
            }
            req.onerror = () => {
                noticeInit('error', req.responseText);
            }
    
            req.send(`confirmPass=${formData.get('confirmPass')}`);
        }
    })
}

if(forgotForm){
forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(forgotForm);
    console.log(formData.get('recovery-email'))
    
    if(formData.get('recovery-email')){
        const req = new XMLHttpRequest();
        req.open('POST', '/forgot', true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

        req.onload = () => {
            const data = JSON.parse(req.responseText);
            console.log(data);
            if(data.errorNotice == 'success'){
                forgotForm.style.display = 'none';
                succTxt.textContent = data.noticeTxt;
            }
            else {
                noticeInit(data.errorNotice, JSON.stringify(data.noticeTxt));
            }
            
        }

        req.onerror = () => {
            //noticeInit('error', req.responseText);
            console.log(req.responseText, 'posting here')
        }

        req.send(`recoveryEmail=${formData.get('recovery-email')}`)
    }

})
}