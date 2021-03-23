export const TASK_SET_PROBLEMS = 'SET_PROBLEMS';
export const TASK_SET_WRONG_LOGIN = 'SET_WRONG_LOGIN';

export function setProblems(problems) {
  return {
    type: TASK_SET_PROBLEMS,
    problems,
  };
}

export function setWrongLogin(state) {
  return {
    type: TASK_SET_WRONG_LOGIN,
    state,
  };
}
