export const TASK_SET_TEXT = 'SET_TEXT';
export const TASK_SET_CONSOLE_HEIGHT = 'SET_CONSOLE_HEIGHT';
export const TASK_CONSOLE_DOUBLE_CLICK = 'CONSOLE_DOUBLE_CLICK';

export function setTextAction(text) {
  return {
    type: TASK_SET_TEXT,
    text,
  };
}

export function setConsoleHeight(height) {
  return {
    type: TASK_SET_CONSOLE_HEIGHT,
    height,
  };
}

export function consoleDoubleClick() {
  return {
    type: TASK_CONSOLE_DOUBLE_CLICK
  };
}