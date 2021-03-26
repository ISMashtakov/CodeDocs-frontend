import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import store from '../../redux/store';
import ChangeUsernameWindow from '../../account/ChangeUsernameWindow';
import CustomSnackbarProvider from '../../general_items/SnackbarProvider';
import { setMainUserAction } from '../../redux/actions';
import { setChangeUsernameIsOpenAction } from '../../account/actions';
import {
  getFetchWithJsonParams, simpleFetch,
} from '../../__test_helpers__/mocks';
import { sleep } from '../../__test_helpers__/help_funcs';
import { testUser } from '../../__test_helpers__/data';
import { CHANGE_USERNAME_URL } from '../../helpers/users_helper';

let container = null;

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(simpleFetch());
  container = document.createElement('div');
  store.dispatch(setMainUserAction(testUser));
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  global.fetch.mockRestore();
  store.dispatch(setMainUserAction(null));
  store.dispatch(setChangeUsernameIsOpenAction(false));
});

it('ChangeUsernameWindow render good', async () => {
  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangeUsernameWindow />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
  });

  expect(document.getElementById('account_ChangeUsernameWindow_Dialog')).not.toBeTruthy();
  await act(async () => {
    store.dispatch(setChangeUsernameIsOpenAction(true));
    await sleep(1000);
  });
  expect(document.getElementById('account_ChangeUsernameWindow_Dialog')).toBeTruthy();

  expect(document.getElementById('account_ChangeUsernameWindow_Dialog_CurrentPasswordTextField')).toBeTruthy();
  expect(document.getElementById('account_ChangeUsernameWindow_Dialog_UsernameTextField')).toBeTruthy();

  expect(document.getElementById('account_ChangeUsernameWindow_Dialog_SaveButton')).toBeTruthy();
  const cancelButton = document.getElementById('account_ChangeUsernameWindow_Dialog_CancelButton');
  expect(cancelButton).toBeTruthy();

  await act(async () => {
    fireEvent.click(cancelButton);
    await sleep(1000);
  });

  expect(document.getElementById('account_ChangeUsernameWindow_Dialog')).not.toBeTruthy();
});

it('ChangeUsernameWindow bad save', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams({ current_password: 'current_password problem' }, 400));

  await act(async () => {
    store.dispatch(setChangeUsernameIsOpenAction(true));
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangeUsernameWindow />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const saveButton = document.getElementById('account_ChangeUsernameWindow_Dialog_SaveButton');

  await act(async () => {
    fireEvent.click(saveButton);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(document.getElementById('account_ChangeUsernameWindow_Dialog').innerHTML).toContain('current_password problem');
});

it('ChangeUsernameWindow good save', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams({}, 204));

  await act(async () => {
    store.dispatch(setChangeUsernameIsOpenAction(true));
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangeUsernameWindow />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const saveButton = document.getElementById('account_ChangeUsernameWindow_Dialog_SaveButton');

  const currentPasswordField = document.getElementById('account_ChangeUsernameWindow_Dialog_CurrentPasswordTextField');
  const usernameField = document.getElementById('account_ChangeUsernameWindow_Dialog_UsernameTextField');
  expect(currentPasswordField).toBeTruthy();
  expect(usernameField).toBeTruthy();

  await act(async () => {
    fireEvent.change(currentPasswordField, { target: { value: 'current' } });
    fireEvent.change(usernameField, { target: { value: 'username' } });
    await sleep(1000);
    fireEvent.click(saveButton);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toEqual(CHANGE_USERNAME_URL);
  expect(fetch.mock.calls[0][1].method).toEqual('POST');
  expect(fetch.mock.calls[0][1].body).toEqual('new_username=username&current_password=current');
  expect(container.innerHTML).toContain('Username changed successfully!');
  expect(document.getElementById('account_ChangeUsernameWindow_Dialog')).not.toBeTruthy();
});
