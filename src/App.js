import React, { Component } from 'react';
import { getMatches, getMatchesWithVotes, auth } from './service';
import MatchVotes from './MatchVotes';

import { BrowserRouter, Route } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';

import Header from './Header';
import Home from './Home';
import Login from './Login';

class App extends Component {
  constructor() {
    super();
    this.state = {
      matches: {},
      user: undefined,
      snackbarOpen: false,
      snackbarMessage: ''
    };
  }

  componentDidMount() {
    getMatches().then(matches => {
      this.setState({ matches });
    });

    auth.onAuthStateChanged(this.handleOnLogin);
  }

  handleOnLogin = user => {
    if (user) {
      if (!this.state.user) {
        getMatchesWithVotes(user.uid).then(matches => {
          this.setState({ matches });
        });
        this.setState({ user });
      }
    } else {
      this.setState({ user: null });
    }
  };

  onMatchListUpdated = list => {
    this.setState(prev => ({ matches: { ...prev.matches, ...list } }));
  };

  handleError = error => {
    this.setState({ snackbarOpen: true, snackbarMessage: error.message });
  };

  handleSnackBarClose = () => {
    this.setState({ snackbarOpen: false });
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
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              open={this.state.snackbarOpen}
              onClose={this.handleSnackBarClose}
              message={
                <span id="message-id">{this.state.snackbarMessage}</span>
              }
            />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
