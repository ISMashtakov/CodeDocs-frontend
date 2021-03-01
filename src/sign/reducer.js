import { TASK_SELECT_TAB } from './actions';

function getStartState() {
  return {
    selectedTab: 0,
  };
}

const START_STATE = getStartState();

export default function signData(state = START_STATE, action) {
  switch (action.type) {
    case TASK_SELECT_TAB:
      return { ...state, selectedTab: action.tabId };
    default:
      return state;
  }
}
