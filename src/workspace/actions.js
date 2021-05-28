export const TASK_SET_FILE = 'SET_FILE';
export const TASK_SET_CONSOLE_HEIGHT = 'SET_CONSOLE_HEIGHT';
export const TASK_CONSOLE_DOUBLE_CLICK = 'CONSOLE_DOUBLE_CLICK';
export const TASK_ADD_ACTIVE_USER = 'ADD_ACTIVE_USER';
export const TASK_DELETE_ACTIVE_USER = 'DELETE_ACTIVE_USER';
export const TASK_SET_ACTIVE_USERS = 'SET_ACTIVE_USERS';
export const TASK_SET_ALL_USERS = 'SET_ALL_USERS';
export const TASK_ADD_USER = 'ADD_USER';
export const TASK_UPDATE = 'UPDATE';
export const TASK_SET_RUN_FILE_STATUS = 'SET_RUN_FILE_STATUS';
export const TASK_SET_CONSOLE_TEXT = 'SET_CONSOLE_TEXT';
export const TASK_ADD_CONSOLE_TEXT = 'ADD_CONSOLE_TEXT';
export const TASK_SET_HOVER_CURSOR = 'SET_HOVER_CURSOR';
export const TASK_SET_WORKSPACE_STYLE = 'SET_WORKSPACE_STYLE';

export function updateAction() {
  return {
    type: TASK_UPDATE,
  };
}

export function setFileAction(file) {
  return {
    type: TASK_SET_FILE,
    file,
  };
}

export function setAllUsersAction(users) {
  return {
    type: TASK_SET_ALL_USERS,
    users,
  };
}

export function addUserAction(user) {
  return {
    type: TASK_ADD_USER,
    user,
  };
}

export function addActiveUserAction(user) {
  return {
    type: TASK_ADD_ACTIVE_USER,
    user,
  };
}

export function deleteActiveUserAction(user) {
  return {
    type: TASK_DELETE_ACTIVE_USER,
    user,
  };
}

export function setActiveUsersAction(users) {
  return {
    type: TASK_SET_ACTIVE_USERS,
    users,
  };
}

export function setConsoleHeightAction(height) {
  return {
    type: TASK_SET_CONSOLE_HEIGHT,
    height,
  };
}

export function consoleDoubleClickAction() {
  return {
    type: TASK_CONSOLE_DOUBLE_CLICK,
  };
}

export function setRunFileStatusAction(state) {
  return {
    type: TASK_SET_RUN_FILE_STATUS,
    state,
  };
}

export function setConsoleTextAction(text) {
  return {
    type: TASK_SET_CONSOLE_TEXT,
    text,
  };
}

export function addConsoleTextAction(text, index) {
  return {
    type: TASK_ADD_CONSOLE_TEXT,
    text,
    index,
  };
}

export function setHoverCursorAction(value) {
  return {
    type: TASK_SET_HOVER_CURSOR,
    value,
  };
}

export function setWorkspaceStyleAction(value) {
  return {
    type: TASK_SET_WORKSPACE_STYLE,
    value,
  };
}
