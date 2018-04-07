import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import { config } from './config/firebase';

firebase.initializeApp(config);

const store = firebase.firestore();

export const auth = firebase.auth();

export function getMatches() {
  return store.collection('matches')
    .orderBy('date')
    .get()
    .then(snap => snap.docs)
    .then(docs =>
      docs.map(doc => ({ [doc.id]: doc.data() }))
        .reduce((acc = {}, doc) => {
          return { ...acc, ...doc };
        }))
    .then(matches => {
      return matches;
    });
}

function getVotes() {
  return store.collection('votes')
    .get()
    .then(snap => snap.docs)
    .then(docs => docs
      .map(doc => ({ [doc.id]: doc.data() }))
      .reduce((acc = {}, doc) => {
        return { ...acc, ...doc };
      })
    );
}

export function getMatchesWithVotes(userId) {

  const getSelection = (votes, userId, matchId) => {
    if (!(votes && votes[matchId] && votes[matchId][userId]))
      return null;

    return votes[matchId][userId]["team"];
  }

  return Promise.all([getMatches(), getVotes()])
    .then(([matches, votes]) => {

      return Object.keys(matches)
        .map(matchId => ({
          [matchId]: { ...matches[matchId], selection: getSelection(votes, userId, matchId) }
        }))
        .reduce((acc = {}, doc) => {
          return { ...acc, ...doc };
        });
    })
}

export function vote(matchId, userId, team) {
  if (userId && matchId && team) {
    const votes = store.collection('votes').doc(matchId);
    return votes.set({ [userId]: { team, updatedAt: firebase.firestore.FieldValue.serverTimestamp() } }, { merge: true });
  }
}