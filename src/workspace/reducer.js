import {
  TASK_SET_CONSOLE_HEIGHT, TASK_CONSOLE_DOUBLE_CLICK, TASK_SET_FILE,
  TASK_ADD_ACTIVE_USER, TASK_DELETE_ACTIVE_USER, TASK_SET_ACTIVE_USERS, TASK_SET_ALL_USERS,
  TASK_ADD_USER, TASK_UPDATE, TASK_SET_RUN_FILE_STATUS, TASK_ADD_CONSOLE_TEXT,
  TASK_SET_CONSOLE_TEXT, TASK_SET_HOVER_CURSOR, TASK_SET_WORKSPACE_STYLE,
} from './actions';
import { CONSOLE_HEADER_HEIGHT } from '../constants';
import WorkspaceStyle from '../helpers/workspace_style';

const HEADER_HEIGHT = 75;
const MIN_CONSOLE_HEIGHT = CONSOLE_HEADER_HEIGHT;

function getStartState() {
  return {
    activeUsers: [],
    file: null,
    consoleHeight: 100,
    allUsers: [],
    forUpdate: 0,
    fileIsRunned: false,
    consoleText: [],
    hoverCursor: null,
    workspaceStyle: WorkspaceStyle.load(),
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

    case TASK_UPDATE:
      return { ...state, forUpdate: state.forUpdate + 1 };

    case TASK_SET_RUN_FILE_STATUS:
      return { ...state, fileIsRunned: action.state };

    case TASK_SET_CONSOLE_TEXT:
      return { ...state, consoleText: action.text };

    case TASK_ADD_CONSOLE_TEXT:
      const consoleText = state.consoleText;
      if (action.index === -1) consoleText.push(action.text);
      else consoleText[action.index] = action.text;
      return { ...state, consoleText };

    case TASK_SET_HOVER_CURSOR:
      return { ...state, hoverCursor: action.value };

    case TASK_SET_WORKSPACE_STYLE:
      action.value.save();
      return { ...state, workspaceStyle: action.value, forUpdate: state.forUpdate + 1 };

    default:
      return state;
  }
}
