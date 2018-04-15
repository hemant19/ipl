import { combineReducers } from 'redux';
import { user } from './user';
import { matchList } from './matchList';
import { notification } from './notification';

export const rootReducer = combineReducers({
  user,
  matchList,
  notification
});
