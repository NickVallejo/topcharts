window.onload = () => {
    const profSrcForm = document.querySelector('.prof-src')
    const profSrcInput = document.querySelector('.prof-src__input')

    const userSrc = async() => {
        const profs = await fetch('/profile/user-src', {
            method: 'GET'
        })
    }

    profSrcInput.addEventListener('keydown', async (e) => {
        if(e.target.value.length > 3){
            userSrc()
        }
    })

    profSrcForm.addEventListener('submit', () => userSrc())
}