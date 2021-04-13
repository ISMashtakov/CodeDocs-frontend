import {
  TASK_SET_CONSOLE_HEIGHT, TASK_CONSOLE_DOUBLE_CLICK, TASK_SET_FILE,
  TASK_ADD_ACTIVE_USER, TASK_DELETE_ACTIVE_USER, TASK_SET_ACTIVE_USERS, TASK_SET_ALL_USERS,
  TASK_ADD_USER,
} from './actions';
import { CONSOLE_HEADER_HEIGHT } from './Console';

const HEADER_HEIGHT = 75;
const MIN_CONSOLE_HEIGHT = CONSOLE_HEADER_HEIGHT;

function getStartState() {
  return {
    activeUsers: [],
    file: null,
    consoleHeight: 100,
    allUsers: [],
  };
}

const START_STATE = getStartState();

function getMaxConsoleHeight() {
  return window.innerHeight - HEADER_HEIGHT - 52;
}

export default function documentData(state = START_STATE, action) {
  switch (action.type) {
    case TASK_SET_CONSOLE_HEIGHT:
      if (action.height < MIN_CONSOLE_HEIGHT) {
        return { ...state, consoleHeight: MIN_CONSOLE_HEIGHT };
      }
      const maxWidth = getMaxConsoleHeight();
      if (action.height > maxWidth) {
        return { ...state, consoleHeight: maxWidth };
      }
      return { ...state, consoleHeight: action.height };

    case TASK_CONSOLE_DOUBLE_CLICK:
      if (state.consoleHeight === MIN_CONSOLE_HEIGHT) {
        return { ...state, consoleHeight: getMaxConsoleHeight() };
      }
      return { ...state, consoleHeight: MIN_CONSOLE_HEIGHT };

    case TASK_SET_FILE:
      return { ...state, file: action.file };

    case TASK_ADD_ACTIVE_USER:
      if (state.activeUsers.some((user) => user.username === action.user.username)) return state;
      return { ...state, activeUsers: state.activeUsers.concat([action.user]) };

    case TASK_DELETE_ACTIVE_USER:
      return {
        ...state,
        activeUsers: state.activeUsers.filter((user) => user.username !== action.user.username),
      };

    case TASK_SET_ACTIVE_USERS:
      return { ...state, activeUsers: action.users };

    case TASK_SET_ALL_USERS:
      return { ...state, allUsers: action.users };

    case TASK_ADD_USER:
      if (state.allUsers.some((user) => user.username === action.user.username)) return state;
      return { ...state, allUsers: state.allUsers.concat([action.user]) };

    default:
      return state;
  }
}
