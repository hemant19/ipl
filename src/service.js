import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/messaging';
import { config } from './config/firebase';

firebase.initializeApp(config);
let store = firebase.firestore();

firebase
  .firestore()
  .enablePersistence()
  .then(_ => {
    store = firebase.firestore();
  });

export const auth = firebase.auth();
export const messaging = firebase.messaging();

export function getMatches() {
  return store
    .collection('matches')
    .orderBy('date')
    .get()
    .then(snap => snap.docs)
    .then(docs =>
      docs.map(doc => ({ [doc.id]: doc.data() })).reduce((acc = {}, doc) => {
        return { ...acc, ...doc };
      })
    )
    .then(matches => {
      // console.log(matches)
      return matches;
    });
}

function getVotes() {
  return store
    .collection('votes')
    .get()
    .then(snap => snap.docs)
    .then(docs =>
      docs.map(doc => ({ [doc.id]: doc.data() })).reduce((acc = {}, doc) => {
        return { ...acc, ...doc };
      })
    );
}

export function getMatchesWithVotes(userId) {
  const getSelection = (votes, userId, matchId) => {
    if (!(votes && votes[matchId] && votes[matchId][userId])) return null;

    return votes[matchId][userId]['team'];
  };

  return Promise.all([getMatches(), getVotes()])
    .then(([matches, votes]) => {
      return Object.keys(matches)
        .map(matchId => ({
          [matchId]: {
            ...matches[matchId],
            selection: getSelection(votes, userId, matchId)
          }
        }))
        .reduce((acc = {}, doc) => {
          return { ...acc, ...doc };
        });
    })
    .then(matches => {
      // console.log(matches)
      return matches;
    });
}

export function getUserRoles(userId) {
  return store
    .collection('users')
    .doc(userId)
    .get()
    .then(snap => snap.data());
}

export function vote(user, matchId, team) {
  if (user.uid && user.role.player && matchId && team) {
    const votes = store.collection('votes').doc(matchId);
    return votes.set(
      {
        [user.uid]: {
          team,
          username: user.displayName,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      },
      { merge: true }
    );
  }
}

export function closeVoting(user, matchId) {
  if (user.role.admin) {
    return store
      .collection('matches')
      .doc(matchId)
      .update({
        votingClosed: true
      });
  }

  return new Promise((res, rej) => rej());
}

export function getMatch(matchId) {
  return store
    .collection('matches')
    .doc(matchId)
    .get()
    .then(snap => snap.data());
}

export function getVoteDetails(matchId) {
  return getMatch(matchId).then(
    match =>
      match && match.votingClosed
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
                team1: match.team1,
                team2: match.team2,
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

export function setUpMessaging(handleError) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    console.log('Setting up messaging');
    messaging
      .requestPermission()
      .then(data => {
        return messaging.getToken();
      })
      .catch(err => {
        handleError({
          message: "You won't be able to see the notifications!"
        });
      })
      .then(currentToken => {
        return saveToken(currentToken);
      });
  }
}

export function saveToken(currentToken) {
  console.log('TODO: // save token => ' + currentToken);
}
