import React, { Component } from 'react';
import { Header } from './Header';
import MatchList from './MatchList';

class App extends Component {

  constructor() {
    super();
    this.state = {
      matches: {
        "1": {
          "team1": "KKR",
          "team2": "KXII Punjab",
          "location": "Mumbai",
          "selection": null
        }
      }
    }
  }

  render() {
    return (
      <div>
        <Header />
        <MatchList matches={this.state.matches} onMatchUpdated={(id, match) => {
          this.setState({
            matches: {
              [id]: match
            }
          });
        }} />
      </div>
    );
  }
}

export default App;
