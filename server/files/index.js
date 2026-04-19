function displayMovie(movie) {
    //Container
    const container = document.createElement("article")
    container.id = movie.imdbID

    //Poster
    const poster = document.createElement("img")
    poster.src = movie.Poster
    container.appendChild(poster)

    //Child-container
    const childContainer = document.createElement("div")
    childContainer.classList.add("child-container");

      //Article-header
      const articleContainer = document.createElement("div")
      articleContainer.classList.add("article-header");

        //Title-container
        const titleContainer = document.createElement("div")
        titleContainer.classList.add("title-container");

            //Title
            const title = document.createElement("h2")
            title.textContent = movie.Title
            titleContainer.appendChild(title)

            //Side-Container
            const sideContainer = document.createElement("div")
            sideContainer.classList.add("article-side");

                //Edit Button
                const edit = document.createElement("button")
                edit.textContent = "Edit"
                edit.addEventListener("click", () => {
                    editMovie(container.id)
                });
                sideContainer.appendChild(edit)

            titleContainer.appendChild(sideContainer)

        articleContainer.appendChild(titleContainer)

        // Info (Released, Runtime, Rating)
        const info = document.createElement("p")
        info.textContent = `Released: ${movie.Released} | Runtime: ${movie.Runtime} min | IMDb: ${movie.imdbRating} | Metascore: ${movie.Metascore}`
        articleContainer.appendChild(info)

      childContainer.appendChild(articleContainer)

      // Genres
      const genres = generateTagsElement(movie.Genres)
      childContainer.appendChild(genres)

      // Plot
      const plot = document.createElement("p")
      plot.textContent = movie.Plot
      childContainer.appendChild(plot)

      //Directors
      const directors = generateListElement("Directors", movie.Directors)
      childContainer.appendChild(directors)

      //Writers
      const writers = generateListElement("Writers", movie.Writers)
      childContainer.appendChild(writers)
      
      //Actors
      const actors = generateListElement("Actors", movie.Actors)
      childContainer.appendChild(actors)
    
    container.appendChild(childContainer)

    return container
}

function generateListElement(listTitle, list){
    const element = document.createElement("p")

    const title = document.createElement("h3");
    title.textContent = listTitle;
    element.appendChild(title)

    const unsortedList = document.createElement("ul")
    for(const item of list){
        const listItem = document.createElement("li")
        listItem.textContent = item
        unsortedList.appendChild(listItem)
    }

    element.appendChild(unsortedList)

    return element
}

function generateTagsElement(list){
    const element = document.createElement("div")

    for(const item of list){
        const span = document.createElement("span")
        span.textContent = item
        span.classList.add("genre-tag");
        element.appendChild(span)
    }

    return element
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
                bodyElement.append(displayMovie(movie))
            }
        } else {
            bodyElement.append("Daten konnten nicht geladen werden, Status " + xhr.status + " - " + xhr.statusText)
        }
    }
    xhr.open("GET", "/movies")
    xhr.send()
}
