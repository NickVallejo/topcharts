window.onload = () => {
    const profSrcForm = document.querySelector('.prof-src')
    const profSrcInput = document.querySelector('.prof-src__input')

    profSrcInput.addEventListener('keydown', async (e) => {
        if(e.target.value.length > 3){
            const profs = await fetch('/profile/user-src', {
                method: 'GET'
            })
            const profsJson = await profs.json()
            console.log(profsJson) 
        }
    })

    profSrcForm.addEventListener('submit', () => {
        console.log('hi')
    })
}