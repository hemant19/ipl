var admin = require("firebase-admin");

var serviceAccount = require("/Users/hbhoyar/serviceAccount.json");

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

async function updatePoints(match, users) {
  const data = match.data();
  if (data.winner) {
    console.info(`updating match ${match.id} with winner ${data.winner}`)
    const votes = (await admin.firestore().collection("votes").doc(match.id).get()).data();

    const winners = Object.entries(votes).filter(([id, vote]) => vote.team === data.winner);
    const winnerIds = [];

    const loot = ((15 - winners.length) * 50) / winners.length;

    if (users) {
      winners.forEach(([id, vote]) => {
        if (users[id]) {
          updateUserPoints(id, loot)
          winnerIds.push(id);
        };
      })

      Object.entries(users).forEach(([id, user]) => {
        if (winnerIds.filter(winnerId => id === winnerId).length === 0) {
          updateUserPoints(id, -50);
        }
      });
    }

  }
}

async function updateUserPoints(userId, loot) {
  const userRef = admin.firestore().collection('users').doc(userId);
  return admin.firestore().runTransaction(async transaction => {
    const user = await transaction.get(userRef);
    if (!user.exists) {
      throw "Document does not exist!";
    }
    var points = user.data().points + loot;
    transaction.update(userRef, { points });
  });
}

async function updatePointsForAllMatches() {
  const users = await admin.firestore().collection("users").get();
  const usersJson = {};
  users.forEach(user => usersJson[user.id] = user.data())
  const matches = ["pum3LTtJRRwByvYxQ7nr", "jN8n3qKkQ1ubyAWfAyrJ", "IzolEPP3kBe5W91iOV20", "MNt4bVPUmFabm0wQRIY4", "mjafji3JAP15Ask7Fb7d", "AuFgJAI8YjFGRVylVZ7m", "MBxGkd6ZpUDt5SwhBtZz"];

  for(let i=0; i < matches.length;i++) {
    const match = await admin.firestore().collection("matches").doc(matches[i]).get()
    await updatePoints(match, usersJson)
  }

}

async function resetPoints() {
  const users = await admin.firestore().collection("users").get();

  users.forEach(user => {
    user.ref.update({ points: 0 })
  })
}

async function ramsVotes() {
  const votes = await admin.firestore().collection("votes").get();
  votes.forEach(matchVote => {
  })
}


// resetPoints();
updatePointsForAllMatches();
// ramsVotes();
