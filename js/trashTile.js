//DELETE A TILE FROM A LIST
function trashTile(e) {
  if (e.target.classList.contains("frontDel")) {
    const position = e.target
    const positionToDel = position.parentNode.getAttribute("rank")
    all_top[positionToDel].style.backgroundImage = ""
    chartData[positionToDel].textContent = ""

    if (my_list.title !== undefined) {
      my_list.chart.splice(positionToDel, 1, null)
      console.log("list after splice", my_list)
      chartUpdate()
    } else {
      my_list.splice(positionToDel, 1, null)
      console.log(my_list)
      localStorage.setItem("unsavedList", JSON.stringify(my_list))
    }
  }
}
