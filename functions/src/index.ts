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