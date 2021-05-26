export const TASK_SET_CHANGE_PASSWORD_IS_OPEN = 'SET_CHANGE_PASSWORD_IS_OPEN';
export const TASK_SET_CHANGE_EMAIL_IS_OPEN = 'SET_CHANGE_EMAIL_IS_OPEN';
export const TASK_SET_CHANGE_USERNAME_IS_OPEN = 'SET_CHANGE_USERNAME_IS_OPEN';
export const TASK_SET_DELETE_USER_IS_OPEN = 'SET_DELETE_USER_IS_OPEN';

export function setChangePasswordIsOpenAction(status) {
  return {
    type: TASK_SET_CHANGE_PASSWORD_IS_OPEN,
    status,
  };
}

export function setChangeEmailIsOpenAction(status) {
  return {
    type: TASK_SET_CHANGE_EMAIL_IS_OPEN,
    status,
  };
}

export function setChangeUsernameIsOpenAction(status) {
  return {
    type: TASK_SET_CHANGE_USERNAME_IS_OPEN,
    status,
  };
}

export function setDeleteUserIsOpenAction(status) {
  return {
    type: TASK_SET_DELETE_USER_IS_OPEN,
    status,
  };
}
