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
  admin.firestore().collection('users').get().then(snapshot => {
    snapshot.docs.map(doc => doc.data()).forEach(user => {
      if (user.notificationToken && user.name && user.name.includes('Hemant')) {
        console.log("Sent token to" + user.name);
        admin.messaging().sendToDevice(user.notificationToken, {
          data: { title: 'Test Notification', body: 'Score notification KXIP - 155/9(19.1)' }
        });
      }
    })
  })
}

sendNotification();