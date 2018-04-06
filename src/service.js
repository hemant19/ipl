import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { config } from './config/firebase';

firebase.initializeApp(config);
const store = firebase.firestore();

export function getMatches() {
  return store.collection('matches').get()
    .then(snap => snap.docs)
    .then(docs =>
      docs.map(doc => ({ [doc.id]: doc.data() }))
        .reduce((acc, doc) => {
          if (acc) {
            return { ...acc, [doc.id]: doc.data() };
          }

          return { [doc.id]: doc.data() };

        }))
    .then(matches => {
      console.log(matches)
      return matches;
    });
}