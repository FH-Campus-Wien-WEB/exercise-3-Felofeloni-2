import { ElementBuilder, ParentChildBuilder } from "./builders.js";

function appendMovie(movie, element) { 
  //Article
  const movieArticle = new ElementBuilder("article").id(movie.imdbID);

  //Poster
  const moviePoster = new ElementBuilder("img").with("src", movie.Poster);
  moviePoster.appendTo(movieArticle.element)

  //Content Container
  const movieContent = new ElementBuilder("div").class("content-container");
  const articleHeader = new ElementBuilder("div").class("article-header")
  articleHeader.appendTo(movieContent.element)
  const titleContainer = new ElementBuilder("div").class("title-container")
  titleContainer.appendTo(articleHeader.element)
  new ElementBuilder("h2").text(movie.Title).appendTo(titleContainer.element)

  const articleSide = new ElementBuilder("div").class("article-side")
  articleSide.appendTo(titleContainer.element)
  const button = new ElementBuilder("button").text("Edit").listener("click", () => {
                    editMovie(movieArticle.element.id)
                })
  button.appendTo(articleSide.element)

  movieContent.append(new ElementBuilder("p").text(`Released: ${movie.Released} | Runtime: ${movie.Runtime} min | IMDb: ${movie.imdbRating} | Metascore: ${movie.Metascore}`))  
      .append(generateTagsElement(movie.Genres))
      .append(new ElementBuilder("p").text(movie.Plot))
      .append(generateListElement("Directors", movie.Directors))
      .append(generateListElement("Writers", movie.Writers))
      .append(generateListElement("Actors", movie.Actors))       
  
  movieArticle.append(movieContent) 

  movieArticle.appendTo(element)
}

function generateListElement(listTitle, list){
  return new ElementBuilder("div")
    .append(new ElementBuilder("h3").text(listTitle))
    .append(
      new ParentChildBuilder("ul", "li").items(list)
    );
}

function generateTagsElement(list){
  const container = new ElementBuilder("div");

  for (const item of list) {
    container.append(
      new ElementBuilder("span")
        .class("genre-tag")
        .text(item)
    );
  }

  return container;
}

function loadGenreList(genres, element){

  const allGenresElement = new ElementBuilder("li")
  .append(new ElementBuilder("button").text("All").listener("click", () => {
                    loadMovies("")
  }))
  allGenresElement.appendTo(element)

  for(const genre of genres){
    const genreElement = new ElementBuilder("li")
      .append(new ElementBuilder("button").text(genre).listener("click", () => {
                    loadMovies(genre)
      }))
    genreElement.appendTo(element)
  }

}

function loadMovies(genre) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector("main");

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove()
    }
    if (xhr.status === 200) {
      const movies = JSON.parse(xhr.responseText)
      for (const movie of movies) {
        appendMovie(movie, mainElement)
      }
    } else {
      mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  }

  const url  = new URL("/movies", location.href)

  if (genre) {
    url.searchParams.set("genre", genre);
  }

  xhr.open("GET", url)
  xhr.send()
}

function editMovie(id){
  location.href = 'edit.html?imdbID=' + id
}

window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const listElement = document.querySelector("nav>ul");

    if (xhr.status === 200) {
      const genres = JSON.parse(xhr.responseText);
      loadGenreList(genres, listElement)

      const firstButton = document.querySelector("nav button");
      if (firstButton) {
        firstButton.click();
      }
    } else {
      document.querySelector("body").append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };
  xhr.open("GET", "/genres");
  xhr.send();
};