"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.onRegister = functions.auth.user().onCreate(user => {
    console.log(user);
    return admin.firestore().collection('users').doc(user.uid).set({
        name: user.displayName,
        points: 0,
        role: {
            admin: false,
            player: true,
            spectator: true
        }
    });
});
exports.onVoteUpdate = functions.firestore.document("votes/{matchId}/{userId}").onUpdate((change, context) => {
    const matchId = context.params.matchId;
    console.info(`Checking ${matchId} is closed for user ${context.params.userId}`);
    return admin.firestore().collection("matches").doc(matchId).get().then(matchSnap => {
        return matchSnap.data();
    }).then(match => {
        if (match.votingClosed) {
            const after = change.after.data();
            console.log(JSON.stringify(after));
        }
        else {
            console.info(`Vote on ${matchId} with ${JSON.stringify(context)}`);
        }
        return Promise.resolve();
    }).catch(e => console.error(e));
});
//# sourceMappingURL=index.js.map