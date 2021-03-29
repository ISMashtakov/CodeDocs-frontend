import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import store from '../../redux/store';
import SignPage from '../../sign/SignPage';
import {
  getFetchWithJsonParams, simpleFetch, queueMocks, getFetchWithTextParams,
} from '../../__test_helpers__/mocks';
import { sleep } from '../../__test_helpers__/help_funcs';
import { CHECK_USERNAME_URL, CHECK_MAIL_URL } from '../../helpers/auth_helper';
import CustomSnackbarProvider from '../../general_items/SnackbarProvider';
import { ACCOUNT_PAGE_NAME } from '../../constants';
import * as generalHelpers from '../../helpers/general_helpers';

let container = null;

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(simpleFetch());
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  global.fetch.mockRestore();
});

it('sign up render good', () => {
  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <SignPage isLogin={false} />
        </Provider>
      </CustomSnackbarProvider>, container,

    );
  });

  expect(document.getElementById('sign_SignPage_SignUp_div')).toBeTruthy();

  expect(document.getElementById('sign_SignPage_SignUp_usernameDiv')).toBeTruthy();
  expect(document.getElementById('sign_SignPage_SignUp_mailDiv')).toBeTruthy();
  expect(document.getElementById('sign_SignPage_SignUp_passwordInput')).toBeTruthy();
  expect(document.getElementById('sign_SignPage_SignUp_signupButton')).toBeTruthy();
});

it('sign up filename existing check', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(queueMocks(
    [
      getFetchWithTextParams('error text', 409),
      getFetchWithTextParams('', 200),
    ],
  ));

  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <SignPage isLogin={false} />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
  });

  const usernameDiv = document.getElementById('sign_SignPage_SignUp_usernameDiv');
  expect(usernameDiv).toBeTruthy();

  const usernameTextField = usernameDiv.querySelector('input');
  expect(usernameTextField).toBeTruthy();

  await act(async () => {
    usernameTextField.focus();
    fireEvent.change(usernameTextField, { target: { value: 'test_username1' } });
    usernameTextField.blur();
    await sleep(100);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toEqual(CHECK_USERNAME_URL);
  expect(usernameDiv.innerHTML).toContain('error text');

  await act(async () => {
    usernameTextField.focus();
    fireEvent.change(usernameTextField, { target: { value: 'test_username2' } });
    usernameTextField.blur();
    await sleep(100);
  });

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[1][0]).toEqual(CHECK_USERNAME_URL);
  expect(usernameDiv.innerHTML).not.toContain('error text');
});

it('sign up mail existing check', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(queueMocks(
    [
      getFetchWithTextParams('error text', 409),
      getFetchWithTextParams('', 200),
    ],
  ));

  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <SignPage isLogin={false} />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
  });

  const mailDiv = document.getElementById('sign_SignPage_SignUp_mailDiv');
  expect(mailDiv).toBeTruthy();

  const mailTextField = mailDiv.querySelector('input');
  expect(mailTextField).toBeTruthy();

  await act(async () => {
    mailTextField.focus();
    fireEvent.change(mailTextField, { target: { value: 'test_mail1' } });
    mailTextField.blur();
    await sleep(100);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toEqual(CHECK_MAIL_URL);
  expect(mailDiv.innerHTML).toContain('error text');

  await act(async () => {
    mailTextField.focus();
    fireEvent.change(mailTextField, { target: { value: 'test_mail2' } });
    mailTextField.blur();
    await sleep(100);
  });

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[1][0]).toEqual(CHECK_MAIL_URL);
  expect(mailDiv.innerHTML).not.toContain('error text');
});

it('bad sign up check', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams(
    {
      password: ['error password'],
      email: ['error mail'],
      username: ['error username'],
    }, 400,
  ));

  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <SignPage isLogin={false} />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
  });

  const button = document.getElementById('sign_SignPage_SignUp_signupButton');
  expect(button).toBeTruthy();

  await act(async () => {
    fireEvent.click(button);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);

  const usernameDiv = document.getElementById('sign_SignPage_SignUp_usernameDiv');
  expect(usernameDiv).toBeTruthy();
  expect(usernameDiv.innerHTML).toContain('error username');

  const mailDiv = document.getElementById('sign_SignPage_SignUp_mailDiv');
  expect(mailDiv).toBeTruthy();
  expect(mailDiv.innerHTML).toContain('error mail');

  const passwordDiv = document.getElementById('sign_SignPage_SignUp_passwordInput');
  expect(passwordDiv).toBeTruthy();
  expect(passwordDiv.parentElement.parentElement.innerHTML).toContain('error password');
});

it('bad sign up check', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithTextParams(
    'Message was not accepted -- invalid mailbox.  Local mailbox asdrtasr@mail.ru is unavailable: user not found',
    500,
  ));

  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <SignPage isLogin={false} />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
  });

  const button = document.getElementById('sign_SignPage_SignUp_signupButton');
  expect(button).toBeTruthy();

  await act(async () => {
    fireEvent.click(button);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);

  const mailDiv = document.getElementById('sign_SignPage_SignUp_mailDiv');
  expect(mailDiv).toBeTruthy();
  expect(mailDiv.innerHTML).toContain('Email not exist');
});

it('Sign up good', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams({}, 201));

  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <SignPage isLogin={false} />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
  });
  const usernameTextField = document.getElementById('sign_SignPage_SignUp_usernameDiv').querySelector('input');
  const mailTextField = document.getElementById('sign_SignPage_SignUp_mailDiv').querySelector('input');
  const passwordTextField = document.getElementById('sign_SignPage_SignUp_passwordInput');
  const button = document.getElementById('sign_SignPage_SignUp_signupButton');
  expect(button).toBeTruthy();

  await act(async () => {
    fireEvent.change(usernameTextField, { target: { value: 'test_username' } });
    fireEvent.change(mailTextField, { target: { value: 'test_email' } });
    fireEvent.change(passwordTextField, { target: { value: 'test_password' } });
    await sleep(500);
    fireEvent.click(button);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][1].body).toEqual('username=test_username&email=test_email&password=test_password');

  expect(document.body.innerHTML).toContain('Activation mail was sended!');
});

it('login render good', () => {
  act(() => {
    render(
      <Provider store={store}>
        <SignPage isLogin />
      </Provider>, container,
    );
  });

  expect(document.getElementById('sign_SignPage_LogInTab_div')).toBeTruthy();

  expect(document.getElementById('sign_SignPage_LogInTab_UsernameTextField')).toBeTruthy();
  expect(document.getElementById('sign_SignPage_LogInTab_PasswordTextField')).toBeTruthy();
  expect(document.getElementById('sign_SignPage_LogInTab_LoginButton')).toBeTruthy();
});

it('login bad', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams({}, 401));
  act(() => {
    render(
      <Provider store={store}>
        <SignPage isLogin />
      </Provider>, container,
    );
  });

  const button = document.getElementById('sign_SignPage_LogInTab_LoginButton');

  await act(async () => {
    fireEvent.click(button);
    await sleep(1000);
  });

  expect(fetch).toBeCalledTimes(1);

  const tab = document.getElementById('sign_SignPage_LogInTab_div');
  expect(tab.innerHTML).toContain('Username or login is incorrect');
});

it('login good', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams({}, 200));
  const openPage = jest.spyOn(generalHelpers, 'openPage').mockImplementation(simpleFetch());

  act(() => {
    render(
      <Provider store={store}>
        <SignPage isLogin />
      </Provider>, container,
    );
  });

  const usernameTextField = document.getElementById('sign_SignPage_LogInTab_UsernameTextField');
  const passwordTextField = document.getElementById('sign_SignPage_LogInTab_PasswordTextField');
  const button = document.getElementById('sign_SignPage_LogInTab_LoginButton');

  await act(async () => {
    fireEvent.change(usernameTextField, { target: { value: 'test_username' } });
    fireEvent.change(passwordTextField, { target: { value: 'test_password' } });
    await sleep(1000);
    fireEvent.click(button);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][1].body).toEqual('username=test_username&password=test_password');
  expect(openPage).toHaveBeenCalledTimes(1);
  expect(openPage).toHaveBeenCalledWith(`/${ACCOUNT_PAGE_NAME}`);

  generalHelpers.openPage.mockRestore();
});
