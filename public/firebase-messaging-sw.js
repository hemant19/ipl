importScripts('https://www.gstatic.com/firebasejs/4.12.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.12.0/firebase-messaging.js')
importScripts('/__/firebase/init.js')

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  var title = payload.data.title;
  var options = {
    body: payload.data.body,
    icon: './android-icon-192x192.png'
  };
  return self.registration.showNotification(title, options);
});