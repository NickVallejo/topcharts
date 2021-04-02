const showReccs = document.querySelector('.recc-show');
const albumReccs = document.querySelector('.album_reccs');
const roundUp = document.querySelector('.round-up');
const mobileNav = document.querySelector('.mobile-nav');
const set = document.querySelector('.set-wrap');

let up = false;

showReccs.addEventListener('click', () => {
    up = !up;

    if(up){
        showReccs.classList.add('show-flip');
        albumReccs.classList.add('album-reccs-show');
    } else{
        showReccs.classList.remove('show-flip');
        albumReccs.classList.remove('album-reccs-show');
    }
})

roundUp.addEventListener('click', () => {
    if(roundUp.classList.contains('round-down')){
        roundUp.classList.remove('round-down');
        mobileNav.classList.remove('slide-down');
        set.classList.remove('set-slide-up');
    } else{
        roundUp.classList.add('round-down');
        mobileNav.classList.add('slide-down');
        set.classList.add('set-slide-up');
    }

})