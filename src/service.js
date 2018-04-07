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
      // console.log(matches)
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
    }).then(matches => {
      // console.log(matches)
      return matches;
    })
}

export function vote(matchId, userId, username, team) {
  if (userId && matchId && team) {
    const votes = store.collection('votes').doc(matchId);
    return votes.set({ [userId]: { team, username, updatedAt: firebase.firestore.FieldValue.serverTimestamp() } }, { merge: true });
  }
}

export function getMatch(matchId) {
  return store.collection('matches').doc(matchId).get()
    .then(snap => snap.data());
}

export function getVoteDetails(matchId) {
  return getMatch(matchId).then(
    match => {
      store.collection('votes').doc(matchId).get()
        .then(snap => {
          const votes = snap.data();

          const team1Players = Object.entries(votes).filter(([userId, vote]) => (vote.team1 === match.team1)).map(([userId, vote]) => vote.username);
          const team2Players = Object.entries(votes).filter(([userId, vote]) => (vote.team1 === match.team2)).map(([userId, vote]) => vote.username);

          return {
            team1: match.team1,
            team2: match.team2,
            team1Players, team2Players
          }

        })
    }
  )

}