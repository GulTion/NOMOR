if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
        reg.update()
        return;
  }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }