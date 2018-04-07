import React from 'react';
import Match from './Match';
import { vote } from './service';

const handleTeamSelected = (user, onMatchUpdated) => (id, match) => (selection) => {
  vote(id, user.uid, selection)
  onMatchUpdated(id, { ...match, selection })
}

export default function MatchList(props) {
  const { matches, onMatchUpdated, user } = props;
  const handler = handleTeamSelected(user, onMatchUpdated)

  return (
    <div>
      {
        Object.entries(matches)
        .map(match => {
          if(match.date < Date.now())
            match.started = true;
          return match;
        })
        .map(([id, match]) => <Match key={id} match={match} onTeamSelected={handler(id, match)} />)
      }
    </div>
  );
}