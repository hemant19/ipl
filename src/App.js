import React, { Component } from 'react';
import { Header } from './Header';
import { getMatches, getMatchesWithVotes, auth } from './service';
import MatchVotes from './MatchVotes';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

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

  renderHome() {
    return this.state.user ?
      <Home matches={this.state.matches} onMatchListUpdated={this.onMatchListUpdated} user={this.state.user} /> :
      <Login />
  }

  render() {
    return (
      <div>
        <Header loggedIn={!!this.state.user} onLogout={e => auth.signOut()} />
        <BrowserRouter>
        <div>
            <Route path="/" exact component={() => this.renderHome()} />
            <Route path="/matches/{matchId}" component={MatchVotes} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
