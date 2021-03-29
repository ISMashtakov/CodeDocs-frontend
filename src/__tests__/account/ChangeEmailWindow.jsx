import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import store from '../../redux/store';
import ChangeEmailWindow from '../../account/ChangeEmailWindow';
import CustomSnackbarProvider from '../../general_items/SnackbarProvider';
import { setChangeEmailIsOpenAction } from '../../account/actions';
import { setMainUserAction } from '../../redux/actions';
import {
  getFetchWithJsonParams, simpleFetch,
} from '../../__test_helpers__/mocks';
import { sleep } from '../../__test_helpers__/help_funcs';
import { GET_USER_URL } from '../../helpers/users_helper';
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
  store.dispatch(setChangeEmailIsOpenAction(false));
  store.dispatch(setMainUserAction(null));
});

it('ChangeEmailWindow render good', async () => {
  act(() => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangeEmailWindow />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
  });

  expect(document.getElementById('general_items_CustomDialog_Dialog')).not.toBeTruthy();
  await act(async () => {
    store.dispatch(setChangeEmailIsOpenAction(true));
    await sleep(1000);
  });
  expect(document.getElementById('general_items_CustomDialog_Dialog')).toBeTruthy();

  expect(
    document.getElementById('account_ChangeEmailWindow_Dialog_EmailTextField'),
  ).toBeTruthy();

  expect(document.getElementById('general_items_CustomDialog_Dialog_ActionButton')).toBeTruthy();
  const cancelButton = document.getElementById('general_items_CustomDialog_Dialog_CancelButton');
  expect(cancelButton).toBeTruthy();

  await act(async () => {
    fireEvent.click(cancelButton);
    await sleep(1000);
  });

  expect(document.getElementById('general_items_CustomDialog_Dialog')).not.toBeTruthy();
});

it('ChangeEmailWindow bad save', async () => {
  const fetch = jest.spyOn(global, 'fetch')
    .mockImplementation(getFetchWithJsonParams({ email: 'email problem' }, 400));

  await act(async () => {
    store.dispatch(setChangeEmailIsOpenAction(true));
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangeEmailWindow />
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
  expect(document.getElementById('general_items_CustomDialog_Dialog')
    .innerHTML).toContain('email problem');
});

it('ChangeEmailWindow good save', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams({}, 200));

  await act(async () => {
    store.dispatch(setChangeEmailIsOpenAction(true));
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <ChangeEmailWindow />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const saveButton = document.getElementById('general_items_CustomDialog_Dialog_ActionButton');

  const emailField = document.getElementById('account_ChangeEmailWindow_Dialog_EmailTextField');
  expect(emailField).toBeTruthy();

  await act(async () => {
    fireEvent.change(emailField, { target: { value: 'email' } });
    await sleep(1000);
    fireEvent.click(saveButton);
    await sleep(1000);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toEqual(GET_USER_URL);
  expect(fetch.mock.calls[0][1].method).toEqual('PATCH');
  expect(fetch.mock.calls[0][1].body).toEqual('email=email');
  expect(container.innerHTML).toContain('Email changed successfully!');
  expect(document.getElementById('general_items_CustomDialog_Dialog')).not.toBeTruthy();
});
