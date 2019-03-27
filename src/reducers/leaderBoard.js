import {USERS_FETCHED} from '../actions/constants';

export const leaderBoard = (
    state = {
      users: []
    },
    action
  ) => {
    switch (action.type) {
      case USERS_FETCHED:
        const users = Object.entries(action.users)
        .map(([id, user]) => ({id, ...user}))
        .sort((a, b) => b.points - a.points);

        return {
          users
        };
      default:
        return state;
    }
  };
  