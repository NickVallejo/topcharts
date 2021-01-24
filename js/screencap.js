
screencapBtn = document.querySelector('.screencap-btn')

screencapBtn.addEventListener('click', ()=> {
    html2canvas(document.querySelector(".display-screen"), {useCORS: true}).then(canvas => {
        const chartName = document.querySelector('.chart_title').childNodes[0].textContent
        console.log(chartName)
        const a = document.createElement("a");
        a.href = canvas.toDataURL()
        a.download = `${chartName}.png`
        a.click();
    });
})
