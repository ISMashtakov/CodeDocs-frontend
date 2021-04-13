import { post } from './request_helper';
import { SERVER_URL, LOGIN_PAGE_NAME, ACCOUNT_PAGE_NAME } from '../constants';
import { openPage } from './general_helpers';

export const MAIN_AUTH_URL = `${SERVER_URL}/auth`;

export const LOG_IN_URL = `${MAIN_AUTH_URL}/jwt/create/`;
export const USER_ACTIVATE_URL = `${MAIN_AUTH_URL}/users/activation/`;
export const REFRESH_TOKEN_URL = `${MAIN_AUTH_URL}/jwt/refresh/`;
export const SIGN_UP_URL = `${MAIN_AUTH_URL}/users/`;
export const CHECK_USERNAME_URL = `${MAIN_AUTH_URL}/check_username/`;
export const CHECK_MAIL_URL = `${MAIN_AUTH_URL}/check_email/`;

const PAGE_AFTER_LOGIN_IN_LOCAL_STORAGE = 'PAGE_AFTER_LOGIN';

export function toLogin() {
  localStorage.setItem(PAGE_AFTER_LOGIN_IN_LOCAL_STORAGE, JSON.stringify({
    pathname: window.location.pathname,
    search: window.location.search,
  }));
  openPage(`/${LOGIN_PAGE_NAME}`);
}

export function getAfterLoginPage() {
  const page = localStorage.getItem(PAGE_AFTER_LOGIN_IN_LOCAL_STORAGE);
  if (page) {
    const data = JSON.parse(page);
    return data.pathname + data.search;
  }
  return `/${ACCOUNT_PAGE_NAME}`;
}

export function deleteAfterLoginPage() {
  localStorage.removeItem(PAGE_AFTER_LOGIN_IN_LOCAL_STORAGE);
}

class AuthApi {
  async checkUsername(username) {
    const params = {
      username: username.trim(),
    };
    try {
      const result = await post(CHECK_USERNAME_URL, params);
      switch (result.status) {
        case 409:
          return await result.text();
        default:
          return '';
      }
    } catch (err) {
      return '';
    }
  }

  async checkMail(mail) {
    const params = {
      email: mail.trim(),
    };
    try {
      const result = await post(CHECK_MAIL_URL, params);
      switch (result.status) {
        case 409:
          return await result.text();
        default:
          return '';
      }
    } catch (err) {
      return '';
    }
  }

  async signUp(username, mail, password) {
    const params = {
      username,
      email: mail,
      password,
    };
    try {
      const result = await post(SIGN_UP_URL, params);
      switch (result.status) {
        case 400:
          return { ...(await result.json()), isGood: false };
        case 500:
          if ((await result.text()).includes('Message was not accepted -- invalid mailbox.')) {
            return { email: ['Email not exist'], isGood: false };
          }

          return { isGood: false };

        case 201:
          return { ...(await result.json()), isGood: true };
        default:
          return { isGood: false };
      }
    } catch (err) {
      return { isGood: false };
    }
  }

  async logIn(username, password) {
    const params = {
      username,
      password,
    };
    try {
      const result = await post(LOG_IN_URL, params);
      switch (result.status) {
        case 401:
          return { problem: 'No active account found with the given credentials', isGood: false };
        case 200:
          return { ...(await result.json()), isGood: true };
        default:
          return { isGood: false };
      }
    } catch (err) {
      return { isGood: false };
    }
  }

  async refreshTokens(refreshToken) {
    const params = {
      refresh: refreshToken,
    };
    try {
      const result = await post(REFRESH_TOKEN_URL, params);
      return await result.json();
    } catch (err) {
      return null;
    }
  }

  async activateUser(uid, token) {
    const params = {
      uid,
      token,
    };
    try {
      const result = await post(USER_ACTIVATE_URL, params);
      switch (result.status) {
        case 204:
          return { isGood: true };
        case 400:
          return { ...(await result.json()), isGood: false };
        default:
          return { isGood: false };
      }
    } catch (err) {
      return { isGood: false };
    }
  }
}

const authApi = new AuthApi();

export default authApi;
