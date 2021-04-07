// let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});


const {log, table} = console;

const VideoScreen = document.querySelector("#VideoScreen");
const startStopBtn = document.querySelector("#startStopBtn");

let All = {
    VideoScreen,
    stream:null,
    recorder:null,
    isRecordingStarted:false
}

const handlerForStartingRecording =async () =>{
    const screenConfig = {
        video: {
            cursor: "always"
          },
          audio: true
        
    }

    log('Recording is Stared!!');
    All.VideoScreen.srcObject = All.stream = await navigator.mediaDevices.getDisplayMedia(screenConfig);
    All.recorder = new RecordRTCPromisesHandler(All.stream, {
        type: 'video',
      
       
    });
    All.recorder.startRecording();
    All.recorder.screen = All.stream;



}

const handlerForStopingRecording = async () =>{
    log('Recording is Stoped!');
    
    await All.recorder.stopRecording();
    log("Step1");
    
    let blob = await All.recorder.getBlob();
    log(blob);
    // if(!blob==null)
    invokeSaveAsDialog(blob);
    log("Step2")
    All.VideoScreen.srcObject = null;
    All.recorder.screen.stop();


}

// this fuction will run when we `click` on `startStopBtn`

// startStopBtn.disabled = true
const statStopHandler = (ent) =>{
    //if `isRecordingStarted` is `false` then do it `true`, if `true` then do it `false`
    All.isRecordingStarted = !All.isRecordingStarted;

    // it is used  to set text in `startStopBtn` button when Recording is started
    ent.target.className = All.isRecordingStarted?"stop":"record";
    
    // checking if `isRecordingStarted` if yes, then run the Function 
    if(All.isRecordingStarted)
    handlerForStartingRecording()
    else
    handlerForStopingRecording()
    
}

// https://recordrtc.org/index.html
startStopBtn.addEventListener("click",statStopHandler);

