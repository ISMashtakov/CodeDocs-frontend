import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import store from '../../redux/store';
import CustomSnackbarProvider from '../../general_items/SnackbarProvider';
import AccountPage from '../../account/AccountPage';
import { setChangePasswordIsOpenAction, setChangeEmailIsOpenAction, setChangeUsernameIsOpenAction } from '../../account/actions';
import { setMainUserAction } from '../../redux/actions';
import { getFetchWithJsonParams, simpleFetch, queueMocks } from '../../__test_helpers__/mocks';
import { sleep, acceptDialog } from '../../__test_helpers__/help_funcs';
import { getTestUser, FILES_LIST, getFileJson } from '../../__test_helpers__/data';
import * as auth from '../../helpers/auth_helper';

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
  store.dispatch(setMainUserAction(null));
  store.dispatch(setChangePasswordIsOpenAction(false));
  store.dispatch(setChangeEmailIsOpenAction(false));
  store.dispatch(setChangeUsernameIsOpenAction(false));
});

it('AccountPage render good', async () => {
  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  expect(document.getElementById('account_AccountPage_div')).toBeTruthy();

  expect(document.getElementById('account_AccountPage_AccountCard_div')).toBeTruthy();

  expect(document.getElementById('account_AccountPage_AccountCard_usernameButton')).toBeTruthy();
  expect(document.getElementById('account_AccountPage_AccountCard_emailButton')).toBeTruthy();
  expect(document.getElementById('account_AccountPage_AccountCard_passwordButton')).toBeTruthy();
  expect(document.getElementById('account_AccountPage_AccountCard_logoutButton')).toBeTruthy();
  expect(document.getElementById('account_AccountPage_AccountCard_deleteButton')).toBeTruthy();

  expect(document.getElementById('account_AccountPage_FilesPanel_div')).toBeTruthy();
  expect(document.getElementById('account_AccountPage_FilesPanel_filetypesDiv')).toBeTruthy();
  expect(document.getElementById('account_AccountPage_FilesPanel_BoxWithTable')).toBeTruthy();
  expect(document.getElementById('account_AccountPage_FilesPanel_filenameTextField')).toBeTruthy();
  expect(document.getElementById('account_AccountPage_FilesPanel_createFileButton')).toBeTruthy();
});

it('AccountPage open change username', async () => {
  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const usernameButton = document.getElementById('account_AccountPage_AccountCard_usernameButton');

  await act(async () => {
    fireEvent.click(usernameButton);
    await sleep(500);
  });

  expect(store.getState().accountData.changeUsernameWindowIsOpen).toEqual(true);
});

it('AccountPage open change email', async () => {
  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const emailButton = document.getElementById('account_AccountPage_AccountCard_emailButton');

  await act(async () => {
    fireEvent.click(emailButton);
    await sleep(500);
  });

  expect(store.getState().accountData.changeMailWindowIsOpen).toEqual(true);
});

it('AccountPage open change password', async () => {
  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const passwordButton = document.getElementById('account_AccountPage_AccountCard_passwordButton');

  await act(async () => {
    fireEvent.click(passwordButton);
    await sleep(500);
  });

  expect(store.getState().accountData.changePasswordWindowIsOpen).toEqual(true);
});

it('AccountPage logout', async () => {
  const toLogin = jest.spyOn(auth, 'toLogin').mockImplementation(simpleFetch());

  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  const logoutButton = document.getElementById('account_AccountPage_AccountCard_logoutButton');

  await act(async () => {
    fireEvent.click(logoutButton);
    await sleep(1000);
  });

  expect(toLogin).toBeCalledTimes(1);

  auth.toLogin.mockRestore();
});

it('AccountPage render files', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(getFetchWithJsonParams(FILES_LIST));

  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  expect(fetch).toBeCalledTimes(1);

  const boxWithTable = document.getElementById('account_AccountPage_FilesPanel_BoxWithTable');
  const rows = boxWithTable.querySelectorAll('tr');
  expect(rows.length).toEqual(FILES_LIST.length);
  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('td');
    expect(cells[1].innerHTML).toContain(FILES_LIST[i].file.name);
    expect(cells[2].innerHTML).toContain(FILES_LIST[i].file.programming_language);
  });
});

it('AccountPage delete file', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(queueMocks([
    getFetchWithJsonParams(FILES_LIST),
    getFetchWithJsonParams({}, 200),
  ]));

  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  expect(fetch).toBeCalledTimes(1);

  const boxWithTable = document.getElementById('account_AccountPage_FilesPanel_BoxWithTable');
  const deleteButton = boxWithTable.querySelectorAll('tr')[0].querySelector('button');
  await act(async () => {
    fireEvent.click(deleteButton);
    await sleep(500);
    await acceptDialog();
    await sleep(500);
  });

  expect(fetch.mock.calls[1][1].body).toEqual('file_id=0');

  const rows = document.getElementById('account_AccountPage_FilesPanel_BoxWithTable').querySelectorAll('tr');
  expect(rows.length).toEqual(FILES_LIST.length - 1);
  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('td');
    expect(cells[1].innerHTML).toContain(FILES_LIST[i + 1].file.name);
    expect(cells[2].innerHTML).toContain(FILES_LIST[i + 1].file.programming_language);
  });

  expect(store.getState().generalData.mainUser.files.length).toEqual(FILES_LIST.length - 1);
});

it('AccountPage create file', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(queueMocks([
    getFetchWithJsonParams(FILES_LIST),
    getFetchWithJsonParams({ id: 15 }, 200),
  ]));

  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <AccountPage />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  expect(fetch).toBeCalledTimes(1);

  const filenameTextField = document.getElementById('account_AccountPage_FilesPanel_filenameTextField');
  const createButton = document.getElementById('account_AccountPage_FilesPanel_createFileButton');
  await act(async () => {
    fireEvent.change(filenameTextField, { target: { value: 'new_filename' } });
    await sleep(500);
    fireEvent.click(createButton);
    await sleep(1000);
  });
  expect(fetch.mock.calls[1][1].body).toEqual('filename=new_filename&programming_language=python');

  const NEW_FILES = FILES_LIST.concat([getFileJson(15, 'new_filename')]);

  const rows = document.getElementById('account_AccountPage_FilesPanel_BoxWithTable').querySelectorAll('tr');
  expect(rows.length).toEqual(NEW_FILES.length);
  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('td');
    expect(cells[1].innerHTML).toContain(NEW_FILES[i].file.name);
    expect(cells[2].innerHTML).toContain(NEW_FILES[i].file.programming_language);
  });

  expect(store.getState().generalData.mainUser.files.length).toEqual(NEW_FILES.length);
});
