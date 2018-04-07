import React from 'react';
import Match from './Match';
import { vote } from './service';

const handleTeamSelected = (user, onMatchUpdated) => (id, match) => (selection) => {
  vote(id, user.uid, user.displayName, selection)
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
            if (match.votingClosed || match.date < Date.now())
              match.votingClosed = true;
            return match;
          })
          .map(([id, match]) => <Match key={id} matchData={{ ...match, matchId: id }} onTeamSelected={handler(id, match)} />)
      }
    </div>
  );
}