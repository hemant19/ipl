import { combineReducers } from 'redux';
import { user } from './user';
import { matchList } from './matchList';
import { notification } from './notification';
import { leaderBoard } from './leaderBoard';

export const rootReducer = combineReducers({
  user,
  matchList,
  notification,
  leaderBoard
});
