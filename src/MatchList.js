import React from 'react';
import Match from './Match';

export default function MatchList(props) {
  return (
    <div>
      <Match match={ {team1: "KXII Punjab", team2: "KKR", location: "Pune"} }/>
    </div>
  );
}