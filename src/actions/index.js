import {
  ADD_MATCH,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  LOGIN_USER,
  LOGOUT_USER,
  RECIEVE_MATCHES,
  UPDATE_USER,
  UPDATE_MATCH
} from './constants';
import {
  fetchMatches,
  postVote,
  fetchUserVote,
  postCloseVoting,
  fetchUserRoles
} from '../api';

export const addMatch = (id, match) => ({
  type: ADD_MATCH,
  id,
  match
});

export const updateMatch = (id, match) => ({
  type: ADD_MATCH,
  id,
  match
});

export const recieveMatches = () => (dispatch, getState) =>
  fetchMatches()
    .then(response => {
      dispatch({
        type: RECIEVE_MATCHES,
        response
      });
      return response;
    })
    .then(matches => dispatch(recieveUserChoices({ matches })));

const recieveUserChoices = data => (dispatch, getState) => {
  const state = getState();
  const matches = data.matches || state.matches;
  const user = data.user || state.user;

  if (user && matches && Object.keys(matches).length !== 0) {
    Object.keys(matches).map(matchId =>
      fetchUserVote(user.uid, matchId).then(team =>
        dispatch({
          type: UPDATE_MATCH,
          id: matchId,
          match: { selection: team }
        })
      )
    );
  }
};

export const closeVoting = matchId => dispatch => {
  postCloseVoting(matchId)
    .then(() =>
      dispatch({
        type: UPDATE_MATCH,
        id: matchId,
        match: { votingClosed: true }
      })
    )
    .catch(() =>
      dispatch(notify('Unable to close voting. Please Refresh', 'reload'))
    );
};

export const vote = (user, matchId, team) => dispatch => {
  dispatch({
    type: UPDATE_MATCH,
    id: matchId,
    match: { selection: team, isVoting: true }
  });

  return postVote(user, matchId, team)
    .then(() => {
      dispatch({
        type: UPDATE_MATCH,
        id: matchId,
        match: { selection: team, isVoting: false }
      });
      dispatch(notify('Your choice has been recorded!'));
    })
    .catch(() => {
      dispatch({
        type: UPDATE_MATCH,
        id: matchId,
        match: { isVoting: false }
      });

      dispatch(notify('Some error occurred.Please reload', 'reload'));
    });
};

export const notify = (message, action = null) => ({
  type: SHOW_NOTIFICATION,
  message,
  action
});

export const hideNotification = () => ({
  type: HIDE_NOTIFICATION
});

export const loginUser = user => (dispatch, getState) => {
  dispatch({
    type: LOGIN_USER,
    user
  });
  dispatch(recieveUserRoles(user));
  dispatch(recieveUserChoices({ user }));
};

const recieveUserRoles = user => dispatch => {
  fetchUserRoles(user).then(user => dispatch(updateUser(user)));
};

export const updateUser = user => ({
  type: UPDATE_USER,
  user
});

export const logoutUser = () => ({
  type: LOGOUT_USER
});
