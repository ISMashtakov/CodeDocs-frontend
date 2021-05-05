import store from '../redux/store';
import {
  setFileAction, addActiveUserAction, deleteActiveUserAction,
  setActiveUsersAction, setAllUsersAction, addUserAction,
} from './actions';
import { setMainUserAction } from '../redux/actions';
import File from '../helpers/file';
import { User } from '../helpers/user';
import { getOperationByMessage } from './operations';

export const textEditor = [];

// On start connection
function channelName(body) {
  const { generalData } = store.getState();
  generalData.mainUser.channel = body.channel_name;
  store.dispatch(setMainUserAction(generalData.mainUser));
}

function newUser(body) {
  const { generalData } = store.getState();
  const user = User.decodeDict(body.user);
  if (user.username === generalData.mainUser.username) {
    generalData.mainUser.access = user.access;
    store.dispatch(setMainUserAction(generalData.mainUser));
  } else {
    store.dispatch(addActiveUserAction(user));
  }

  store.dispatch(addUserAction(user));
}

// On end connection
function deleteUser(body) {
  const user = User.decodeDict(body);
  store.dispatch(deleteActiveUserAction(user));
}

// On requests
function fileInfo(body) {
  const file = File.dictEncode(body);
  textEditor[0].text = body.file.content;
  textEditor[0].revision = body.file.last_revision;
  store.dispatch(setFileAction(file));
}

function setAllUsers(body) {
  const users = body.users.map((item) => User.decodeDict(item));
  store.dispatch(setAllUsersAction(users));
}

function setActiveUsers(body) {
  const { generalData } = store.getState();
  let users = body.users.map((item) => User.decodeDict(item));
  users = users.filter((user) => user.username !== generalData.mainUser.username);
  store.dispatch(setActiveUsersAction(users));
}

function fileSettings(body) {
  const file = File.dictEncode(body);
  store.dispatch(setFileAction(file));
}

function changeLinkAccess(body) {
  const { documentData } = store.getState();
  documentData.file.defaultAccess = body.new_access;
  store.dispatch(setFileAction(documentData.file));
}

function changeUserAccess(body) {
  const { generalData, documentData } = store.getState();
  const user = User.decodeDict(body.user);
  if (user.username === generalData.mainUser.username) {
    generalData.mainUser.access = user.access;
    store.dispatch(setMainUserAction(generalData.mainUser));
    textEditor[0].showedNotification = false;
  } else {
    const users = documentData.activeUsers.map((item) => (
      (item.username === user.username) ? user : item));
    store.dispatch(setActiveUsersAction(users));
  }
  const users = documentData.allUsers.map((item) => (
    (item.username === user.username) ? user : item));
  store.dispatch(setAllUsersAction(users));
}

function newOperation(body) {
  const { generalData } = store.getState();
  textEditor[0].receiveOperation(
    getOperationByMessage(body.operation),
    body.operation.revision,
    body.operation.channel_name === generalData.mainUser.channel,
  );
}

function operationHistory(body) {
  const { generalData } = store.getState();
  body.operations.forEach((item) => {
    textEditor[0].receiveOperation(
      getOperationByMessage(item.operation),
      item.operation.revision,
      item.operation.channel_name === generalData.mainUser.channel,
    );
  });
}

const MESSAGE_ACTIONS = {
  channel_name: channelName,
  new_user: newUser,

  delete_user: deleteUser,

  file_info: fileInfo,
  change_file_config: fileSettings,
  active_users: setActiveUsers,
  all_users: setAllUsers,
  change_link_access: changeLinkAccess,
  change_user_access: changeUserAccess,
  apply_operation: newOperation,
  operation_history: operationHistory,
};

export const history = [];
export default function receive(data) {
  history.push(data);
  if (data.type in MESSAGE_ACTIONS) {
    MESSAGE_ACTIONS[data.type](data);
  } else {
    // console.error(`${data.type} unknown `); TODO DELETE IT
  }
}
