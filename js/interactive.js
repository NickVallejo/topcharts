const showReccs = document.querySelector('.recc-show');
const albumReccs = document.querySelector('.album_reccs');

let up = false;

showReccs.addEventListener('click', () => {
    up = !up;
    console.log(up);
    if(up){
        showReccs.classList.add('show-flip');
        albumReccs.classList.add('album-reccs-show');
    } else{
        showReccs.classList.remove('show-flip');
        albumReccs.classList.remove('album-reccs-show');
    }
})