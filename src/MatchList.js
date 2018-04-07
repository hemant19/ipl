import React from 'react';
import Match from './Match';
import { vote } from './service';

const handleTeamSelected = (user, onMatchUpdated, onError) => (
  id,
  match
) => selection => {
  if (user) {
    vote(id, user.uid, user.displayName, selection);
    onMatchUpdated(id, { ...match, selection });
  } else {
    onError({
      message: 'Please login first!'
    });
  }
};

export default function MatchList(props) {
  const { matches, onMatchUpdated, user, onError } = props;
  const handler = handleTeamSelected(user, onMatchUpdated, onError);

  return (
    <div>
      {Object.entries(matches)
        .map(match => {
          if (!user || match.votingClosed || match.date < Date.now())
            match.votingClosed = true;
          return match;
        })
        .map(([id, match]) => (
          <Match
            key={id}
            matchData={{ ...match, matchId: id }}
            onTeamSelected={handler(id, match)}
          />
        ))}
    </div>
  );
}
