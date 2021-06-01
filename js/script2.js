




// log को derefference किया , जिससे की हर बार console पर प्रिंट करने के लिए `console.log` न लिखना पड़े
const {log} = console;

// सारी चीजे load जब होंगी, जब body अच्छे से load हो जाये 
// यहा पर async javascirpt उसे कि क्या function मे । क्योकि हमे कुछ चीज़ों के लिए इंतजार करना पड़ सकता है , उसके लिए फिर हम await शब्द का इस्तेमाल करेंगे किसी भी promise based object को इंतेजर करवाने के लिए जब तक काम पूरा ना हो जाए 
document.body.onload = async ()=>{

    // `setTimeout` का इस्तेमाल किया जिससे की 4 sec बाद, एक function कॉल कर पाये जो की `LOADING` वाले element को गायब कर सके
    setTimeout(()=>{
        // `LOADING` वाले element की class का नाम `loading` है। जोकि यहा `loading` variable मे स्टोर किए है।
        let loading = document.querySelector(".loading");

        // फिर अब loading की display `none` करदो , जिससे की बो पूरी तरह से गायब हो जाये
        loading.style.display="none"
        
        // यहा पर time milli सेकोण्ड्स 
    },4000)

    // All एक main object है । सारे काम इसी के जरिये किए जाएंगे
    const All = {
        
        // यहा function बस उस element को देगा जिसकी `id` ओर `className` , `ele` मे  भेजी की जाएगी
        _:(ele)=>document.querySelector(ele),


        //इस function का काम है की user से permission लो की क्या हम आपकी स्क्रीन रेकॉर्ड केआर सकते है 
        // अगर user ने permission देदी कि हा अब तुम मेरी स्क्रीन को रेकॉर्ड केआर सकते हो
        // अगर user ने allow कर दिया तो जो भी स्क्रीन का डाटा flow हो होगा हम उसको stream नाम कि property से लिंक कर देंगे
        // अगर user मना करता तो सिम्पल stream कि वैल्यू null होगी

        // यहा function एक promise रिटर्न करता है कि यह इंतजार करता है कि कब user से पर्मिशन मिलेगी। 
        // यहा function कुछ `config` डिटेल्स लेता है । जेसे कि किस किस कि permission लेनी है। यहा पर हम बस `video` कि पर्मिशन ले रहे है
        
        // यह same चीज़ `askPermissionForCamera` वाले function मे भी है, जिसमे हमे Camera कि permission मगेगा  
        askPermissionForScreen:function(config){

            return new Promise(async (res, rej)=>{
                // `await` बोलता हा कि जब तक permission न मिल जाए तब तक इंतजार करते रहो
                this.stream = await navigator.mediaDevices.getDisplayMedia(config);
                res(this)
            })
        },

        // सारी चीजे बिलकुल `askPermissionForScreen` के जेसी है
        askPermissionForCamera:function(config){
            return new Promise(async (res, rej)=>{
                this.stream = await navigator.mediaDevices.getUserMedia(config);
                res(this)
            })
        },

        // इस function का काम है कि ये जो भी डाटा मिलेगा स्क्रीन से मतलब `stream`
        // उस `stream` को video element के source मे डाल दो
        // इससे यहा होगा कि जब रिकॉर्डिंग चालू होगी तब जो भी डाटा होगा हम उसको मतलब जो भी स्क्रीन पर चल रहा होगा हम उसको उस video एलिमंट मे देख सकते है , 
        // video element ,हम ही देंगे कि किस विडियो element मे show करना है कि क्या चीज़ रेकॉर्ड हो रही है 
        loadStreamAtVideo:function(video){
            return new Promise((res,rej)=>{
                // यहा पर बस हमने stream को विडियो element के scrObject मे डाल दिया है
                     video.srcObject = this.stream;
                    res(this)
            })
        },

        // इस function का काम बस विडियो रिकॉर्डिंग चालू कर देना है, ओर उससे पहले यह permission मागेगा । 
        startRecordingForScreen:function(config){
            return new Promise(async (res, rej)=>{
                
               // हम देखेंगे कि अगर हम कमेरा वाले page मे है तो camera कि permission मागो , वरना स्क्रीन की
                if(window.location.pathname=="/camera.html"){
                    // यहाँ permission मागने वाले function को पुकारा जा रहा है 
                    // यह camera की पर्मिशन है 
                    await this.askPermissionForCamera(config.stream)
                }else{
                	// यहा screen की पर्मिशन है
                    await this.askPermissionForScreen(config.stream)
                }

                
                // यहाँ पर हमने RecordRTC handler को बनाया है जिसका काम है की जो भी stream इसको देंगे ये उसको memory स्टोर कर लेगा
                // ओर इस handler को recorder से लिंक कर दिया है
                this.recorder =new RecordRTCPromisesHandler(this.stream, config.recorder);

                //यहा हम startRecording method को कॉल करेंगे ओर यहा stream को मेमोरी मे save करना चालू कर देगा
                await this.recorder.startRecording();

                // हम ये वाला method कॉल कर रहे है , जिससे की जो भी stream मे चल रहा हो बो सब hm विडियो element मे देख सके
                this.loadStreamAtScreenVideoElement();
            })
        },

        // इस function का काम है recording को स्टॉप करने का । 
        stopRecordingForScreen:function(){

            // returns a promise
            return new Promise(async (res, rej)=>{

                // रिकॉर्डिंग स्टॉप करने से पहले जो भी स्ट्रीम, video element पर होगी उसको unload कर दो।
                this.unLoadStreamAtScreenVideoElement()

                // रिकॉर्डिंग स्टॉप होने का इंतजार करो
                await this.recorder.stopRecording()
               
            	// जो भी recorded डाटा होगा मेमोरी मे उसको seekable blob मे बदल लो । जो की `getSeekableBlob` फंकशन द्वारा किया जाएगा, जो की RecordRTC का global function है
                // blob एक तरह से file होती है , जो की object की form मे memory मे स्टोर होती है।
                // seekable blob का ये मतलब है की जो भी video produce होगी blob से हम उसको आगे पीछे करके देख सकते है 
                getSeekableBlob(await this.recorder.getBlob(), (seekableBlob)=>{

                    // जब seekableblob मिल जाए तो उसको `blob` property से लिंक कर दो
                    this.blob = seekableBlob

                    // ओर उसी seekableBlob को विडियो element मे डाल दो जिससे की हम उस recorded विडियो को देख सके बिना download करे 
                    this.controls.screenVideoElement.src = URL.createObjectURL(seekableBlob);

                });

                // flow हो रही stream का भी बंद कर दो
                this.stream.stop()

            })
        },

        // इस function का काम, जो भी स्ट्रीम flow हो रही होगी उसको विडियो एलिमंट मे fill कर दो
        loadStreamAtScreenVideoElement:function(){
            this.controls.screenVideoElement.srcObject = this.stream;
        },

        // जब stream को बंद करने पर विडियो एलिमंट के src को भी null करने का काम इस फंकशन का है
        unLoadStreamAtScreenVideoElement:async function(){
            this.controls.screenVideoElement.srcObject = null;
        },


        // यहा पर control के सारे बटन की class और ID दी गयी है
        controls:{
            startStopBtn:{
                btnID:"startStopBtn",
                start:"record", // class for Start
                stop:"stop"
            },

            // शुरुआत मे property को null किया है
            screenVideoElement:null,

            // शुरुआत मे property को null किया है
            cameraVideoElement:null,

            // ये property , DOM से एक बटन को स्टोर करेगा जिसका काम बस video को download करना है जब कोई इस पर क्लिक करेगा 
            downloadScreenVideoBtn:document.querySelector("#videoDownload")

        },

        // ये बताएगा की क्या अभी विडियो प्ले है या नही
        isPlayed:false,

        // ये Blob को स्टोर करने का काम करेगा। मतलब ये बाएगा की Blob कहा है memory मे जिससे की हम उसका इस्तेमाल कर पाये
        blob:null,

        // ये recorder की configuration 
        config:{
            recorder:{
                type:"video/mp4",
                checkForInactiveTracks: true
            },

            // ये permission के टाइम मागे जाने वाली information 
            stream:{
                video:true
            }
        },

        // इस function का काम , controls को setup करना 
        setupControls:function(){
           
			// start stop button को `btn` variable मे स्टोर किया है
           let btn = this._(`#${this.controls.startStopBtn.btnID}`)

            const {start, stop} = this.controls.startStopBtn

			// `btn` मे एक event add किया है की जब हम इस बटन को click करेंगे तो एक function होगा
            btn.addEventListener("click",async (e)=>{
            // एक simple सा logic, जो की बटन को क्लिक करने पर recording को start ओर stop करवाना
                this.isPlayed = !this.isPlayed;
                if(this.isPlayed){
                    btn.className = stop;
                   await this.startRecordingForScreen(this.config)
    
                }else{  
                    btn.className = start
                    await this.stopRecordingForScreen()
                }
                
            })

            // download वाले बटन मे event add किया , जिससे की जब हमे recorded file चाहिए तो बस इस बटन को क्लिक करना है ओर फ़ाइल download  हो जाएगी
            this.controls.downloadScreenVideoBtn.addEventListener("click",async ()=>{
               
                getSeekableBlob(await this.recorder.getBlob(), (seekableBlob)=>{
            
                    invokeSaveAsDialog(seekableBlob)

                });
               
            })

        }
    }


    All.controls.screenVideoElement = All._("#VideoScreen")
    All.setupControls();
 
}



//[ START ][ Code For Service Workers FIle attachement ]

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(function(reg) {
        return;
  }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }

//   [ END ]

