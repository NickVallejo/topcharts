const addAlbum = document.querySelector('.add-btn');

addAlbum.addEventListener('click', customAlbum);

function customAlbum(){
    const imgUrl = prompt("Paste an image URL for your album cover.")
    let artistName
    let albumName

    if(imgUrl && imgUrl.startsWith("http") || imgUrl.startsWith("https") && imgUrl.endsWith(".jpeg" || ".png" || ".webp" || ".jpg")){
        artistConfirm()

        function artistConfirm(){
            artistName = prompt("What is the name of the artist?")
            if(!artistName){
                alert('No artist name')
                artistConfirm()
            } else{
                albumConfirm()
            }
        }

        function albumConfirm(){
            albumName = prompt("What is the name of the album?")
            if(!albumName){
                alert('No album name')
                albumConfirm()
            } else{
                console.log(imgUrl, artistName, albumName)
                const customAlbum = {artist: artistName, album_name: albumName, album_image: imgUrl}
                displayCustomAlbum(JSON.stringify(customAlbum))
            }
        }

    } else{
        alert("Invalid Url")
        customAlbum()
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

    customSugg.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", e.target.getAttribute("index"))
        console.log(e.target.getAttribute("index"))
    })

}