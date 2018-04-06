import React, { Component } from 'react';
import { Header } from './Header';
import MatchList from './MatchList';
import { getMatches } from './service';

class App extends Component {

  constructor() {
    super();
    this.state = {
      matches: {
        
      }
    }
  }

  componentDidMount() {
    getMatches().then((matches) => {
      this.setState({ matches })
    });
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
