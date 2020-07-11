const BOTON_LISTO = document.getElementById('listo')
const COPY_URL = document.getElementById('copyURL')
const DOWNLOAD = document.getElementById('download')
var USER_GIF = null

//EVENTOS
BOTON_LISTO.addEventListener('click', () => {
    let cambio = window.location = './index.html'
    return cambio
})
try {
    let button = document.getElementById('repetir')
    button.addEventListener('click', (ev) => {
        location.reload()
    })
} catch (error) {
    console.log(error.message)
}

try {
    let cancelar = document.getElementById("cancelar")
    cancelar.addEventListener('click', (ev) => {
        window.location = './index.html'
    })
    let comenzar = document.getElementById('comenzar')
    comenzar.addEventListener('click', (ev) => {
        let capturar = document.getElementById("capturar")
        let instrucciones = document.getElementById("crearGuifos")
        instrucciones.style.display = 'none';
        capturar.style.display = 'block';
        getStreamAndRecord()
    })
} catch (error) {
    console.log(error.message)
}

//CAMBIOS DE ESTILO AL GRABAR
function changesRecording() {
    let iniciar = document.getElementById("iniciar")
    let grabando = document.getElementById('grabando')
    let encabezado = document.querySelector('.captura .encabezado p')
    iniciar.style.display = 'none'
    grabando.style.display = 'flex'
    encabezado.innerHTML = 'Capturando Tu Guifo'
}
function changeWhenStopped() {
    let grabando = document.getElementById('grabando')
    let previa = document.getElementById('previa')
    let encabezado = document.querySelector('.captura .encabezado p')
    grabando.style.display = 'none'
    previa.style.display = 'flex'
    encabezado.innerHTML = 'Vista Previa'
}

//VISTA PREVIA
function createPreview(videoStream) {
    let video = document.getElementById('video')
    let blobVideo = videoStream.getBlob();
    let videoURL = URL.createObjectURL(blobVideo)
    let src = document.createElement('source')
    src.setAttribute('src', videoURL)
    video.appendChild(src)
}

function playVideo() {
    let playButton = document.getElementById("play_btn");
    playButton.addEventListener("click", function () {
        if (video.paused == true) {
            video.play();
        } else {
            video.pause();
        }
    });
}

function showSubido() {
    try {
        let subiendo = document.getElementById('subiendo')
        let subido = document.getElementById('subido')
        let gifs = localStorage.getItem("mis_gifs")
        let array = JSON.parse(gifs)
        let gif = array[array.length - 1]
        subiendo.style.display = 'none'
        subido.style.display = 'block'
        let gifUser = getLastGif(gif)
        console.log(gifUser)
    } catch (error) {
        console.log(error.message)
    }

}

async function getLastGif(gif) {
    const found = await fetch('https://api.giphy.com/v1/gifs/' + gif + '?' + 'api_key=' + 'oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe')
        .then((response) => {
            return response.json()
        }).then(data => {
            console.log(data)
            showPreview(data)
            COPY_URL.addEventListener('click', () => {
                copyURL(data)
                COPY_URL.innerHTML = 'Copiado'
            })
            DOWNLOAD.addEventListener('click', ()=>{
                invokeSaveAsDialog(USER_GIF)
            })
            return data
        })
        .catch((error) => {
            return error
        })
    return found
}

function showPreview(data) {
    let gif = data.data.images.original.url
    let img = document.querySelector('.chico')
    img.setAttribute('src', gif)
}

function copyURL(data) {
    let url = data.data.url
    var tempInput = document.createElement("input");
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

async function saveGif(form) {
    const found = await fetch("https://upload.giphy.com/v1/gifs?api_key=oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe", {
        method: "POST",
        body: form
    }).then(r => {
        return r.json()
    }).then(obj => {
        try {
            let gifs = localStorage.getItem("mis_gifs")
            let arrayG = [];
            if (gifs != null) {
                arrayG = JSON.parse(gifs)
            }
            arrayG.push(obj.data.id)
            localStorage.setItem("mis_gifs", JSON.stringify(arrayG))
            console.log(arrayG)
            console.log(gifs)
        } catch (error) {
            error.message
        }
    }).then(array => {
        try {
            showSubido()
        } catch (error) {
            console.log(error.message)
        }

    }).catch(err => {
        console.log(err.message)
    })
}

function uploading(blob) {
    let capturar = document.getElementById('capturar')
    let subiendo = document.getElementById('subiendo')
    capturar.style.display = 'none'
    subiendo.style.display = 'block'
    let form = new FormData();
    form.append('file', blob, 'myGif.gif');
    saveGif(form)
}

function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    })
        .then(function (stream) {
            try {
                let video = document.getElementById('video')
                localStream = stream;
                video.srcObject = stream;
                video.play()
                let recorder = RecordRTC(stream, {
                    type: 'gif',
                    frameRate: 1,
                    quality: 10,
                    width: 360,
                    hidden: 240,
                });
                let recorderVideo = RecordRTC(stream, {
                    type: 'video/webm',
                    frameRate: 1,
                    quality: 10,
                    width: 360,
                    hidden: 240,
                });
                let grabar = document.getElementById('grabar')
                grabar.addEventListener('click', (ev) => {
                    recorder.startRecording();
                    recorderVideo.startRecording();
                    changesRecording();
                })
                let detener = document.getElementById('detener')
                detener.addEventListener('click', (ev) => {
                    changeWhenStopped()
                    recorderVideo.stopRecording(function () {
                        createPreview(recorderVideo);
                    })
                    recorder.stopRecording(function () {
                        video.srcObject.stop()
                        video.srcObject = null
                        let subirGuifo = document.getElementById('subir')
                        subirGuifo.addEventListener('click', (ev) => {
                            let blob = recorder.getBlob();
                            uploading(blob);
                        })
                        USER_GIF = recorder.getBlob()
                        console.log(USER_GIF)
                    })
                })
                
            } catch (error) {
                console.log(error)
            }
        })
        .catch((error) => {
            console.log(error)
        })
}


async function getUsersGifs(gif) {
    const found = await fetch('https://api.giphy.com/v1/gifs/' + gif + '?' + 'api_key=' + 'oP1JP6lmt3Np0JUpN6HVIrjsDzK5HDOe')
        .then((response) => {
            return response.json()
        }).then(data => {
            console.log(data)
            placeUserGif(data)
            return data
        })
        .catch((error) => {
            return error
        })
    return found
}

function retrieveUserGif() {
    let gifs = localStorage.getItem("mis_gifs")
    let array = []
    if (gifs != null) {
        array = JSON.parse(gifs)
    }
    for (let i = 0; i < array.length; i++) {
        getUsersGifs(array[i], i)
    }
}

function placeUserGif(data) {
    try {
        let width = parseInt(data.data.images.original.width)
        let container = document.getElementById('gifsU')
        if (width > 500){
            let gifs2 = document.createElement('div')
            gifs2.setAttribute('classs', 'gifGrandeUsuario')
            let gif2 = document.createElement('div')
            gif2.setAttribute('class', 'gifGrandeU')
            let img = document.createElement('img')
            img.setAttribute('class', "gifUimg")
            img.setAttribute('alt', 'gif')
            img.setAttribute('src', data.data.images.original.url)
            gifs2.appendChild(gif2)
            gif2.appendChild(img)
            container.appendChild(gifs2)
        } else {
            let gifs2 = document.createElement('div')
            gifs2.setAttribute('classs', 'gifUsuario')
            let gif2 = document.createElement('div')
            gif2.setAttribute('class', 'gifU')
            let img = document.createElement('img')
            img.setAttribute('class', "gifUimg")
            img.setAttribute('alt', 'gif')
            img.setAttribute('src', data.data.images.original.url)
            gifs2.appendChild(gif2)
            gif2.appendChild(img)
            container.appendChild(gifs2)
        }
    } catch (error) {
        console.log(error.message)
    }

}

playVideo()
retrieveUserGif()
