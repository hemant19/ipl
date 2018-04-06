import React, { Component } from 'react';
import { Header } from './Header';
import MatchList from './MatchList';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <MatchList />
      </div>
    );
  }
}

export default App;
