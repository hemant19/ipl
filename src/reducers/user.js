import { UPDATE_USER, LOGIN_USER, LOGOUT_USER } from '../actions/constants';

export const user = (state = null, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return action.user;
    case UPDATE_USER:
      return {
        ...state,
        ...action.user
      };
    case LOGOUT_USER:
      return null;
    default:
      return state;
  }
};
