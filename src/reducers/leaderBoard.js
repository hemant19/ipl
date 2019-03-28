import {USERS_FETCHED} from '../actions/constants';

export const leaderBoard = (
    state = {
      users: [],
      total: 0
    },
    action
  ) => {
    switch (action.type) {
      case USERS_FETCHED:
        const users = Object.entries(action.users)
        .map(([id, user]) => ({id, ...user}))
        .map(match => ({
          ...match,
          points: match.points.toFixed(2)
        }))
        .sort((a, b) => b.points - a.points);

        let total = 0;

        users.forEach(user => total += parseFloat(user.points));

        return {
          users,
          total
        };
      default:
        return state;
    }
  };
  