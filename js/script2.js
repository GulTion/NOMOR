// UNIVERSAL Variables
 
// const tabHandler = (tabBtnID, tabContainerID) =>{
//     const tabBtnList = document.querySelectorAll(tabBtnID);
//     const tabContainerList = document.querySelectorAll(tabContainerID);

//     // Make all tab Container `display:none`
//     tabContainerList.forEach(ele=>ele.style.display="none")

//     // But By Default first tab must be Visible so `display:flex`
//     tabContainerList[0].style.display = `flex`;

//     tabBtnList.forEach(function(btn, index){
//         btn.addEventListener("click" ,function(){
//             // Make all tab class to unActive
//             tabBtnList.forEach(e=>e.className = "tabsele");
    
//             // make only this className to `tabsele active`
//             this.className = `tabsele active`

//             // Make all tab Container `display:none`
//             tabContainerList.forEach(ele=>ele.style.display="none");

//             // Visibel only the Currnet index of the Tab
//             tabContainerList[index].style.display = `flex`;

    
//         })
//     })
// }
// tabHandler(".tabsele", ".tab");


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(function(reg) {
  
      if(reg.installing) {
        console.log('Service worker installing');
      } else if(reg.waiting) {
        console.log('Service worker installed');
      } else if(reg.active) {
        console.log('Service worker active');
      }
  
    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }


document.body.onload = async ()=>{

    //Loading Remover
    setTimeout(()=>{
        let loading = document.querySelector(".loading");
        loading.style.display="none"
        
    },4000)


    const {log} = console
    const All = {
        _:(ele)=>document.querySelector(ele),
        askPermissionForScreen:function(config){
            return new Promise(async (res, rej)=>{
                this.stream = await navigator.mediaDevices.getDisplayMedia(config);
                res(this)
            })
        },
        askPermissionForCamera:function(config){
            return new Promise(async (res, rej)=>{
                this.stream = await navigator.mediaDevices.getUserMedia(config);
                res(this)
            })
        },
        loadStreamAtVideo:function(video){
            return new Promise((res,rej)=>{
                     video.srcObject = this.stream;
                    res(this)
            })
        },
        startRecordingForScreen:function(config){


            return new Promise(async (res, rej)=>{
                
                if(window.location.pathname=="/camera.html"){
                    await this.askPermissionForCamera(config.stream)
                }else{
                    await this.askPermissionForScreen(config.stream)
                }
                this.recorder =new RecordRTCPromisesHandler(this.stream, config.recorder);
                await this.recorder.startRecording();
                this.loadStreamAtScreenVideoElement();
            })
        },
        stopRecordingForScreen:function(){
            return new Promise(async (res, rej)=>{
                this.unLoadStreamAtScreenVideoElement()
                await this.recorder.stopRecording()
                // this.recorder = null;
                getSeekableBlob(await this.recorder.getBlob(), (seekableBlob)=>{
                    this.blob = seekableBlob
                    this.controls.screenVideoElement.src = URL.createObjectURL(seekableBlob);

                });
                this.stream.stop()

                // await this.loadBlobAtScreenVideoElement();
            })
        },
        loadStreamAtScreenVideoElement:function(){
            this.controls.screenVideoElement.srcObject = this.stream;
        },
        unLoadStreamAtScreenVideoElement:async function(){
            this.controls.screenVideoElement.srcObject = null;
            // await this.stopRecordingForScreen();
        },


        controls:{
            startStopBtn:{
                btnID:"startStopBtn",
                start:"record", // class for Start
                stop:"stop"
            }, // button that uses to stop and play video,
            screenVideoElement:null,
            cameraVideoElement:null,
            downloadScreenVideoBtn:document.querySelector("#videoDownload")

        },
        isPlayed:false,
        blob:null,
        config:{
            recorder:{
                type:"video/mp4",
                checkForInactiveTracks: true
            },
            stream:{
                video:true
            }
        },
        setupControls:function(){
            // stop and start is added
           let btn = document.querySelector(`#${this.controls.startStopBtn.btnID}`)
            const {start, stop} = this.controls.startStopBtn
            btn.addEventListener("click",async (e)=>{
                this.isPlayed = !this.isPlayed;
                if(this.isPlayed){
                    btn.className = stop;
                   await this.startRecordingForScreen(this.config)
    
                }else{  
                    btn.className = start
                    await this.stopRecordingForScreen()
                }
                
            })

            // downlaod btn
            this.controls.downloadScreenVideoBtn.addEventListener("click",async ()=>{
               
                getSeekableBlob(await this.recorder.getBlob(), (seekableBlob)=>{
            
                    invokeSaveAsDialog(seekableBlob)

                });
               
            })

        }
        ,
        
        
        



    
    }

    // await All.startRecordingForScreen(All.config)
    All.controls.screenVideoElement = All._("#VideoScreen")
    // All.controls.startStopBtn = All._("#startStopBtn");
    All.setupControls();
    // await All.startRecordingForScreen(All.config)

    // await All.askPermissionForCamera({video:true})
    // await All.loadStreamAtVideo(document.querySelector("#VideoScreen"))

 
    
    
    
    
    // Tabs Working Function
   

    
}

