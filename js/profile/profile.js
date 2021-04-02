const chartBox = document.querySelector('.profile-charts');
const followBtn = document.querySelector('.follow-btn')
let profCharts;
const profImgSubmit = document.querySelector('#profile-image-submit');
const profImgDisplay = document.querySelector('#profile-img-display');

if(profImgSubmit != null){
    profImgSubmit.addEventListener('change', () => {

        const profImg = profImgSubmit.files[0];
        const formData = new FormData();
        
        formData.append("profileImage", profImg)
    
        const req = new XMLHttpRequest();
        req.open("POST", 'settings/image')
    
        req.onload = () => {
            try{
                const myNewProfImg = req.responseText.replace(/\\/g, "/");
                profImgDisplay.style.backgroundImage = `url(${myNewProfImg})`;
            }
            catch(err){
                console.log({err: err});
            }
        }
    
        req.send(formData);
    })
}
//! WHEN A PROFILE PAGE IS REQUESTED, THESE TWO FUNCTION PULL THE CHARTS
// const getProfile = () => {
//     const req = new XMLHttpRequest();

//     req.open('GET', 'http://localhost:4001/profile/user');

//     req.onload = () => {
//         const user = req.responseText
//         console.log(user)
//         getProfileData(user);
//     }

//     req.send();
// }

function chartListeners() {
    console.log('THE CHARTS', profCharts)
    profCharts.forEach(chart => {
        chart.addEventListener('click', (e) => {
            if(e.target.classList.contains('prof-chart-del')){
               list_trash(e.target.parentNode, true);
            }
        });
    })    
 }


//! LOOK FOR CHARTS BASED ON THE USER IN THE URL PATH
const getProfileData = async (myProfile) =>{
    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:4001/profile/charts');
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

    //get the pathname and look for charts based on this username
    const pathname = window.location.pathname.replace('/', '');
    console.log(pathname)

     req.onload = () => {
        const data = JSON.parse(req.responseText);

        console.log(data)

        data.musicCharts.forEach((chart) => {
        const title = chart.title.replace(/_/g, ' ');
        const firstFour = [];
        const albums = JSON.parse(chart.chart);

        albums.forEach(album => {
            console.log(album)
            if(firstFour.length !== 4 && album !== null){
                firstFour.push(album.album_image)
            }
        })

        while(firstFour.length < 4){
            firstFour.push('https://i.imgur.com/8w4GEqb.png');
        }

        console.log(firstFour);
        const exitOrNot = myProfile ? '<i class="fas fa-times prof-chart-del"></i>' : '';
 
        chartBox.insertAdjacentHTML('beforeend', `<div class="prof-chart"><a href="/${data.username}/chart/${chart.title}" name=${chart.title.replace(/ /g, "_")}><h3 class="prof-chart-title">${title}</h3><div class="prof-chart-wrapper"><div class="prof-chart-cover"></div><img src=${firstFour[0]}><img src=${firstFour[1]}><img src=${firstFour[2]}><img src=${firstFour[3]}></div></a>${exitOrNot}</div>`)
        })
        
        profCharts = document.querySelectorAll('.prof-chart')
        chartListeners(profCharts)
    }

    req.send(`username=${pathname}`);
}

//  getProfileData();