import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

exports.onRegister = functions.auth.user().onCreate(user => {
    console.log(user)
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

exports.onVoteUpdate = functions.firestore.document("votes/{matchId}").onUpdate((change, context) => {
    const matchId = context.params.matchId;
    console.info(`Checking ${matchId} is closed`);
    return admin.firestore().collection("matches").doc(matchId).get().then(matchSnap => {
        return matchSnap.data();
    }).then(match => {
        if (match.votingClosed) {
            console.error(`${matchId} was tampered. Before votes => ${JSON.stringify(change.before.data())}. After votes => ${JSON.stringify(change.after.data())}`);
        } else {
            console.info(`Vote on ${matchId} with ${JSON.stringify(context)}`);
        }

        return Promise.resolve();
    }).catch(e => console.error(e))
})