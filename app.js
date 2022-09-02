require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here: 
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    // redirectUri: 'http://www.example.com/callback'
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
// simple home route that renders home page.
app.get('/', (req, res) => {
    res.render('home')
})

// /artist-search route that receives the search term from the
// query string and make a search request using a Spotify npm
// package method.
// artistName is the name in field input key from home page.
app.get('/artist-search-results', (req, res, next) => {
    const searchedArtist = req.query.artistName;
    // console.log(searchedArtist);
    spotifyApi
  .searchArtists(searchedArtist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    const items = data.body.artists.items;
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', { allArtists: items} );
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const artistId = req.params.artistId;
    
    spotifyApi
   .getArtistAlbums(artistId)
   .then(data => {
    //  console.log('Artist albums', data.body);
    const items = data.body.items;
    res.render('albums', { allAlbums: items})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
