import { TASK_SET_PROBLEMS, TASK_SET_WRONG_LOGIN } from './actions';

function getStartState() {
  return {
    passwordProblem: 'sdfsdfsd',
    emailProblem: 'sdfds',
    usernameProblem: 'fdsgdsfg',
    wrongLogin: false,
  };
}

const START_STATE = getStartState();

export default function signData(state = START_STATE, action) {
  switch (action.type) {
    case TASK_SET_PROBLEMS:
      return {
        ...state,
        passwordProblem: action.problems.password,
        emailProblem: action.problems.email,
        usernameProblem: action.problems.username,
      };
    case TASK_SET_WRONG_LOGIN:
      return {
        ...state,
        wrongLogin: action.state,
      };
    default:
      return state;
  }
}
