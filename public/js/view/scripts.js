let touch,touchMoved,isScrolling;function touchMove(){console.log("scrolling"),touchMoved=!0,clearTimeout(isScrolling),isScrolling=setTimeout((()=>{console.log("scrolling has stopped"),touchMoved=!1}),100)}function touchStart(e){if(1!=touchMoved&&null!=e.target.childNodes[1]){console.log("switch from");const o=document.querySelectorAll(".top");let s=e.target;e.target.getAttribute("rank");const n=document.querySelector(".tile-inspect");if(n){for(n.classList.remove("tile-inspect"),n.childNodes[1].style.display="none",i=1;i<4;i++)n.childNodes[i].style.opacity="0",n.childNodes[i].style.pointerEvents="none";n.removeEventListener("touchend",tileSettings)}if(null!=s.childNodes[1]){for(s.classList.add("tile-inspect"),s.childNodes[1].style.display="block",i=1;i<4;i++)s.childNodes[i].style.opacity="1",s.childNodes[i].style.pointerEvents="all";s.addEventListener("touchend",tileSettings)}async function t(e){if(console.log("switch to"),null==e.target.closest(".top")||1==touchMoved&&e.target.classList.contains("tile-hover")||e.target.classList.contains("tile-hover")){if(console.log("inside first condditional"),o.forEach((e=>{e.addEventListener("touchend",touchStart)})),document.removeEventListener("touchend",t),null!=s.childNodes[1]){for(s.classList.remove("tile-inspect"),s.childNodes[1].style.display="none",i=1;i<4;i++)s.childNodes[i].style.opacity="0",s.childNodes[i].style.pointerEvents="none";s.removeEventListener("touchend",n)}}else if(1!=touchMoved&&!e.target.classList.contains("frontPlay")&&!e.target.classList.contains("frontRank")&&!e.target.classList.contains("tile-title")){const r=e.target;e.target.getAttribute("rank"),r.childNodes[1];if(null!=s.childNodes[1]){for(s.classList.remove("tile-inspect"),s.childNodes[1].style.display="none",i=1;i<4;i++)s.childNodes[i].style.opacity="0",s.childNodes[i].style.pointerEvents="none";s.removeEventListener("touchend",n)}if(null!=r.childNodes[1]){for(r.classList.add("tile-inspect"),r.childNodes[1].style.display="block",i=1;i<4;i++)r.childNodes[i].style.opacity="1",r.childNodes[i].style.pointerEvents="all";r.addEventListener("touchend",n)}o.forEach((e=>{e.addEventListener("touchend",touchStart)})),document.removeEventListener("touchend",t)}function n(e){if(console.log(window.viewChart,"YA"),e.target.classList.contains("frontPlay")){let t,i=new XMLHttpRequest;t=window.viewChart[e.target.parentNode.getAttribute("rank")],console.log(t),i.open("GET",`/yt-listen?artist=${t.artist}&album=${t.album_name}`),i.onload=()=>{let e,t;const o=i.responseText.replace("watch?v=","embed/");ytWrap.innerHTML=`<div class="yt-vid"><p class="yt-exit">X</p><iframe width="560" height="315" src=${o}?rel=0&controls=1&autoplay=1&mute=0 allow="autoplay" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,e=document.querySelector(".yt-exit"),t=document.querySelector(".yt-vid");const s=document.querySelector(".set-slide-up");s&&s.classList.remove("set-slide-up"),console.log("PANG PANG PANG"),e.addEventListener("click",(()=>{t.remove()}))},i.send()}else if(e.target.classList.contains("tile-hover")){for(console.log("tile HOVER DETEDCTED"),this.childNodes[1].style.display="none",this.classList.remove("tile-inspect"),i=1;i<4;i++)this.childNodes[i].style.opacity="0",this.childNodes[i].style.pointerEvents="none";e.target.removeEventListener("touchend",n),setTimeout((()=>{addtileListeners()}),100)}}}o.forEach((e=>{e.removeEventListener("touchend",touchStart)})),setTimeout((()=>{document.addEventListener("touchend",t)}),1e-4)}}function addtileListeners(){const e=document.querySelectorAll(".top");"ontouchstart"in document.body?e.forEach((e=>{e.addEventListener("touchend",touchStart),e.addEventListener("touchmove",touchMove),e.removeEventListener("click",tileSettings)})):e.forEach((e=>{e.removeEventListener("touchend",touchStart),e.removeEventListener("touchmove",touchMove),e.addEventListener("click",tileSettings)}))}const pathArray=window.location.pathname.split("/"),topWrapper=document.querySelector(".top_wrapper"),chartNamesWrapper=document.querySelector(".chart_names"),frontEndTitle=document.querySelector(".chart_title"),ytWrap=document.querySelector(".yt-wrap"),user=pathArray[1],chart=pathArray[3];function tileSettings(e){if(console.log(window.viewChart,"YA"),e.target.classList.contains("frontPlay")){let t,i=new XMLHttpRequest;t=window.viewChart[e.target.parentNode.getAttribute("rank")],console.log(t),i.open("GET",`/yt-listen?artist=${t.artist}&album=${t.album_name}`),i.onload=()=>{let e,t;const o=i.responseText.replace("watch?v=","embed/");ytWrap.innerHTML=`<div class="yt-vid"><p class="yt-exit">X</p><iframe width="560" height="315" src=${o}?rel=0&controls=1&autoplay=1&mute=0 allow="autoplay" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,e=document.querySelector(".yt-exit"),t=document.querySelector(".yt-vid");const s=document.querySelector(".set-slide-up");s&&s.classList.remove("set-slide-up"),console.log("PANG PANG PANG"),e.addEventListener("click",(()=>{t.remove()}))},i.send()}}const getViewData=async()=>{const e=new XMLHttpRequest;e.open("GET",`/profile/onechart?username=${user}&chartname=${chart}`),e.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),e.onload=()=>{const t=JSON.parse(e.responseText);showViewData(t.user,t.chart),window.viewChart=t.chart.chart},e.send()},showViewData=(e,t)=>{const o=t.chart,s=t.title.replace(/_/g," ");for(frontEndTitle.innerHTML=`<h3 class="view-title-info"><span><a class="view-username" href="/${e}">${e}:</a> ${s}</span></h3>`,topWrapper.innerHTML="",i=0;i<o.length;i++)void 0!==o[i]&&null!==o[i]?topWrapper.insertAdjacentHTML("beforeend",`<div style="background-image: url(${o[i].album_image})" class="top ${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p><div class="tile-hover" rank=${i}></div><i class="fas fa-play-circle frontPlay"></i><p class="tile-title">${o[i].artist} - ${o[i].album_name}</p></div>`):topWrapper.insertAdjacentHTML("beforeend",`<div style="background-image: url()" class="top ${i}" rank=${i} active="no"><p class="frontRank">${i+1}</p></div>`);for(chartNamesWrapper.innerHTML="",i=0;i<o.length;i++)null!==o[i]&&void 0!==o[i]?chartNamesWrapper.insertAdjacentHTML("beforeend",`<p class="albumInfo" rank=${i}><span class="chartNameNum">${i+1}. </span>${o[i].artist} - ${o[i].album_name}</p>`):chartNamesWrapper.insertAdjacentHTML("beforeend",`<p class="albumInfo" rank=${i}><span class="chartNameNum">${i+1}. </span></p>`);addtileListeners()};getViewData();
//# sourceMappingURL=scripts.js.map
