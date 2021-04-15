import connection from './Connection';

export function requestFileInfo() {
  const data = JSON.stringify({ type: 'file_info' });
  connection.send(data);
}

export function requestActiveUsers() {
  const data = JSON.stringify({ type: 'active_users' });
  connection.send(data);
}

export function requestAllUsers() {
  const data = JSON.stringify({ type: 'all_users' });
  connection.send(data);
}

export function sendFileSettings(filename, language) {
  const data = JSON.stringify({
    type: 'change_file_config',
    config: {
      name: filename,
      programming_language: language,
    },
  });
  connection.send(data);
}

export function changeLinkAccess(access) {
  const data = JSON.stringify({
    type: 'change_link_access',
    new_access: access,
  });
  connection.send(data);
}

export function changeUserAccess(id, access) {
  const data = JSON.stringify({
    type: 'change_user_access',
    new_access: access * 1,
    another_user_id: id,
  });
  connection.send(data);
}

export function sendOperationMessage(operation, revision) {
  const data = JSON.stringify({
    type: 'operation',
    revision,
    operation: operation.getMessage(),
  });
  connection.send(data);
}

export function requestOperationHistory(revision) {
  const data = JSON.stringify({
    type: 'operation_history',
    revision,
  });
  connection.send(data);
}
