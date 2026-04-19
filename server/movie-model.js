const fs = require("fs");
const path = require('path');

const folder = path.join(__dirname, "files/json");;

const movieObject = fs.readdirSync(folder)
  .filter(file => file.endsWith(".json"))
  .map(file => {
    const content = fs.readFileSync(path.join(folder, file), "utf-8");
    return JSON.parse(content);
  })
  .reduce((acc, movie) => {
    acc[movie.imdbID] = movie;
    return acc;
  }, {});

module.exports = movieObject;