// let stream = await navigator.mediaDevices.getUserMedia({video: true, audio:
// true});

const {log, table} = console;

const VideoScreen = document.querySelector("#VideoScreen");
const startStopBtn = document.querySelector("#startStopBtn");
const pausePlayBtn = document.querySelector("#pausePlayBtn");
const timer = document.querySelector("#timer");

let All = {
    VideoScreen,
    stream: null,
    recorder: null,
    isRecordingStarted: false,
    blob: null,
    isPlayed: false

}

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
    const screenConfig = {
        video: {
            cursor: "always"
        },
        audio: true

    }

    log('Recording is Stared!!');
    All.VideoScreen.srcObject = All.stream = await navigator
        .mediaDevices
        .getDisplayMedia(screenConfig);
    All.recorder = new RecordRTCPromisesHandler(All.stream, {type: 'video'});
    All
        .recorder
        .startRecording();
    All.recorder.screen = All.stream;

    dateStarted = new Date().getTime();
    (function looper() {
        if (!All.recorder) {
            return;
        }

        timer.innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 1000);

        setTimeout(looper, 1000);
    })();

}

const handlerForStopingRecording = async() => {
    log('Recording is Stoped!');

    await All
        .recorder
        .stopRecording();
    log("Step1");

    All.blob = await All
        .recorder
        .getBlob();

    log("Step2")
    All.VideoScreen.srcObject = null;
    All
        .recorder
        .screen
        .stop();
    All.recorder = null;
}

const handlerForPlayAndPause = (e) => {
    log(All.blob)
    e.target.className = All.isPlayed
        ? "play"
        : "pause";

    if (All.isPlayed) {
        All.VideoScreen.src = All.VideoScreen.srcObject = null;
        All.VideoScreen.controls = false

    } else {
        All.VideoScreen.src = URL.createObjectURL(All.blob);
        All.VideoScreen.controls = true;

    }
    timer.innerHTML = formatBytes(All.blob.size);
    All.isPlayed = !All.isPlayed;

}

// this fuction will run when we `click` on `startStopBtn` startStopBtn.disabled
// = true
const statStopHandler = (ent) => {
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

pausePlayBtn.addEventListener("click", (e) => handlerForPlayAndPause(e));