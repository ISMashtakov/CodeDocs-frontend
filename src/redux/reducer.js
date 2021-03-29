import { TASK_SET_MAIN_USER } from './actions';

function getStartState() {
  return {
    mainUser: null,
  };
}

const START_STATE = getStartState();

export default function generalData(state = START_STATE, action) {
  switch (action.type) {
    case TASK_SET_MAIN_USER:
      return { ...state, mainUser: action.user };
    default:
      return state;
  }
}
