import React from 'react';
import { auth } from './service';
import { firebase } from '@firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default class Login extends React.Component{

  constructor() {
    super();

    this.uiConfig = {
      signInFlow: 'redirect',
      callbacks: {
        signInSuccess: (user) => { }
      },
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ]
    };
  }

  render() {
    return (
      <div>
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} />
      </div>
    )
  }
}