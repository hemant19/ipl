import { UPDATE_MATCH, ADD_MATCH, RECIEVE_MATCHES } from '../actions/constants';

const match = (state = {}, action) => {
  switch (action.type) {
    case ADD_MATCH:
      return action.match;
    case UPDATE_MATCH:
      return {
        ...state,
        ...action.match
      };
    default:
      return state;
  }
};

export const matchList = (state = {}, action) => {
  switch (action.type) {
    case ADD_MATCH:
    case UPDATE_MATCH:
      return {
        ...state,
        [action.id]: match(state[action.id], action)
      };
    case RECIEVE_MATCHES:
      return {
        ...state,
        ...action.response
      };
    default:
      return state;
  }
};
