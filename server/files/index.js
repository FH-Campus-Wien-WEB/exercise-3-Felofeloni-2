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

function editMovie(id){
  location.href = 'edit.html?imdbID=' + id
}

window.onload = function () {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
        const bodyElement = document.querySelector("body")
        if (xhr.status == 200) {
            const movies = JSON.parse(xhr.responseText)
            for(const movie of movies){
                appendMovie(movie, bodyElement)
            }
        } else {
            bodyElement.append("Daten konnten nicht geladen werden, Status " + xhr.status + " - " + xhr.statusText)
        }
    }
    xhr.open("GET", "/movies")
    xhr.send()
}
