const addAlbum = document.querySelector('.add-btn');

addAlbum.addEventListener('click', customAlbum);

function customAlbum(){
    const imgUrl = prompt("Paste an image URL for your album cover.")
    let artistName
    let albumName
    if(imgUrl !== null && imgUrl.startsWith("http") || imgUrl.startsWitch("https") && imgUrl.endsWith(".jpeg" || ".png" || ".webp" || ".jpg")){
        artistName = prompt("What is the name of the artist?")
        if(artistName !== null){
            albumName = prompt("What is the name of the album?")
        }
    } else{
        alert("Invalid Url")
    }

    if(imgUrl && artistName && albumName){
        const customAlbum = {artist: artistName, album_name: albumName, album_image: imgUrl}
        displayCustomAlbum(JSON.stringify(customAlbum))
    }
}

function displayCustomAlbum(customAlbum){
    sugg_array = []
    suggs_box.innerHTML = ""

    const parsedCustomAlbum = JSON.parse(customAlbum)
    sugg_array.push(parsedCustomAlbum)
    var album_sugg = '<img class="sugg_album" index=' + 0 + " src=" + parsedCustomAlbum.album_image + ">"
    suggs_box.insertAdjacentHTML("beforeend", album_sugg)

    const customSugg = document.querySelector(".sugg_album")

      customSugg.addEventListener("click", (event) => {
        var index = event.target.getAttribute("index")
        sugg_click(index) //pass the index of the sugg we clicked
      })

}