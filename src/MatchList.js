import React from 'react';
import Match from './Match';
import { vote, closeVoting } from './service';

const handleTeamSelected = (user, onMatchUpdated, sendMessage) => (
  id,
  match
) => selection => {
  if (user) {
    onMatchUpdated(id, { ...match, selection });
    vote(user, id, selection)
      .then(() => {
        sendMessage({
          message: 'Your choice is recorded.'
        });
      })
      .catch(() => {
        sendMessage({
          message: 'Some error occurred! Please report'
        });
      });
  } else {
    sendMessage({
      message: 'Please login first!'
    });
  }
};

const handleVoteClosing = (user, onMatchUpdated) => (id, match) => e => {
  return closeVoting(user, id).then(() =>
    onMatchUpdated(id, { ...match, votingClosed: true })
  );
};

export default function MatchList(props) {
  const { matches, onMatchUpdated, user, onError } = props;
  const handler = handleTeamSelected(user, onMatchUpdated, onError);
  const votingClosedHandler = handleVoteClosing(user, onMatchUpdated);
  return (
    <div>
      {Object.entries(matches)
        .map(match => {
          if (!user || match.votingClosed) match.votingClosed = true;
          return match;
        })
        .map(([id, match]) => (
          <Match
            key={id}
            matchData={{ ...match, matchId: id }}
            onTeamSelected={handler(id, match)}
            onMatchVotingClosed={votingClosedHandler(id, match)}
            isAdmin={user && user.role && user.role.admin}
            isPlayer={user && user.role && user.role.player}
          />
        ))}
    </div>
  );
}
