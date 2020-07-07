//Menu desplegable de estilos
function displayMenu(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'block') {
        e.style.display = 'none';
    } else {
        e.style.display = 'block'
    }
}

//Cambio de estilos
function swapStyle(sheet) {
    var el = document.querySelector("link[rel='stylesheet']")
    el.setAttribute("href", sheet)
    changeLogo()
}

function changeLogo() {
    var el = document.querySelector("link[rel='stylesheet']")
    var estilo = el.getAttribute("href")
    let logo = document.getElementById("gifLogo")
    if (estilo == "./estilos/night-style.css") {
        logo.setAttribute("src", "./imagenes/gifOF_logo_dark.png")
    } else {
        logo.setAttribute("src", "./imagenes/gifOF_logo.png")
    }
}

//Buscador
async function getSearchResults() {
    var busqueda = document.getElementById('gbuscar')
    const found = await
        fetch('http://api.giphy.com/v1/gifs/search?q=' + busqueda.value +
            '&api_key=' + 'oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe')
            .then((response) => {
                return response.json()
            }).then(data => {
                addGif(data)
                showOnlySearch(busqueda.value)
                getRelatedTags(busqueda.value)
                console.log(data)
                return data
            })
            .catch((error) => {
                return error
            })
        display('none')
        
    return found    
}

//colocar gif en el cuadradito
function addGif (data) {
    let gifs = document.getElementsByClassName('gif2img')
    for (let i = 0; i < 7; i++) {
        let gif = gifs[i];
        gif.setAttribute("src", data.data[i].images.downsized_medium.url)
    }
}

//Detalles de estilo al buscar

function showOnlySearch (valor) {
    let sugerencias = document.getElementById('sugerencias')
    let titulo = document.getElementById('tbusqueda')
    let input = document.getElementById('gbuscar')
    sugerencias.style.display = 'none'
    titulo.innerHTML = valor + '(Resultados)'
}

async function getRelatedTags(data) {
    const found = await
    fetch('http://api.giphy.com/v1/gifs/search/tags?q=' + data + '&api_key=' + 'oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe')
    .then ((response) => {
        return response.json()
    }).then(data => {
        relatedTags(data)
        return data
    })
    .catch((error)=> {
        return error
    })
return found
}

function relatedTags (data){
    let tags = document.getElementsByClassName('tag')
    for (let i = 0; i < 3; i++) {
        let tag = tags[i]
        tag.innerHTML = '#' + data.data[i].name
        console.log(tag.innerHTML)
        showRelatedTags()
    }
    
}
function showRelatedTags (){
    let divTag = document.getElementsByClassName('dtag')
    let tag = document.getElementsByClassName('tag')
    for (let i = 0; i < 3; i++) {
        if(tag[i].innerHTML.length > 0 ) {
            divTag[i].style.display = 'block'
        }
    }
    
}
function chooseRelatedTag (tag) {
    let busqueda = document.getElementById('gbuscar')
    let tags = document.getElementById(tag)
    busqueda.value = tags.innerHTML.substr(1)
}

//Busca recomendaciones y muestra los gifs
async function getRecomendaciones () {
    const found = await
    fetch('http://api.giphy.com/v1/gifs/trending?' + 'api_key=' + 'oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe')
    .then ((response) => {
        return response.json()
    }).then(data => {
        addGifRecomendacion(data)
        return data
    })
    .catch((error)=> {
        return error
    })
return found
}

function addGifRecomendacion (data) {
    let gifs = document.getElementsByClassName('gifimg')
    for (let i = 0; i < 4; i++) {
        let gif = gifs[i];
        gif.setAttribute("src", data.data[i].images.downsized_medium.url)
    }
}
try {
    getRecomendaciones()
} catch (error) {
    console.log(error.message)
}


//Busca las tendencias y las agrega
async function getTendencias () {
    const found = await
    fetch('http://api.giphy.com/v1/gifs/trending?' + 'api_key=' + 'oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe')
    .then ((response) => {
        return response.json()
    }).then(data => {
        addGifTendencia(data)
        return data
    })
    .catch((error)=> {
        return error
    })
return found
}

function addGifTendencia (data) {
    let gifs = document.getElementsByClassName('gif2img')
    for (let i = 0; i < 7; i++) {
        let gif = gifs[i];
        let q = i + 5
        gif.setAttribute("src", data.data[q].images.downsized_medium.url)
    }
}
try {
    getTendencias()
} catch (error) {
    console.log(error.message)
}


//Autocompletar. Desplegable de 3 opciones similares
async function autocomplete (search) {
    const found = await
    fetch('http://api.giphy.com/v1/gifs/search/tags?q=' + search + '&api_key=' + 'oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe')
    .then ((response) => {
        return response.json()
    }).then(data => {
        console.log(data)
        suggestion(data)
        return data
    })
    .catch((error)=> {
        return error
    })
return found
}

function suggestion(data) {
    let recomendaciones = document.getElementsByClassName('recomendacion');
    for (let i = 0; i < 3; i++) {
        let recomendacion = recomendaciones[i]
        recomendacion.innerHTML = data.data[i].name
        console.log(recomendacion)
    }
}

//Mostrar hashtags recomendados
function display(value){
    let li = document.getElementById('buscarRecomendaciones')
    li.style.display = value
}

function callAutocomplete(){
    let busqueda = document.getElementById('gbuscar')
    if(busqueda.value.length > 0) {
        autocomplete(busqueda.value)
        display('block')
    } else {
        display('none')
    }
}
try {
    callAutocomplete()
} catch (error) {
    console.log(error.message)
}


//Permitir elegir recomendacion al user
function replaceSearch (valor) {
    let busqueda = document.getElementById('gbuscar')
    let li = document.getElementById(valor)
    busqueda.value = li.innerHTML
}

//Mostrar solo Mis Guifos

function misGuifos (){
    let buscador = document.getElementById('buscador');
    let recomendaciones = document.getElementById('sugerencias');
    let tendencias = document.getElementById('tendencias');
    let gifUsuario = document.getElementById('gifsUsuario');
    buscador.style.display = 'none'
    recomendaciones.style.display = 'none';
    tendencias.style.display = 'none';
    gifUsuario.style.display = 'block';
}

//Redirigir a Crear un Guifo
function goToCrearGuifo() {
    let cambio = window.location = './crear.html'
    return cambio
}

//events
try {
    let crear = document.getElementById("crear")
    crear.addEventListener('click', goToCrearGuifo)
} catch (error) {
    console.log(error.message)
}

try {
    let estilos = document.querySelector(".estilos")
    estilos.addEventListener('click', (ev) => {
        displayMenu('listaEstilos')
    })
} catch (error) {
    console.log(error.message)
}

try {
    let dia = document.querySelector('.estiloDia')
    dia.addEventListener('click', (ev) => {
        swapStyle('./estilos/day-style.css')
    })
    let noche = document.querySelector('.estiloNoche')
    noche.addEventListener('click', (ev)=> {
        swapStyle('./estilos/night-style.css')
    })
} catch (error) {
    console.log(error.message)
}

try {
    let usuarios = document.querySelector('.usuarios')
    usuarios.addEventListener('click', misGuifos)
} catch (error) {
    console.log(error.message)
}

try {
    let input = document.querySelector('.buscador input')
    let buscar = document.getElementById('buscar_btn')
    let recomendacion1 = document.getElementById('r1')
    let recomendacion2 = document.getElementById('r2')
    let recomendacion3 = document.getElementById('r3')
    let tag = document.getElementsByClassName('dtag')
    input.addEventListener('input', callAutocomplete)
    buscar.addEventListener('click', getSearchResults)
    recomendacion1.addEventListener('click', (ev) => {
        replaceSearch('r1')
    })
    recomendacion2.addEventListener('click', (ev) => {
        replaceSearch('r2')
    })
    recomendacion3.addEventListener('click', (ev) => {
        replaceSearch('r3')
    })
    tag[0].addEventListener('click', (ev) => {
        chooseRelatedTag('tag1')
    })
    tag[1].addEventListener('click', (ev) => {
        chooseRelatedTag('tag2')
    })
    tag[2].addEventListener('click', (ev) => {
        chooseRelatedTag('tag3')
    })
} catch (error) {
    console.log(error.message)
}

