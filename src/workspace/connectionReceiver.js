import store from '../redux/store';
import {
  setFileAction, addActiveUserAction, deleteActiveUserAction,
  setActiveUsersAction, setAllUsersAction,
} from './actions';
import { setMainUserAction } from '../redux/actions';
import File from '../helpers/file';
import { User } from '../helpers/user';

// On start connection
function channelName(body) {
  const { generalData } = store.getState();
  generalData.mainUser.channel = body.channel_name;
  store.dispatch(setMainUserAction(generalData.mainUser));
}

function newUser(body) {
  const user = User.decodeDict(body);
  store.dispatch(addActiveUserAction(user));
}

// On end connection
function deleteUser(body) {
  const user = User.decodeDict(body);
  store.dispatch(deleteActiveUserAction(user));
}

// On requests
function fileInfo(body) {
  const file = File.dictEncode(body.file);
  store.dispatch(setFileAction(file));
  const { generalData } = store.getState();
  generalData.mainUser.access = body.file.access;
  store.dispatch(setMainUserAction(generalData.mainUser));
}

function setAllUsers(body) {
  const users = body.users.map((item) => User.decodeDict(item));
  store.dispatch(setAllUsersAction(users));
}

function setActiveUsers(body) {
  const users = body.users.map((item) => User.decodeDict(item));
  store.dispatch(setActiveUsersAction(users));
}

function fileSettings(body) {
  const file = File.dictEncode(body.file);
  store.dispatch(setFileAction(file));
}

const MESSAGE_ACTIONS = {
  channel_name: channelName,
  new_user: newUser,

  delete_user: deleteUser,

  file_info: fileInfo,
  file_settings: fileSettings,
  active_users: setActiveUsers,
  all_users: setAllUsers,
};

export default function receive(data) {
  if (data.type in MESSAGE_ACTIONS) {
    MESSAGE_ACTIONS[data.type](data);
  } else {
    console.error(`${data.type} unknown `);
  }
}
