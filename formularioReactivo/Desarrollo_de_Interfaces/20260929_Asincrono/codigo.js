console.log("Funciona");

// CallBack 
function addToArray (data, array, callback) {
  if (!array) {
    return callback(new Error('No existe el array', null))
  }
  setTimeout(function() { 
    array.push(data)
    callback(null, array)
  }, 1000)                  // ASÍNCRONO NO BLOQUEANTE, YA QUE, SI TRES PERSONAS VAN A PEDIR UN CAFÉ, P
                            // ERO JUSTO LES LLAMAN A ESAS DOS PERSONAS, EL CAMARERO ATENDERÁ AL TERCERO.
}

var array = [1,2,3];

addToArray(4, array, function (err) {
  if (err) return console.log(err.message)
  console.log(array)
})

// Promesas (evolución de los callback) - ES6

//Veamos el mismo ejemplo que antes pero utilizando Promesas nativas de ES2015

function addToArray (data, array2) {
  const promise = new Promise(function (resolve, reject) {
    setTimeout(function() {
      array2.push(data)
      resolve(array2)
    }, 1000);
    
    if (!array) {
      reject(new Error('No existe un array'))
    }
  })
  
  return promise
}

const array2 = [1, 2, 3]
addToArray(4, array2).then(function () {
  console.log(array2)
})


// Fetch
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(json => console.log(json))

