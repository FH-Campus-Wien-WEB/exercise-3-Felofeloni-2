const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');
const fs = require("fs");

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Configure a 'get' endpoint for all movies
app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel);
  const genre = req.query.genre;

  if (genre) {
    movies = movies.filter(movie =>
      movie.Genres.includes(genre)
    );
  }

  res.json(movies);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  if (req.params.imdbID in movieModel) {
    res.json(movieModel[req.params.imdbID])
  } else {
    res.sendStatus(404)
  }
})

// Configure a 'put' endpoint for a specific movie
app.put('/movies/:imdbID', function (req, res) {
  if (req.params.imdbID in movieModel) {
    putMovie(req.body)
    res.sendStatus(200)
  } else {
    putMovie(req.body)
    res.sendStatus(201)
  }
})

// Configure a 'get' endpoint for a all genres
app.get('/genres', function (req, res) {
  const genres = new Set();
  for(const movie of Object.values(movieModel)){
    for (const genre of movie.Genres) {
      genres.add(genre);
    }
  }
  res.json(Array.from(genres).sort());
})

function putMovie(movie){
  movieModel[movie.imdbID]=movie

  const filePath = path.join(__dirname, "files/json/"+movie.imdbID+".json")
  fs.writeFileSync(filePath, JSON.stringify(movie, null, 2), "utf-8");
}

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
