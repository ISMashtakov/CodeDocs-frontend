import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import store from '../../redux/store';
import ChangePasswordWindow from '../../account/ChangePasswordWindow';
import CustomSnackbarProvider from '../../general_items/SnackbarProvider';
import { setChangePasswordIsOpenAction } from '../../account/actions';
import { setMainUserAction } from '../../redux/actions';
import {
  getFetchWithJsonParams, simpleFetch,
} from '../../__test_helpers__/mocks';
import { sleep } from '../../__test_helpers__/help_funcs';
import { CHANGE_PASSWOD_URL } from '../../helpers/users_helper';
import { getTestUser } from '../../__test_helpers__/data';

let container = null;

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(simpleFetch());
  container = document.createElement('div');
  document.body.appendChild(container);
  store.dispatch(setMainUserAction(getTestUser()));
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  global.fetch.mockRestore();
  store.dispatch(setChangePasswordIsOpenAction(false));
  store.dispatch(setMainUserAction(null));
});

it('ChangePasswordWindow render good', async () => {
  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangePasswordWindow />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
  });

  expect(document.getElementById('general_items_CustomDialog_Dialog')).not.toBeTruthy();
  await act(async () => {
    store.dispatch(setChangePasswordIsOpenAction(true));
    await sleep(1000);
  });
  expect(document.getElementById('general_items_CustomDialog_Dialog')).toBeTruthy();

  expect(document.getElementById('account_ChangePasswordWindow_Dialog_CurrentPasswordTextField')).toBeTruthy();
  expect(document.getElementById('account_ChangePasswordWindow_Dialog_NewPasswordTextField')).toBeTruthy();

  expect(document.getElementById('general_items_CustomDialog_Dialog_ActionButton')).toBeTruthy();
  const cancelButton = document.getElementById('general_items_CustomDialog_Dialog_CancelButton');
  expect(cancelButton).toBeTruthy();

  await act(async () => {
    fireEvent.click(cancelButton);
    await sleep(1000);
  });

  expect(document.getElementById('general_items_CustomDialog_Dialog')).not.toBeTruthy();
});

it('ChangePasswordWindow bad save', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams({ new_password: 'new_password problem' }, 400));

  await act(async () => {
    store.dispatch(setChangePasswordIsOpenAction(true));
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangePasswordWindow />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const saveButton = document.getElementById('general_items_CustomDialog_Dialog_ActionButton');

  await act(async () => {
    fireEvent.click(saveButton);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(document.getElementById('general_items_CustomDialog_Dialog').innerHTML).toContain('new_password problem');
});

it('ChangePasswordWindow good save', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams({}, 204));

  await act(async () => {
    store.dispatch(setChangePasswordIsOpenAction(true));
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangePasswordWindow />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const saveButton = document.getElementById('general_items_CustomDialog_Dialog_ActionButton');

  const currentPasswordField = document.getElementById('account_ChangePasswordWindow_Dialog_CurrentPasswordTextField');
  const newPasswordField = document.getElementById('account_ChangePasswordWindow_Dialog_NewPasswordTextField');
  expect(currentPasswordField).toBeTruthy();
  expect(newPasswordField).toBeTruthy();

  await act(async () => {
    fireEvent.change(currentPasswordField, { target: { value: 'current' } });
    fireEvent.change(newPasswordField, { target: { value: 'new' } });
    await sleep(1000);
    fireEvent.click(saveButton);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toEqual(CHANGE_PASSWOD_URL);
  expect(fetch.mock.calls[0][1].method).toEqual('POST');
  expect(fetch.mock.calls[0][1].body).toEqual('new_password=new&current_password=current');
  expect(container.innerHTML).toContain('Password changed successfully!');
  expect(document.getElementById('general_items_CustomDialog_Dialog')).not.toBeTruthy();
});
