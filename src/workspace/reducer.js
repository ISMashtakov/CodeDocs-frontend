import { TASK_SET_TEXT, TASK_SET_CONSOLE_HEIGHT, TASK_CONSOLE_DOUBLE_CLICK } from './actions';
import { MainUser, User } from '../helpers/user';
import COLORS from '../style/colors';
import { CONSOLE_HEADER_HEIGHT } from './Console';
import { HEADER_HEIGHT } from './Header';

const MIN_CONSOLE_HEIGHT = CONSOLE_HEADER_HEIGHT;

function getStartState() {
  const user = new MainUser();
  user.username = 'Morosova Milena';
  user.color = COLORS.BUTTON_BLUE;

  const user1 = new User();
  user1.username = 'Uorosova Uilena';
  user1.color = COLORS.BUTTON_ORANGE;

  const user2 = new User();
  user2.username = 'Iorosova Iilena';
  user2.color = COLORS.BUTTON_BLUE;

  const user3 = new User();
  user3.username = 'Oorosova Oilena';
  user3.color = '#C7567F';

  return {
    user,
    collaborators: [user3, user2, user1],
    text:
`def function(a, b):
    print(a+b)
      
function("hello ", "world!") gigoirhdo `,
    filename: 'File_1.py',
    consoleHeight: 100,
  };
}

const START_STATE = getStartState();

function getMaxConsoleHeight() {
  return window.innerHeight - HEADER_HEIGHT - 52;
}

export default function documentData(state = START_STATE, action) {
  switch (action.type) {
    case TASK_SET_TEXT:
      return { ...state, text: action.text };
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
    default:
      return state;
  }
}
