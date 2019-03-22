import { firebase } from '@firebase/app';
import '@firebase/messaging';
import { VAPID_KEY } from './config/firebase';
import { saveToken } from './api';

const messaging = firebase.messaging();
messaging.usePublicVapidKey(VAPID_KEY);

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    saveToken(currentToken);
    setTokenSentToServer(true);
  } else {
    console.log(
      "Token already sent to server so won't send it again " +
        'unless it changes'
    );
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}

function setupRefreshToken() {
  firebase.messaging().onTokenRefresh(function() {
    firebase.messaging()
      .getToken()
      .then(function(refreshedToken) {
        console.log('Token refreshed.');
        setTokenSentToServer(false);
        sendTokenToServer(refreshedToken);
      })
      .catch(function(err) {
        console.log('Unable to retrieve refreshed token ', err);
      });
  });
}

function setupToken() {
  firebase.messaging()
    .getToken()
    .then(function(currentToken) {
      if (currentToken) {
        sendTokenToServer(currentToken);
      } else {
        console.log(
          'No Instance ID token available. Request permission to generate one.'
        );
        setTokenSentToServer(false);
      }
    })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      setTokenSentToServer(false);
    });
}

function requestPermission() {
  console.log('Requesting permission...');
  return messaging
    .requestPermission()
    .then(() => {
      setupToken();
      console.log('Notification permission granted.');
    })
    .catch(err => {
      console.log('Unable to get permission to notify.', err);
    });
}

export function init() {
  console.info("Trying to init messaging");
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator && firebase.messaging().isSupported()) {
    console.info("Start init messaging");
    firebase.messaging().usePublicVapidKey(VAPID_KEY);
    setupRefreshToken();
    requestPermission();
    console.info("Finish init messaging");
  }
}