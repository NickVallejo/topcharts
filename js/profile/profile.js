const chartBox = document.querySelector('.profile-charts');

//! WHEN A PROFILE PAGE IS REQUESTED, THESE TWO FUNCTION PULL THE CHARTS
// const getProfile = () => {
//     const req = new XMLHttpRequest();

//     req.open('GET', 'http://localhost:4000/profile/user');

//     req.onload = () => {
//         const user = req.responseText
//         console.log(user)
//         getProfileData(user);
//     }

//     req.send();
// }


//! LOOK FOR CHARTS BASED ON THE USER IN THE URL PATH
const getProfileData = () =>{
    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:4000/profile/charts');
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

    //get the pathname and look for charts based on this username
    const pathname = window.location.pathname.replace('/', '');
    console.log(pathname)

    req.onload = () => {
        const data = JSON.parse(req.responseText);

        console.log(data)

        data.musicCharts.forEach((chart) => {
        const title = chart.title
        const firstFour = [];
        const albums = JSON.parse(chart.chart);

        albums.forEach(album => {
            if(firstFour.length !== 4 && album !== null){
                firstFour.push(album.album_image)
            }
        })

        console.log(firstFour);

        chartBox.insertAdjacentHTML('beforeend', `<div class="prof-chart"><a href="/${data.username}/chart/${chart.title}"><h3>${title}</h3><div class="prof-chart-wrapper"><div class="prof-chart-cover"></div><img src=${firstFour[0]}><img src=${firstFour[1]}><img src=${firstFour[2]}><img src=${firstFour[3]}></div></a></div>`)
        }) 
    }

    req.send(`username=${pathname}`);
}

getProfileData();