export const TASK_SET_MAIN_USER = 'SET_MAIN_USER';

export function setMainUserAction(user) {
  return {
    type: TASK_SET_MAIN_USER,
    user,
  };
}
