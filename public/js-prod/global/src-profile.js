window.onload = () => {
    const profSrcInputDesk = document.querySelector('.prof-src__desk .prof-src__input')
    const profSrcFormDesk = document.querySelector('.prof-src__desk')

    const profSrcInputMob = document.querySelector('.prof-src__mob .prof-src__input')
    const profSrcFormMob = document.querySelector('.prof-src__mob')

    if(profSrcFormDesk != null){
        profSrcFormDesk.addEventListener('submit', async(e) => {
            e.preventDefault()
            if(profSrcInputDesk.value.length > 0){
                const query = profSrcInputDesk.value
                window.location.href = `/search/${query}`
            }
        })
    }

    if(profSrcFormMob != null){
        profSrcFormMob.addEventListener('submit', async(e) => {
            e.preventDefault()
            if(profSrcInputMob.value.length > 0){
                const query = profSrcInputMob.value
                window.location.href = `/search/${query}`
            }
        })
    }
}