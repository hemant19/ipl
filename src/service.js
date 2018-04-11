import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/messaging';
import { config, VAPID_KEY } from './config/firebase';

firebase.initializeApp(config);
let store = firebase.firestore();

firebase
  .firestore()
  .enablePersistence()
  .then(_ => {
    store = firebase.firestore();
  });

export const auth = firebase.auth();
const messaging = firebase.messaging();
messaging.usePublicVapidKey(VAPID_KEY);

export function getMatches() {
  const yesterday = new Date(Date.now() - 100000000);
  const dayAftertomorrow = new Date(Date.now() + 180000000);

  return store
    .collection('matches')
    .where('date', '<', dayAftertomorrow)
    .where('date', '>', yesterday)
    .orderBy('date')
    .get()
    .then(snap => snap.docs)
    .then(
      docs =>
        docs && docs.length !== 0
          ? docs
              .map(doc => ({ [doc.id]: { ...doc.data(), isVoting: false } }))
              .reduce((acc = {}, doc) => {
                return doc ? { ...acc, ...doc } : acc;
              })
          : {}
    );
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

  return new Promise((res, rej) => rej());
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

function updateUIForPushPermissionRequired(showMessage) {
  return showMessage({
    message: "You won't be able to see the notifications!"
  });
}

function updateUIForPushEnabled(showMessage) {
  return showMessage({
    message: 'Push Notifications Enabled'
  });
}

export function setUpMessaging(user, showMessage, votingClose) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    if (!user.notificationToken) {
      messaging.requestPermission().then(() => {
        messaging
          .getToken()
          .then(currentToken => {
            if (currentToken) {
              saveToken(user, currentToken);
              updateUIForPushEnabled(showMessage);
            } else {
              console.log(
                'No Instance ID token available. Request permission to generate one.'
              );
              updateUIForPushPermissionRequired(showMessage);
            }
          })
          .catch(function(err) {
            console.error('An error occurred while retrieving token. ', err);
          });
      });
    }

    messaging.onTokenRefresh(function() {
      messaging
        .getToken()
        .then(function(refreshedToken) {
          console.log('Token refreshed.');
          saveToken(user, refreshedToken);
        })
        .catch(function(err) {
          console.error('Unable to retrieve refreshed token ', err);
        });
    });

    messaging.onMessage(payload => {
      if (payload && payload.type) {
        if (payload.type === 'VOTING_CLOSE') {
          if (votingClose) votingClose(payload.matchId);
        } else {
          showMessage({
            message: payload.data.body
          });
        }
      }
    });
  }
}

export function saveToken(user, currentToken) {
  return store
    .collection('users')
    .doc(user.uid)
    .update({ notificationToken: currentToken });
}
