import React, { Component } from 'react';
import {
  getMatches,
  getMatchesWithVotes,
  getUserRoles,
  auth,
  setUpMessaging
} from './service';
import MatchVotes from './MatchVotes';

import { BrowserRouter, Route } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';

import Header from './Header';
import Home from './Home';
import Login from './Login';

class App extends Component {
  constructor() {
    super();
    this.state = {
      matches: {},
      user: undefined,
      snackbar: {
        open: false,
        message: ''
      }
    };
  }

  componentDidMount() {
    getMatches().then(matches => {
      this.setState({ matches });
    });

    auth.onAuthStateChanged(this.handleOnLogin);

    setUpMessaging(this.handleError);
  }

  componentWillMount() {
    window.onServiceWorkerUpdated(this.openUpdateBar);
  }

  openUpdateBar = () => {
    this.openSnackBar('New Version Available', 'reload');
  };

  handleOnLogin = user => {
    if (user) {
      if (!this.state.user) {
        this.setState({ user });

        getMatchesWithVotes(user.uid).then(matches => {
          this.setState({ matches });
        });

        getUserRoles(user.uid).then(user => {
          this.setState(prev => ({
            user: {
              ...prev.user,
              ...user
            }
          }));
        });
      }
    } else {
      this.setState({ user: null });
    }
  };

  onMatchListUpdated = list => {
    this.setState(prev => ({ matches: { ...prev.matches, ...list } }));
  };

  handleError = error => {
    this.openSnackBar(error.message);
  };

  closeSnackbar = () => {
    this.setState({
      snackbar: {
        open: false,
        message: '',
        action: null,
        vertical: 'bottom',
        horizontal: 'right'
      }
    });
  };

  openSnackBar = (message, action, vertical = 'bottom') => {
    this.setState({
      snackbar: { open: true, message, action, vertical, horizontal: 'right' }
    });
  };

  snackBarAction = () => {
    if (this.state.snackbar.action === 'reload')
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
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header
              loggedIn={!!this.state.user}
              onLogout={e => {
                auth.signOut().then(() => {
                  window.location.reload();
                });
              }}
            />
            <Route
              path="/(home)?"
              exact
              component={() => (
                <Home
                  matches={this.state.matches}
                  onError={this.handleError}
                  onMatchListUpdated={this.onMatchListUpdated}
                  user={this.state.user}
                />
              )}
            />
            <Route path="/login" exact component={Login} />
            <Route path="/matches/:matchId" component={MatchVotes} />

            <Snackbar
              anchorOrigin={{
                vertical: this.state.snackbar.vertical,
                horizontal: this.state.snackbar.horizontal
              }}
              open={this.state.snackbar.open}
              onClose={this.closeSnackbar}
              message={
                <span id="message-id">{this.state.snackbar.message}</span>
              }
              action={this.snackBarAction()}
            />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
