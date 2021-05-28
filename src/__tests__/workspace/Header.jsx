import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import store from '../../redux/store';
import CustomSnackbarProvider from '../../general_items/SnackbarProvider';
import Header from '../../workspace/Header';
import { setFileAction, setActiveUsersAction } from '../../workspace/actions';
import { CREATE_FILE_URL } from '../../helpers/users_helper';
import { setMainUserAction } from '../../redux/actions';
import File from '../../helpers/file';
import {
  getFetchWithJsonParams, simpleFetch, queueMocks, getFetchWithTextParams,
} from '../../__test_helpers__/mocks';
import { sleep } from '../../__test_helpers__/help_funcs';
import {
  getTestUser, getFileJson,
} from '../../__test_helpers__/data';
import { getNewUserMessage } from '../../__test_helpers__/messagesData';
import * as generalHelpers from '../../helpers/general_helpers';
import * as connectionActions from '../../workspace/connectionActions';
import * as auth from '../../helpers/auth_helper';
import receive from '../../workspace/connectionReceiver';

let container = null;

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(simpleFetch());
  jest.spyOn(generalHelpers, 'openPage').mockImplementation(simpleFetch());
  jest.spyOn(auth, 'toLogin').mockImplementation(simpleFetch());
  container = document.createElement('div');
  document.body.appendChild(container);
  store.dispatch(setMainUserAction(getTestUser()));
  store.dispatch(setActiveUsersAction([]));
  store.dispatch(setFileAction(File.dictEncode(getFileJson())));
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  global.fetch.mockRestore();
  generalHelpers.openPage.mockRestore();
  auth.toLogin.mockRestore();

  store.dispatch(setMainUserAction(null));
  store.dispatch(setFileAction(null));
});

it('Header render good', async () => {
  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <Header />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(1000);
  });

  expect(document.getElementById('workspace_Header')).toBeTruthy();

  expect(document.getElementById('workspace_Header_logo')).toBeTruthy();
  expect(document.getElementById('workspace_Header_userAvatars')).toBeTruthy();

  expect(document.getElementById('workspace_Header_NewButton')).toBeTruthy();
  expect(document.getElementById('workspace_Header_RunButton')).toBeTruthy();
  expect(document.getElementById('workspace_Header_DownloadButton')).toBeTruthy();
  expect(document.getElementById('workspace_Header_SettingsButton')).toBeTruthy();
  expect(document.getElementById('workspace_Header_ShareButton')).toBeTruthy();
  expect(document.getElementById('workspace_Header_MyAvatar')).toBeTruthy();

  let filename = document.getElementById('workspace_Header_filename');
  expect(filename).toBeTruthy();
  expect(filename.innerText).toEqual(getFileJson().name);

  await act(async () => {
    store.dispatch(setFileAction(null));
    sleep(100);
  });

  filename = document.getElementById('workspace_Header_filename');
  expect(filename).toBeTruthy();
  expect(filename.innerHTML).toContain('Unknown');
});

it('New file good', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(queueMocks([
    getFetchWithJsonParams(getFileJson()),
    getFetchWithTextParams('link', 200),
  ]));
  const openPage = jest.spyOn(generalHelpers, 'openPage').mockImplementation(simpleFetch());

  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <Header />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(500);
  });

  const newButton = document.getElementById('workspace_Header_NewButton');
  await act(async () => {
    fireEvent.click(newButton);
    await sleep(500);
  });

  const dialog = document.getElementById('general_items_CustomDialog_Dialog');
  expect(dialog).toBeTruthy();

  const saveButton = document.getElementById('general_items_CustomDialog_Dialog_ActionButton');
  expect(saveButton).toBeTruthy();

  await act(async () => {
    fireEvent.click(saveButton);
    await sleep(500);
  });

  expect(container.innerHTML).toContain('Filename can not be empty');

  const textField = document.getElementById('workspace_Header_CreateFileDialog_createTextField');
  expect(textField).toBeTruthy();
  await act(async () => {
    fireEvent.change(textField, { target: { value: 'new_filename' } });
    await sleep(500);
    fireEvent.click(saveButton);
    await sleep(500);
  });

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[0][0]).toEqual(CREATE_FILE_URL);
  expect(fetch.mock.calls[0][1].method).toEqual('POST');
  expect(fetch.mock.calls[0][1].body).toEqual('name=new_filename&programming_language=python');

  expect(openPage).toBeCalledTimes(1);
});

it('Settings good', async () => {
  const sendFileSettings = jest.spyOn(connectionActions, 'sendFileSettings').mockImplementation(simpleFetch());

  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <Header />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(100);
  });

  const settingsButton = document.getElementById('workspace_Header_SettingsButton');
  await act(async () => {
    fireEvent.click(settingsButton);
    await sleep(500);
  });

  const settingsButton2 = document.getElementById('workspace_Header_SettingsPopover_ChangeFileButton');
  expect(settingsButton2).toBeTruthy();
  await act(async () => {
    fireEvent.click(settingsButton2);
    await sleep(500);
  });

  let dialog = document.getElementById('general_items_CustomDialog_Dialog');
  expect(dialog).toBeTruthy();

  const saveButton = document.getElementById('general_items_CustomDialog_Dialog_ActionButton');
  expect(saveButton).toBeTruthy();

  const textField = document.getElementById('workspace_Header_FileSettingsDialog_fileTextField');

  expect(textField).toBeTruthy();
  expect(textField.value).toEqual(getFileJson().file.name);

  await act(async () => {
    fireEvent.change(textField, { target: { value: '' } });
    await sleep(100);
    fireEvent.click(saveButton);
    await sleep(500);
  });

  expect(container.innerHTML).toContain('Filename can not be empty');

  await act(async () => {
    fireEvent.change(textField, { target: { value: 'new_filename' } });
    await sleep(100);
    fireEvent.click(saveButton);
    await sleep(500);
  });

  expect(sendFileSettings).toBeCalledTimes(1);
  expect(sendFileSettings.mock.calls[0]).toEqual(['new_filename', getFileJson().file.programming_language]);

  dialog = document.getElementById('general_items_CustomDialog_Dialog');
  expect(dialog).not.toBeTruthy();

  connectionActions.sendFileSettings.mockRestore();
});

it('To profile button good', async () => {
  const openPage = jest.spyOn(generalHelpers, 'openPage').mockImplementation(simpleFetch());

  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <Header />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(500);
  });

  const mainAvatar = document.getElementById('workspace_Header_MyAvatar');
  await act(async () => {
    fireEvent.click(mainAvatar);
    await sleep(500);
  });

  const profileButton = document.getElementById('workspace_Header_mainAvatarPopover_ViewProfileButton');
  expect(profileButton).toBeTruthy();
  await act(async () => {
    fireEvent.click(profileButton);
    await sleep(500);
  });

  expect(openPage).toBeCalledTimes(1);
});

it('Logout button good', async () => {
  const toLogin = jest.spyOn(auth, 'toLogin').mockImplementation(simpleFetch());

  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <Header />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(500);
  });

  const mainAvatar = document.getElementById('workspace_Header_MyAvatar');
  await act(async () => {
    fireEvent.click(mainAvatar);
    await sleep(500);
  });

  const logoutButton = document.getElementById('workspace_Header_mainAvatarPopover_LogoutButton');
  expect(logoutButton).toBeTruthy();
  await act(async () => {
    fireEvent.click(logoutButton);
    await sleep(500);
  });

  expect(toLogin).toBeCalledTimes(1);
});

it('User avatars check', async () => {
  await act(async () => {
    render(
      <CustomSnackbarProvider>
        <Provider store={store}>
          <Header />
        </Provider>
      </CustomSnackbarProvider>, container,
    );
    await sleep(500);
  });

  const usersDiv = document.getElementById('workspace_Header_userAvatars');

  expect(usersDiv.children.length).toEqual(0);

  await act(async () => {
    receive(getNewUserMessage('username_1'));
    await sleep(500);
  });

  expect(usersDiv.children.length).toEqual(1);

  expect(document.getElementById('workspace_Header_userAvatar_username_1')).toBeTruthy();

  await act(async () => {
    receive(getNewUserMessage('username_2'));
    await sleep(500);
  });

  expect(usersDiv.children.length).toEqual(2);
  expect(document.getElementById('workspace_Header_userAvatar_username_1')).toBeTruthy();
  expect(document.getElementById('workspace_Header_userAvatar_username_2')).toBeTruthy();

  await act(async () => {
    store.dispatch(setActiveUsersAction([]));
    await sleep(500);
  });

  expect(usersDiv.children.length).toEqual(0);
  expect(document.getElementById('workspace_Header_userAvatar_username_1')).not.toBeTruthy();
  expect(document.getElementById('workspace_Header_userAvatar_username_2')).not.toBeTruthy();
});
