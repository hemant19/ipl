import React from 'react';
import Match from './Match';
import { vote, closeVoting } from './actions';
import { connect } from 'react-redux';

import { LinearProgress } from 'material-ui/Progress';

const handleTeamSelected = (user, dispatch) => (id, match) => selection => {
  if (user) {
    dispatch(vote(user, id, selection));
  }
};

const handleVoteClosing = dispatch => id => e => {
  return dispatch(closeVoting(id));
};

function MatchList({ matchList, user, dispatch }) {
  const handler = handleTeamSelected(user, dispatch);
  const votingClosedHandler = handleVoteClosing(dispatch);
  return (
    <div>
      {Object.entries(matchList).length !== 0 ? (
        Object.entries(matchList)
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
          ))
      ) : (
        <LinearProgress />
      )}
    </div>
  );
}

export default connect(state => state)(MatchList);
