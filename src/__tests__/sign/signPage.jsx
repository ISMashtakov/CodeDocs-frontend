import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';

import SignPage from '../../sign/SignPage';

let container = null;
let store = null;
const mockStore = configureStore();
const INITIAL_STATE = {};

beforeEach(() => {
  store = mockStore(INITIAL_STATE);
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders after swap tab', () => {
  act(() => {
    render(<SignPage store={store} />, container);
  });
  expect(SignPage).toBeTruthy();
  expect(document.getElementById('sign_SignPage_SignUpTab_div')).not.toBeNull();
  expect(document.getElementById('sign_SignPage_SignInTab_div')).toBeNull();

  const signInTab = document.getElementById('sign_SignPage_SignTabs_TabSingIn');
  expect(signInTab.innerHTML).toContain('SIGN IN');
  act(() => {
    signInTab.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(document.getElementById('sign_SignPage_SignInTab_div')).not.toBeNull();
  expect(document.getElementById('sign_SignPage_SignUpTab_div')).toBeNull();

  const signUpTab = document.getElementById('sign_SignPage_SignTabs_TabSingUp');
  expect(signUpTab.innerHTML).toContain('SIGN UP');
  act(() => {
    signUpTab.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(document.getElementById('sign_SignPage_SignUpTab_div')).not.toBeNull();
  expect(document.getElementById('sign_SignPage_SignInTab_div')).toBeNull();
});
