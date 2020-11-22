const grabViewData = () => {

   const req = new XMLHttpRequest();
   req.open('GET', 'http://localhost:4000/view') 
   req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
   req.onload = () => {
        const data = JSON.parse(req.responseText)
        console.log(data)
    }

    req.send();
}


grabViewData()