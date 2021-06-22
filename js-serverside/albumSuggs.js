var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

//! SUGGESTS NEW ALBUMS FOR THE LISTENER BASED ON THE CURRENT ARTISTS IN THEIR LISTS
async function albumSuggs(req, res, next) {

  const artistNames = JSON.parse(req.query.artistNames);

  if(!req.session.userId){res.render('404-data', {layout: './layouts/404'});}
  
  //if the user's list of artists is defined and greater than 5 and the suggestions haven't loaded yet, execute the function
  
      //define Math.random object that generates a random FLOORED number that is less than atistNames
      let simArtists = [] //create an array for similar artists
      let inc = 0
  
      let chosen = []
  
      async function requester() {
        let gen = new XMLHttpRequest()
        gen.onload = function () {
          for (i = 0; i < 3; i++) {
            //relay(JSON.parse(gen.responseText).similarartists.artist[i]);
            if (JSON.parse(gen.responseText).similarartists.artist[i]) {
              simArtists.push(JSON.parse(gen.responseText).similarartists.artist[i])
              // i++;
            } 
          }
        }
  
        if (inc < 5) {
          let randomArtist = Math.floor(Math.random() * artistNames.length)
          var notInside = chosen.every((choice) => choice !== artistNames[randomArtist])
  
          if (notInside == true && Array.isArray(artistNames[randomArtist].match("^[A-Za-z0-9 _]+$"))) {
            gen.open(
              "GET",
              "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" +
                artistNames[randomArtist] +
                "&api_key=0bb289309c3ad8b8a89446a23919f273&format=json",
              false
            )
            gen.send()
            chosen.push(artistNames[randomArtist])
            inc++
            console.log('PUSHING FOR', artistNames[randomArtist])
            requester()
          } else if (Array.isArray(artistNames[randomArtist].match("^[A-Za-z0-9 _]+$")) == null) {
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
            console.log('response length', album.length)
            for (i = 0; i < album.length; i++) {
              let randomAlbum = Math.floor(Math.random() * album.length)
              if (album[randomAlbum] !== undefined && album[randomAlbum].image[2]["#text"] !== "") {
                similarAlbums.push(album[randomAlbum])
                console.log('yup')
                break
              } else {
                console.log('nope')
                continue
              }
            }
          } catch (err) {
            console.log(err)
          }
        }
  
        simgen.onerror = (err) => console.log(err)
  
        mysims.forEach(function (sim) {
          console.log('Name: ' + sim.name)
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
  
      const mysims = await requester()
      var similarAlbumsResponse = await simAlbums(mysims)
      req.session.suggsLoaded = true
      console.log("server suggs loaded? " + req.session.suggsLoaded)
      res.send(similarAlbumsResponse)
      res.end()

  }

global.albumSuggs = albumSuggs;