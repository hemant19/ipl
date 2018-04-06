var admin = require("firebase-admin");

var serviceAccount = require("./src/config/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ipl2018-c70d6.firebaseio.com"
});

var matches = require('./match.json'); 

matches.map(match => 
admin.firestore().collection('matches').add(match))