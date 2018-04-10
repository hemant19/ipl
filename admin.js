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
  const fcmID= 'ddxy8IA2EFg:APA91bH2gBrEQVaIBqu4gQ41Sjigwn9-D2JPN-B-ZXrVBETFQ4hHO6JWr9jyzh7WPEZ8ZrPzakBLkG7Kp9pFQMqt6bj7YnImMYo-ti9zt3zWF3EJ-e3Wbw6PPr32jnem84Bh9hwSMgz-';
  return admin.messaging().sendToDevice(fcmID, {data: {title:'Test', body: 'Wow it worked!'}})
}

sendNotification();