var admin = require("firebase-admin");

var serviceAccount = require("/Users/hbhoyar/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://playipl2019.firebaseio.com"
});

function addMatches() {
  var matches = require('./remainingMatches.json');

  matches.map(match =>
    admin.firestore().collection('matches').add({
      ...match,
      date: new Date(match.date)
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


async function changeMatchPoints(match, users) {
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
          updateUserPoints(id, -loot)
          winnerIds.push(id);
        };
      })

      Object.entries(users).forEach(([id, user]) => {
        if (winnerIds.filter(winnerId => id === winnerId).length === 0) {
          updateUserPoints(id, 50);
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

async function updatePointsForAllMatches(matches) {
  const users = await admin.firestore().collection("users").get();
  const usersJson = {};
  users.forEach(user => usersJson[user.id] = user.data())

  for (let i = 0; i < matches.length; i++) {
    const match = await admin.firestore().collection("matches").doc(matches[i]).get()
    await updatePoints(match, usersJson)
  }

}

async function changeResultForMumbaiMatch(matches) {
  const users = await admin.firestore().collection("users").get();
  const usersJson = {};
  users.forEach(user => usersJson[user.id] = user.data())

  for (let i = 0; i < matches.length; i++) {
    const match = await admin.firestore().collection("matches").doc(matches[i]).get()
    await changeMatchPoints(match, usersJson)
  }

}

async function resetPoints() {
  const users = await admin.firestore().collection("users").get();

  users.forEach(user => {
    user.ref.update({ points: 0 })
  })
}

async function deleteIncorrectMatches() {
  const maxDate = new Date(Date.now() + 180000000);

  const matches = await admin.firestore().collection("matches")
    .where("date", ">=",maxDate)
    .get();

    matches.forEach(doc => doc.ref.delete())
}

async function events() {
  const eventsDocs = await admin.firestore().collection("events").get();
  const events = [];

  eventsDocs.forEach(e => {
    events.push(e.data());
  })

  events.sort((e1, e2) => e2.timestamp - e1.timestamp)

  events.filter(e => e.message.includes("4yleDa4Cy1uGvI58EXWu")).forEach(e => console.log(e));
}

// resetPoints();
const matches = ["4yleDa4Cy1uGvI58EXWu"];

updatePointsForAllMatches(matches);
// ramsVotes();


// changeResultForMumbaiMatch(matches);
// events()

// deleteIncorrectMatches()