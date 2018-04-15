import React, { Component } from 'react';
import { auth } from './api';
import MatchVotes from './MatchVotes';

import { BrowserRouter, Route } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';

import Header from './Header';
import Home from './Home';
import asyncComponent from './AsyncComponent';

import {
  loginUser,
  logoutUser,
  recieveMatches,
  hideNotification,
  notify
} from './actions';

const AsyncLogin = asyncComponent(() => import('./Login'));

class App extends Component {
  componentDidMount() {
    auth.onAuthStateChanged(this.handleOnLogin);
    this.props.dispatch(recieveMatches());
  }

  componentWillMount() {
    window.onServiceWorkerUpdated(this.notifyServiceWorkerUpdated);
  }

  notifyServiceWorkerUpdated = () => {
    this.props.dispatch(notify('New Version Available', 'reload'));
  };

  handleOnLogin = user => {
    if (user) {
      if (!this.props.user) {
        const { displayName, uid } = user;
        this.props.dispatch(loginUser({ displayName, uid }));
      }
    } else {
      this.props.dispatch(logoutUser());
    }
  };

  snackBarAction = action => {
    if (action === 'reload')
      return (
        <Button
          color="secondary"
          size="small"
          onClick={() => {
            window.location.reload();
          }}
        >
          update
        </Button>
      );

    return null;
  };

  render() {
    const { user, notification } = this.props;
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header
              loggedIn={!!user}
              onLogout={e => {
                auth.signOut().then(() => {
                  this.props.dispatch(logoutUser());
                });
              }}
            />
            <Route path="/(home)?" exact component={Home} />
            <Route path="/login" exact component={AsyncLogin} />
            <Route
              path="/matches/:matchId"
              component={props => <MatchVotes {...props} user={user} />}
            />

            <Snackbar
              anchorOrigin={{
                vertical: notification.vertical,
                horizontal: notification.horizontal
              }}
              open={notification.open}
              onClose={() => this.props.dispatch(hideNotification())}
              message={<span id="message-id">{notification.message}</span>}
              action={this.snackBarAction(notification.action)}
            />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(App);
