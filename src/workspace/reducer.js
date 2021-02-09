import { TASK_SET_TEXT } from './actions';
import User from '../helpers/user';

function getStartState() {
  return {
    user: new User(),
    text: ""
  };
}

const START_STATE = getStartState();

export default function documentData(state = START_STATE, action) {
  switch (action.type) {
    case TASK_SET_TEXT:
      return {...state, text: action.text}
    default:
      return state;
  }
}
