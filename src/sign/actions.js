export const TASK_SELECT_TAB = 'SELECT_TAB';

export function selectTabAction(tabId) {
  return {
    type: TASK_SELECT_TAB,
    tabId,
  };
}
