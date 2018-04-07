import React from 'react';
import { auth } from './service';
import { firebase } from '@firebase/app';
import { withRouter } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Login extends React.Component {
  constructor() {
    super();
    const { history } = this.props;
    this.uiConfig = {
      signInFlow: 'redirect',
      signInSuccessUrl: '/',
      callbacks: {
        signInSuccessUrl: (currentUser, credential, redirectUrl) => {
          history.push('/');
        }
      },
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    };
  }

  render() {
    return (
      <div>
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} />
      </div>
    );
  }
}

export default withRouter(Login);
