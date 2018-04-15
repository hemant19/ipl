import React from 'react';
import { auth } from './api';
import { firebase } from '@firebase/app';
import { withRouter } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

function getSignInFlow() {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'popup';
  }
  return 'redirect';
}

function Login({ history }) {
  const uiConfig = {
    signInFlow: getSignInFlow(),
    signInSuccessUrl: '/',
    callbacks: {
      signInSuccess: (currentUser, credential, redirectUrl) => {
        history.push('/');
        return false;
      }
    },
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
  };
  return (
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
}

export default withRouter(Login);
