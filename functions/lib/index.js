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
//# sourceMappingURL=index.js.map