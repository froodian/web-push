if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(function(registration) {
    console.log('service worker registered');
  });
}

navigator.serviceWorker.ready.then(function(reg) {
  var channel = new MessageChannel();
  channel.port1.onmessage = function(e) {
    window.document.title = e.data;
  }
  reg.active.postMessage('setup', [channel.port2]);

  return reg.pushManager.getSubscription().then(function(subscription) {
    if (!subscription) {
      return reg.pushManager.subscribe({ userVisibleOnly: true }).then(function(subscription) {
        return subscription;
      });
    } else {
      return subscription;
    }
  });
}).then(function(subscription) {
  var key = subscription.getKey ? subscription.getKey('p256dh') : '';

  return fetch('https://127.0.0.1:50005', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
    }),
  });
});
