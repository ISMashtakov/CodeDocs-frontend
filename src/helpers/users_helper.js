import { get, post } from './request_helper';
import { SERVER_URL } from '../constants';

export const MAIN_AUTH_URL = `${SERVER_URL}/auth`;
export const GET_USER_URL = `${MAIN_AUTH_URL}/users/me/`;
export const CHANGE_PASSWOD_URL = `${MAIN_AUTH_URL}/users/set_password/`;
export const CHANGE_EMAIL_URL = `${MAIN_AUTH_URL}/users/set_password/`;
export const CHANGE_USERNAME_URL = `${MAIN_AUTH_URL}/users/set_username/`;

class UsersApi {
  async getMe(user) {
    try {
      const result = await get(GET_USER_URL, undefined, user);
      return await result.json();
    } catch (err) {
      return null;
    }
  }

  async changePassword(user, currentPassword, newPassword) {
    const params = {
      new_password: newPassword,
      current_password: currentPassword,
    };
    try {
      const result = await post(CHANGE_PASSWOD_URL, params, user);
      switch (result.status) {
        case 400:
          return { reason: await result.json(), isGood: false };
        case 204:
          return { isGood: true };
        default:
          return { reason: {}, isGood: false };
      }
    } catch (err) {
      return { reason: {}, isGood: false };
    }
  }

  async changeUsername(user, username, password) {
    const params = {
      new_username: username,
      current_password: password,
    };
    try {
      const result = await post(CHANGE_USERNAME_URL, params, user);
      switch (result.status) {
        case 400:
          return { reason: await result.json(), isGood: false };
        case 204:
          return { isGood: true };
        default:
          return { reason: {}, isGood: false };
      }
    } catch (err) {
      return { reason: {}, isGood: false };
    }
  }

  async changeEMail(user, email) {
    const params = {
      new_email: email,
    };
    try {
      const result = await post(CHANGE_EMAIL_URL, params, user);
      switch (result.status) {
        case 400:
          return { reason: await result.json(), isGood: false };
        case 204:
          return { isGood: true };
        default:
          return { reason: {}, isGood: false };
      }
    } catch (err) {
      return { reason: {}, isGood: false };
    }
  }
}

const usersApi = new UsersApi();

export default usersApi;
