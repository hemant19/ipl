import React, { Component } from 'react';
import { Header } from './Header';
import { getMatches, getMatchesWithVotes, auth } from './service';

import Home from './Home';
import Login from './Login';

class App extends Component {

  constructor() {
    super();
    this.state = {
      matches: {},
      user: undefined
    }
  }

  componentDidMount() {
    getMatches().then((matches) => {
      this.setState({ matches })
    })

    auth.onAuthStateChanged(this.handleOnLogin)
  }

  handleOnLogin = (user) => {
    if (user) {
      if (!this.state.user) {
        getMatchesWithVotes(user.uid).then((matches) => {
          this.setState({ matches })
        })
        this.setState({ user })
      }
    } else {
      this.setState({ user: null })
    }
  }

  onMatchListUpdated = (list) => {
    this.setState(prev => ({ matches: { ...prev.matches, ...list } }));
  }

  render() {
    return (
      <div>
        <Header loggedIn={!!this.state.user} onLogout={e => auth.signOut()} />
        {
          this.state.user ?
            <Home matches={this.state.matches} onMatchListUpdated={this.onMatchListUpdated} user={this.state.user} /> :
            <Login />
        }
      </div>
    );
  }
}

export default App;
