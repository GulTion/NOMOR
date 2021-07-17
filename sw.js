// this file Contains the Code for Offline Caching

self.addEventListener('install', function(event) {
 
    event.waitUntil(
      caches.open("v1").then(function(cache){
        return cache.addAll([
          'camera.html',
          'index.html',
          'css/style.css',
          'ico/mic.svg'  ,
          'ico/moniter.svg'  ,
          'ico/pause.svg'  ,
          'ico/play.svg',
          "ico/record.svg",
          "ico/stop.svg" ,
          "ico/videoDownload.svg " ,
          "ico/webcam.svg",
          'image/bg1.jpg',
          'js/EBML.js',
          'js/RecordRTC.js',
          'js/script2.js',
          "about.html"
        ]);
      })
    );
  });

  self.addEventListener('activate', function(event) {
  
  });


  
  self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          
          let responseClone = response.clone();
          
          caches.open('v1').then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          return caches.match(event.request);
        });
      }
    }));
  });