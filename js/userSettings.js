function numToggle() {
  // this.checked ? (this.checked = true) : (this.checked = false)

  if ((this.checked = true)) this.checked = false

  if ((this.checked = false)) this.checked = true

  frontRanks.forEach((rank) => {
    rank.classList.toggle("numsOff")
  })
}
