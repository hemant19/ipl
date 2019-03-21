var admin = require("firebase-admin");

var serviceAccount = require("./src/config/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://playipl2019.firebaseio.com"
});

function addMatches() {
  var matches = require('./matches.json');

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
  const title = 'Match Update';
  const body = 'RR 157/3(17)';

  admin.firestore().collection('users').get().then(snapshot => {
    snapshot.docs.map(doc => doc.data()).forEach(user => {
      if (user.notificationToken) {
        console.log('sending to ' + user.name);
        admin.messaging().sendToDevice(user.notificationToken, {
          data: { title, body }
        }).then(() =>
          console.log('Sent to ' + user.name)
        ).catch(err => {
          console.log('Not sent to' + user.name);
          console.error(err);
        })
      }
    })
  })
}

addMatches()