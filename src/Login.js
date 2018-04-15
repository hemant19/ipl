import React from 'react';
import { auth } from './api';
import { firebase } from '@firebase/app';
import { withRouter } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

function Login({ history }) {
  const uiConfig = {
    signInFlow: 'redirect',
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
