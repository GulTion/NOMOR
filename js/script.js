// let stream = await navigator.mediaDevices.getUserMedia({video: true, audio:
// true});



const {log, table} = console;
const $ = (ele)=> document.querySelector(ele);
const VideoScreen = document.querySelector("#VideoScreen");
const startStopBtn = document.querySelector("#startStopBtn");
// const pausePlayBtn = document.querySelector("#pausePlayBtn");
const timer = document.querySelector("#timer");
const videoDownloadBtn = document.querySelector("#videoDownload");

// const img2dataurl = (img) => {
//     const cs = document.createElement('canvas');
//     const ctx = cs.getContext('2d');
//     cs.width = img.width
//     cs.height = img.height;
//     ctx.drawImage(img, 0,0,img.width, img.height);
//     log(cs.toDataURL('image/jpg'))

//     return cs.toDataURL('image/jpg');

// }

let All = {
    VideoScreen,
    stream: null,
    recorder: null,
    isRecordingStarted: false,
    blob: null,
    isPlayed: false,
    timer:timer,
    
}



const ScreenTab = document.querySelector("#ScreenTab")
const CameraTab = document.querySelector("#CameraTab")
const SoundTab = document.querySelector("#SoundTab")



const allTab = document.querySelectorAll('.tab');
allTab.forEach(e=>{e.style.display='none'});
const allTabs = document.querySelectorAll('.tabsele');
allTabs.forEach((e,i)=>{
    e.onclick = function(){
        allTab.forEach(e=>{e.style.display='none'});
        allTab[i].style.display = 'flex';
        allTabs.forEach(k=>k.className = 'tabsele unactive');
        allTabs[i].className = 'tabsele active'
    }
})
allTab[0].style.display = 'flex'




setTimeout(()=>{
    const loading = $(".loading");
    loading.style.display = "none"
},5000)

const runThisFirst = () =>{
    if(All.blob==null&&All.recorder==null){
        videoDownloadBtn.style.display = "none"
    }else{
        videoDownloadBtn.style.display = "block"
    }
}

// log(localStorage.getItem("bg1"))

runThisFirst()

function formatBytes(a, b = 2) {
    if (0 === a) 
        return "0 Bytes";
    const c = 0 > b
            ? 0
            : b,
        d = Math.floor(Math.log(a) / Math.log(1024));
    return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB",
        "PB",
        "EB",
        "ZB",
        "YB"
    ][d]
}

function calculateTimeDuration(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    if (hr <= 0) {
        return min + ':' + sec;
    }

    return hr + ':' + min + ':' + sec;
}

const handlerForStartingRecording = async() => {
    // runThisFirst();
    const screenConfig = {
        video: {
            cursor: "always"
        },
        audio: true

    }

    log('Recording is Stared!!');
    All.VideoScreen.srcObject = All.stream = await navigator.mediaDevices.getDisplayMedia(screenConfig);
    All.recorder = new RecordRTCPromisesHandler(All.stream, {type: 'video/mp4'});
    All.recorder.startRecording();
    All.recorder.screen = All.stream;

    dateStarted = new Date().getTime();
    (function looper() {
        if (!All.recorder&&!All.isPlayed) {
            return;
        }

        document.title = timer.innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 1000);
        
        setTimeout(looper, 1000);
    })();

}

const handlerForStopingRecording = async() => {
    log('Recording is Stoped!');

    await All.recorder.stopRecording();
    log("Step1");

    All.blob = await All.recorder.getBlob();

    log("Step2")
    All.VideoScreen.srcObject = null;
    All.recorder.screen.stop();
    All.recorder = null;
    
    All.VideoScreen.controls = true;
    document.title = "NOMOR";
    All.timer.innerHTML = bytesToSize(All.blob.size);
    getSeekableBlob(All.blob, (blob)=>{
        All.blob = blob;
        All.VideoScreen.src = URL.createObjectURL(blob)
    });
}

// const handlerForPlayAndPause = (e) => {
//     if(All.isRecordingStarted){
//         if(All.isPlayed)
//         All.recorder.pauseRecording().then(()=>{
//             All.isPlayed = false;

//         })
//         else{
//             All.recorder.resumeRecording().then(()=>{
//                 All.isPlayed = true;
    
//             }) 
//         }
//     }

//     pausePlayBtn.className = All.isPlayed?"play":"pause";

// }

const videoDownloader = ()=>{
    if(All.blob!==null){
        getSeekableBlob(All.blob, (blob)=>{
            
            invokeSaveAsDialog(blob)
        });
    };

}

// this fuction will run when we `click` on `startStopBtn` startStopBtn.disabled
// = true


const statStopHandler = (ent) => {
    runThisFirst();
    // if `isRecordingStarted` is `false` then do it `true`, if `true` then do it
    // `false`
    All.isRecordingStarted = !All.isRecordingStarted;

    // it is used  to set text in `startStopBtn` button when Recording is started
    ent.target.className = All.isRecordingStarted
        ? "stop"
        : "record";

    // checking if `isRecordingStarted` if yes, then run the Function
    if (All.isRecordingStarted) 
        handlerForStartingRecording()
    else 
        handlerForStopingRecording()

}

// https://recordrtc.org/index.html
startStopBtn.addEventListener("click", statStopHandler);
videoDownload.addEventListener("click", videoDownloader);

// pausePlayBtn.addEventListener("click", (e) => handlerForPlayAndPause(e));
