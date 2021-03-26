import { TASK_SET_CHANGE_PASSWORD_IS_OPEN, TASK_SET_CHANGE_EMAIL_IS_OPEN, TASK_SET_CHANGE_USERNAME_IS_OPEN } from './actions';

function getStartState() {
  return {
    changePasswordWindowIsOpen: false,
    changeMailWindowIsOpen: false,
    changeUsernameWindowIsOpen: false,
  };
}

const START_STATE = getStartState();

export default function accountData(state = START_STATE, action) {
  switch (action.type) {
    case TASK_SET_CHANGE_PASSWORD_IS_OPEN:
      return { ...state, changePasswordWindowIsOpen: action.status };
    case TASK_SET_CHANGE_EMAIL_IS_OPEN:
      return { ...state, changeMailWindowIsOpen: action.status };
    case TASK_SET_CHANGE_USERNAME_IS_OPEN:
      return { ...state, changeUsernameWindowIsOpen: action.status };
    default:
      return state;
  }
}
