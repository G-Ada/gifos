var botonX = document.querySelector(".no__activo")

botonX.onclick = () => {
    // botonX.style.background = "red";
    // botonX.classList.remove(["no__activo", "otro"])
    botonX.classList.toggle("activo")
}

var recorder = null;
var recorderVideo = null;

var buttonFrenar = document.getElementById("frenar")
var buttonArrancar = document.getElementById("arranca")
var videoPreview = document.getElementById("videoPreview")
var buttonSubir = document.getElementById("subir")

buttonSubir.onclick = subirVideo;

var blob = null

function subirVideo() {
    /*
        ==file/lk12 l124912049u128941820984
        'archivo' : File
        ==>>1241254125235
    
         ==file/lk12 l124912049u128941820984
        'nombre' : 1boifnsoifbnoifnvoindsionvdsiovnoi1ori124u190248190248102
        ==>>1241254125235


        {
            "nombre" : "nicolas"
        }
    */


    var form = new FormData();


    form.append("file", blob, "file.gif")
    //http://dwfsinstagram.ddns.net/newpost?api_key=GRSMHZDOLNJHHMOKGBM
    fetch("https://upload.giphy.com/v1/gifs?api_key=ZICX05N6fo2m890GDOdXYeiE9MHjUV5e&tags=negro,raro,dfws24", {
        method: "POST",
        body: form
    })

}

buttonFrenar.onclick = function () {
    recorder.stopRecording();
    recorderVideo.stopRecording();


    recorderVideo.getDataURL(url => {
        videoPreview.src = url;
    })

    blob = recorder.getBlob();
    console.log(blob)
    console.log(recorder.getDataURL((url) => {
        document.getElementById("preview").src = url;
    }))
}

function startRecording() {
    recorderVideo.startRecording();
    recorder.startRecording();
}


navigator.mediaDevices.getUserMedia(
    {
        audio: false,
        video: true
    }
).then(function (mediaStream) {
    let video = document.getElementById("video")
    // debugger;
    // console.log(video)


    recorder = RecordRTC(mediaStream, {
        type: 'gif',
        quality: 10,
        width: 360,
        hidden: 240,
        frameRate: 1,
        // onGifRecordingStarted: function () {
        //     console.log('started')
        // },
    });
    recorderVideo = RecordRTC(mediaStream, {
        type: 'audio/webm',
        quality: 10,
        width: 360,
        hidden: 240,
        frameRate: 1,
        // onGifRecordingStarted: function () {
        //     console.log('started')
        // },
    });


    buttonArrancar.removeAttribute("disabled")
    buttonArrancar.onclick = startRecording;



    video.srcObject = mediaStream


    video.play();
    /* usar el flujo de datos */
}).catch(function (err) {
    /* manejar el error */
    console.log(err)
    alert("error")
});