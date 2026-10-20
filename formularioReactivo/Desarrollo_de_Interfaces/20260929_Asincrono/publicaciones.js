console.log("Publicando");

const api = 'https://jsonplaceholder.typicode.com/photos'
fetch (api) // promise
  .then(response => response.json())
  .then(j => galeria.innerHTML = j.map(t=>`<img src = "${t.url}" width="50">`))

// Muestra el title de cada publicación dentro de una lista <ul> en la página HTML.