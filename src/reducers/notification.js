import { HIDE_NOTIFICATION, SHOW_NOTIFICATION } from '../actions/constants';

export const notification = (
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
