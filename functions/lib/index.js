"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.onRegister = functions.auth.user().onCreate(userSnap => {
    const user = userSnap.data;
    console.log(user);
    return admin.firestore().collection('users').doc(user.uid).set({ points: 0 });
});
exports.onVote = functions.firestore.document('votes/{matchId}').onWrite((event) => {
    const document = event.data.exists ? event.data.data() : null;
    const matchId = event.data.id;
    const oldDocument = event.data.previous.data();
    return admin.firestore().collection('matches').doc().get()
        .then(snap => {
        const match = snap.data();
        if (match.date < admin.database.ServerValue.TIMESTAMP) {
            return admin.firestore().collection('votes').doc(matchId).set(oldDocument);
        }
        return new Promise(res => res());
    });
});
//# sourceMappingURL=index.js.map