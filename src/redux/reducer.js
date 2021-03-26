import { TASK_SET_MAIN_USER } from './actions';
import { MainUser } from '../helpers/user';
import COLORS from '../style/colors';

function getStartState() {
  const user = new MainUser();
  user.username = 'Morosova Milena';
  user.mail = 'justemaiforexample@mail.ru';
  user.color = COLORS.BUTTON_BLUE;
  return {
    mainUser: null,
  };
}

const START_STATE = getStartState();

export default function generalData(state = START_STATE, action) {
  switch (action.type) {
    case TASK_SET_MAIN_USER:
      return { ...state, mainUser: action.user };
    default:
      return state;
  }
}
