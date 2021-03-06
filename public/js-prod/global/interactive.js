const showReccs = document.querySelector('.recc-show');
const albumReccs = document.querySelector('.album_reccs');
const roundUp = document.querySelector('.round-up');
const mobileNav = document.querySelector('.mobile-nav');
const set = document.querySelector('.field-wrap');
const savedBtn = document.querySelector('.mobile-nav-wrap .fa-list');
const saved = document.querySelector('.saved');
const reccBtn = document.querySelector('.fa-music');
const setBtn =  document.querySelector('.fa-cog');
const settings = document.querySelector('.setting-slide');
const profile = document.querySelector('.profile-slide');
const navTapped = document.querySelector('.nav-tapped')
const profBtn = document.querySelector('.prof-img-mob')
const roundDown = document.querySelector('.round-down-btn')
const savedTitles = document.querySelectorAll('.saved_item')
const mobListBtn = document.querySelector('.list-burg')
const chartNames = document.querySelector('.chart_names')

let up = false;

if(mobListBtn != null){
    mobListBtn.addEventListener('click', toggleMobChartList)  
}

function toggleMobChartList(){
    if(chartNames.classList.contains('chart_names_show')){
        chartNames.classList.remove('chart_names_show')
    } else{
        chartNames.classList.add('chart_names_show')

    }
}

function saved_list_closer(){
    if(saved && savedBtn){
        setTimeout(() => {
            saved.classList.remove('set-slide-up');
            savedBtn.classList.remove('nav-tapped');
        },200)
    }
}

if(profBtn){
    profBtn.addEventListener('click', () => {
        ytExit()
        const slidUp =  document.querySelector('.set-slide-up');
        const navTapped = document.querySelector('.nav-tapped')
        
        profile.classList.add('set-slide-up');
        profBtn.classList.add('nav-tapped');
    
        if(slidUp){
            slidUp.classList.remove('set-slide-up')
            navTapped.classList.remove('nav-tapped')
        }
        
    })
}

if(setBtn){
    setBtn.addEventListener('click', () => {
        ytExit()
        const slidUp =  document.querySelector('.set-slide-up');
        const navTapped = document.querySelector('.nav-tapped')
        
        settings.classList.add('set-slide-up');
        setBtn.classList.add('nav-tapped');
    
        if(slidUp){
            slidUp.classList.remove('set-slide-up')
            navTapped.classList.remove('nav-tapped')
        }
    })
}

if(reccBtn){
    reccBtn.addEventListener('click', () => {
        ytExit()
        const slidUp =  document.querySelector('.set-slide-up');
        const navTapped = document.querySelector('.nav-tapped')

        albumReccs.classList.add('set-slide-up');
        reccBtn.classList.add('nav-tapped');

        if(slidUp){
            slidUp.classList.remove('set-slide-up')
            navTapped.classList.remove('nav-tapped')
        }
        
    })
}

if(savedBtn){
    savedBtn.addEventListener('click', () => {
        ytExit()
        const slidUp =  document.querySelector('.set-slide-up')
        const navTapped = document.querySelector('.nav-tapped')
        const savedItems = document.querySelectorAll('.saved_item')

        saved.classList.add('set-slide-up');
        savedBtn.classList.add('nav-tapped');

        if(slidUp){
            slidUp.classList.remove('set-slide-up')
            navTapped.classList.remove('nav-tapped')
        }
        
    })
}

if(showReccs){
    showReccs.addEventListener('click', () => {
        const slidUp =  document.querySelector('.set-slide-up');
        const navTapped = document.querySelector('.nav-tapped')

        if(slidUp){
            slidUp.classList.remove('set-slide-up')
            navTapped.classList.remove('nav-tapped')
        }

        up = !up;

        if(up){
            showReccs.classList.add('show-flip');
            albumReccs.classList.add('album-reccs-show');
        } else{
            showReccs.classList.remove('show-flip');
            albumReccs.classList.remove('album-reccs-show');
        }
    })
}

if(roundUp){
    roundUp.addEventListener('click', () => {
        ytExit()
        const slidUp =  document.querySelector('.set-slide-up');
        const navTapped = document.querySelector('.nav-tapped')
    
        if(slidUp){
            slidUp.classList.remove('set-slide-up')
            navTapped.classList.remove('nav-tapped')
        }
    
            roundDown.classList.remove('round-hide')
            roundUp.classList.add('round-down');
            mobileNav.classList.add('slide-down');
            set.classList.add('set-search-up');
    
    })
}

if(roundDown){
    roundDown.addEventListener('click', () => {
        if(roundUp.classList.contains('round-down')){
            roundDown.classList.add('round-hide')
            roundUp.classList.remove('round-down');
            mobileNav.classList.remove('slide-down');
            set.classList.remove('set-search-up');
        }
    })
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && !roundDown.classList.contains('round-hide')){
        roundDown.classList.add('round-hide')
    }
})

function ytExit(){
    const ytVid = document.querySelector('.yt-vid')

    if(ytVid){
        ytVid.remove()
    }
}