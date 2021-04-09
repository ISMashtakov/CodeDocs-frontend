import { getFileJson } from './data';

export function getNewUserMessage(channel_name = '0') {
  return {
    type: 'new_user',
    channel_name,
    user: {
      access: 0,
      user: {
        id: 0,
        username: 'username',
        email: 'email',
        account_color: 'red',
      },
    },
  };
}

export function getFileInfoMessage() {
  return {
    type: 'file_info',
    file: getFileJson(),
  };
}

export function getAllUsersMessage() {
  return {
    type: 'all_users',
    users: [
      getNewUserMessage(0),
      getNewUserMessage(1),
      getNewUserMessage(2),
    ],
  };
}
