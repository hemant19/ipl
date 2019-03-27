import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import { config } from './config/firebase';

firebase.initializeApp(config);
let store = firebase.firestore();

export const auth = firebase.auth();

function logEvent(message) {
  if (auth.currentUser) {
    store.collection('events').add({
      message,
      postedBy: auth.currentUser.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

export const postVote = (user, matchId, team) => {
  if (
    auth.currentUser &&
    user.uid &&
    (user.role.player || user.role.admin) &&
    matchId &&
    team
  ) {
    logEvent(`${user.displayName} posted vote on ${matchId} as ${team}`);
    const votes = store.collection('votes').doc(matchId);
    return votes.set(
      {
        [user.uid]: {
          team,
          username: user.name,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedBy: auth.currentUser.displayName
        }
      },
      { merge: true }
    );
  }
};

export function postWinner(id, winner) {
  if (id && winner) {
    logEvent(`${auth.currentUser.displayName} declared winner on match ${id} as ${winner}`);
    return store.collection('matches').doc(id).update({
      winner
    });
  }

  return new Promise((res, rej) => rej());
}

export function fetchMatches() {
  // const yesterday = new Date(Date.now() - 100000000);
  // const dayAfterTomorrow = new Date(Date.now() + 180000000);

  return store
    .collection('matches')
    .orderBy('date')
    .get()
    .then(snap => snap.docs)
    .then(
      docs =>
        docs && docs.length !== 0
          ? docs
            .map(doc => ({[doc.id]: {...doc.data(), isVoting: false, date: doc.data().date.toDate()}}))
            .reduce((acc = {}, doc) => {
              return doc ? { ...acc, ...doc } : acc;
            }, {})
          : {}
    );
}

export const fetchUserVote = (userId, matchId) => {
  return store
    .collection('votes')
    .doc(matchId)
    .get()
    .then(snap => snap.data())
    .then(votes => {
      if (votes && votes[userId]) return votes[userId]['team'];

      return null;
    });
};

export function fetchUserRoles(user) {
  return store
    .collection('users')
    .doc(user.uid)
    .get()
    .then(snap => snap.data());
}

export function postCloseVoting(matchId) {
  logEvent(`${auth.currentUser.displayName} closed match ${matchId}`);
  return store
    .collection('matches')
    .doc(matchId)
    .update({
      votingClosed: true
    });
}

export function getMatch(matchId) {
  return store
    .collection('matches')
    .doc(matchId)
    .get()
    .then(snap => snap.data());
}

export function getVoteDetails(isAdmin, matchId) {
  return getMatch(matchId).then(
    match =>
      match && (match.votingClosed || isAdmin)
        ? store
          .collection('votes')
          .doc(matchId)
          .get()
          .then(snap => {
            const votes = snap.data();
            const team1Players = Object.entries(votes)
              .filter(([userId, vote]) => vote.team === match.team1)
              .map(([userId, vote]) => vote.username);

            const team2Players = Object.entries(votes)
              .filter(([userId, vote]) => vote.team === match.team2)
              .map(([userId, vote]) => vote.username);

            return {
              team1: match.team1 ? match.team1 : "",
              team2: match.team2 ? match.team2 : "",
              team1Players,
              team2Players
            };
          })
        : {
          team1: 'Nice try',
          team2: 'Not Happening bro!',
          team1Players: [],
          team2Players: []
        }
  );
}

export function saveToken(token) {
  if (auth.currentUser) {
    return store
      .collection('users')
      .doc(auth.currentUser.uid)
      .update({
        notificationToken: token
      });
  }

  return new Promise((res, rej) => rej());
}

export function getUsers() {
  const users = [];
  if (auth.currentUser.displayName.includes('emant')) {
    return store.collection('users').onSnapshot(collection => {
      const docs = collection.docs;

      docs.forEach(user => {
        users.push({ uid: user.id, ...user.data() });
      });

      return users;
    });
  }

  return new Promise(res => res(users));
}

export async function fetchUsers() {
  const users = await store.collection("users").get();
  const userJson = {};

  users.forEach(user => {
    userJson[user.id] = user.data();
  })

  return userJson;
}