var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

//! SUGGESTS NEW ALBUMS FOR THE LISTENER BASED ON THE CURRENT ARTISTS IN THEIR LISTS
async function albumSuggs(req, res, next) {
    if (req.session.artistNames !== undefined && req.session.artistNames.length > 5 && req.session.suggsLoaded == false) { //if the user's list of artists is defined and greater than 5 and the suggestions haven't loaded yet, execute the function
  
      //define Math.random object that generates a random FLOORED number that is less than atistNames
      let simArtists = [] //create an array for similar artists
      let inc = 0
  
      let chosen = []
  
      console.log("Artist name length", req.session.artistNames.length)
      console.log("suggs Loaded?", req.session.suggsLoaded)
  
      async function requester() {
        let gen = new XMLHttpRequest()
        gen.onload = function () {
          for (i = 0; i < 3; i++) {
            //relay(JSON.parse(gen.responseText).similarartists.artist[i]);
            if (JSON.parse(gen.responseText).similarartists.artist[i]) {
              simArtists.push(JSON.parse(gen.responseText).similarartists.artist[i])
            }
            //console.log('simArtists getting filled...', simArtists);
          }
        }
  
        if (inc < 4) {
          let randomArtist = Math.floor(Math.random() * req.session.artistNames.length)
          var notInside = chosen.every((choice) => choice !== req.session.artistNames[randomArtist])
  
          if (notInside == true && Array.isArray(req.session.artistNames[randomArtist].match("^[A-Za-z0-9 _]+$"))) {
            gen.open(
              "GET",
              "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" +
                req.session.artistNames[randomArtist] +
                "&api_key=0bb289309c3ad8b8a89446a23919f273&format=json",
              false
            )
            gen.send()
            chosen.push(req.session.artistNames[randomArtist])
            inc++
            console.log(req.session.artistNames[randomArtist])
            requester()
          } else if (Array.isArray(req.session.artistNames[randomArtist].match("^[A-Za-z0-9 _]+$")) == null) {
            requester()
          } else {
            requester()
          }
        }
  
        return simArtists
      }
  
      async function simAlbums(mysims) {
        var similarAlbums = []
        let simgen = new XMLHttpRequest()
  
        // simgen.onreadystatechange = () => console.log(simgen.readyState)
  
        simgen.onload = function () {
          try {
            var album = JSON.parse(simgen.responseText).results.albummatches.album
  
            for (i = 0; i < 15; i++) {
              let randomAlbum = Math.floor(Math.random() * 4 + 1)
              //   var nameInclude = simAlbums.every((simAlbum)=>{
              //     if(simAlbum){
              //     if (simAlbum.name !== undefined && album[randomAlbum].name !== undefined && simAlbum.name !== album[randomAlbum].name){
              //     return true;
              //   }
              // }
              //   });
              // console.log("PROBLEM ALBUM", album[randomAlbum])
              if (album[randomAlbum] !== undefined && album[randomAlbum].image[2]["#text"] !== "") {
                similarAlbums.push(album[randomAlbum])
                break
              } else {
                continue
              }
            }
          } catch (err) {
            console.log(err)
          }
        }
  
        simgen.onerror = (err) => console.log(err)
  
        mysims.forEach(function (sim) {
          let simName = sim.name.replace(/[^a-zA-Z ]/g, "")
          simgen.open(
            "GET",
            "http://ws.audioscrobbler.com/2.0/?method=album.search&album=" +
              simName +
              "&api_key=0bb289309c3ad8b8a89446a23919f273&format=json",
            false
          )
          simgen.send()
        })
  
        return similarAlbums
      }
  
      //console.log('Here are your favourite artists', req.session.artistNames);
      //console.log('Here are some suggested arti sts', simArtists);
      //const simArtistArray = requester();
      //res.send(simArtistArray);
      const mysims = await requester()
      var similarAlbumsResponse = await simAlbums(mysims)
  
      req.session.suggsLoaded = true
      console.log("server suggs loaded? " + req.session.suggsLoaded)
      res.send(similarAlbumsResponse)
      res.end()
    } else {
      res.end()
    }
  }

global.albumSuggs = albumSuggs;