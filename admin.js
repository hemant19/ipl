var admin = require("firebase-admin");

var serviceAccount = require("./src/config/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ipl2018-c70d6.firebaseio.com"
});


function addMatches() {
  var matches = require('./match.json');

  matches.map(match =>
    admin.firestore().collection('matches').add({
      ...match,
      date: new Date(Date.parse(match.date))
    })
  );
}

function addUserRoles() {
  const store = admin.firestore()

  store.collection('users').get()
    .then(snapshot => {
      snapshot.forEach(user => {
        store.collection('users').doc(user.id).update({
          role: { admin: false, player: true }
        })
      })
    })
}

function sendNotification() {
  const fcmID= 'ekmEZmUo2fA:APA91bFRQ-cVYFBsAIFli6lo7P86RYmvTcih8-lhqckXJzWNwUDKzTpKbOXZSL5ANmQ8au_vv6AVPWWyXLDoCQYCnESUmAHVIoz-b_AhA_speq3QdfuQyYUndgxF-dM4elHEQQJ9VKJU';
  return admin.messaging().sendToDevice(fcmID, {data: {title:'Test Notification', body: 'Myank! Pull request!'}})
}

sendNotification();