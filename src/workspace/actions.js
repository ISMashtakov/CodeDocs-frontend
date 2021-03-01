export const TASK_SET_TEXT = 'SET_TEXT';

export function setTextAction(text) {
  return {
    type: TASK_SET_TEXT,
    text,
  };
}
