import React from 'react';
import Match from './Match';

export default function MatchList(props) {
  const { matches, onMatchUpdated} = props;

  return (
    <div>
      {
        Object.entries(matches).map(([id, match]) => <Match key={id} match={match} onTeamSelected={(selection) => onMatchUpdated(id, {...match, selection})}/>)
      };
    </div>
  );
}