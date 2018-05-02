import React from 'react';
import Match from './Match';
import { vote, closeVoting, declareWinner } from './actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { LinearProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';

const handleTeamSelected = (user, dispatch) => id => selection => {
  if (user) {
    dispatch(vote(user, id, selection));
  }
};

const handleVoteClosing = dispatch => id => () => {
  return dispatch(closeVoting(id));
};

const handleMatchWinnerSelected = dispatch => id => winner => {
  return dispatch(declareWinner(id, winner));
};

const styles = {
  match: {
    margin: '10px'
  }
};

function MatchList({classes, history, matchList, user, dispatch}) {
  const isAdmin = user && user.role && user.role.admin;
  const isPlayer = user && user.role && user.role.player;

  const votingHandler = (id, closed) => !closed && isPlayer ? handleTeamSelected(user, dispatch)(id) : null;
  const closeVotingHandler = (id, closed) => !closed && isAdmin ? handleVoteClosing(dispatch)(id) : null;
  const matchWinnerHandler = (id, closed) => closed && isAdmin ? handleMatchWinnerSelected(dispatch)(id) : null;
  const viewDetailsHandler = (id, closed) => closed || isAdmin ? () => history.push(`/matches/${id}`) : null;

  if (Object.entries(matchList).length === 0)
    return <LinearProgress/>;

  return (
    <div>
      {
        Object.entries(matchList)
          .map(([id, match]) => {
            return {
              ...match,
              matchId: id,
              vote: match.selection,
              onVote: votingHandler(id, match.votingClosed),
              onCloseVoting: closeVotingHandler(id, match.votingClosed),
              onViewDetails: viewDetailsHandler(id, match.votingClosed),
              onMatchWinnerSelected: matchWinnerHandler(id, match.votingClosed)
            }
          })
          .map(match => (
            <Match
              key={match.matchId}
              {...match}
              className={classes.match}
            />
          ))
      }
    </div>
  );
}

export default connect(state => state)(withRouter(withStyles(styles)(MatchList)));
