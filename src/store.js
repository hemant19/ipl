import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  LOGIN_USER,
  ADD_MATCH,
  UPDATE_MATCH,
  LOGOUT_USER,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  UPDATE_USER,
  RECIEVE_MATCHES
} from './actions/constants';

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

const matchList = (state = {}, action) => {
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

const user = (state = null, action) => {
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

const notification = (
  state = {
    open: false,
    message: '',
    action: null,
    vertical: 'bottom',
    horizontal: 'right'
  },
  action
) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        open: true,
        action: action.action,
        message: action.message
      };
    case HIDE_NOTIFICATION:
      return {
        ...state,
        open: false,
        action: null,
        message: ''
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user,
  matchList,
  notification
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
