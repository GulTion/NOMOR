self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        // return cache.addAll([
        //   'camera.html',
        //   'index.html',
        //   'css/style.css',
        //   'ico/mic.svg'  ,
        //   'ico/moniter.svg'  ,
        //   'ico/pause.svg'  ,
        //   'ico/play.svg',
        //   "ico/record.svg",
        //   "ico/stop.svg" ,
        //   "ico/videoDownload.svg " ,
        //   "ico/webcam.svg",
        //   'image/bg1.jpg',
        //   'js/EBML.js',
        //   'js/RecordRTC.js',
        //   'js/script2.js'
        // ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
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