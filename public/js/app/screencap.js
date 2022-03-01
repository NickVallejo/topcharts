
screencapBtns = document.querySelectorAll('.screencap-btn')

screencapBtns.forEach(screencapBtn => {
    screencapBtn.addEventListener('click', ()=> {
        html2canvas(document.querySelector(".display-screen"), {useCORS: true, scale: 2}).then(canvas => {
            const chartName = document.querySelector('.chart_title h3').textContent
            const a = document.createElement("a");
            a.href = canvas.toDataURL()
            a.download = `${chartName}.png`
            a.click();
        });
    })
})
