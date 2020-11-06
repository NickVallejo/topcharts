const chartBox = document.querySelector('.profile-charts');

const getProfileData = () =>{
    const req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:4000/profile/stuff');

    req.onload = () => {
        const data = JSON.parse(req.responseText);

        data.forEach((chart) => {
        const title = chart.title
        const firstFour = [];
        const albums = JSON.parse(chart.chart);

        albums.forEach(album => {
            if(firstFour.length !== 4 && album !== null){
                firstFour.push(album.album_image)
            }
        })

        console.log(firstFour);

        chartBox.insertAdjacentHTML('beforeend', `<div class="prof-chart"><a href="/view/${chart.title}"><h3>${title}</h3><div><img src=${firstFour[0]}><img src=${firstFour[1]}><img src=${firstFour[2]}><img src=${firstFour[3]}></div></a></div>`)
        }) 
    }

    req.send();
}

getProfileData();