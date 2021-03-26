import authApi from './auth_helper';
import usersApi from './users_helper';

const USER_SETTING_IN_LOCALSTORAGE = 'USER_SETTINGS';

export class User {
  constructor() {
    this.color = null;
    this.username = null;
    this.mail = null;
  }

  get shortName() {
    return this.username[0];
  }

  toDict() {
    return {
      color: this.color,
      main: this.main,
      username: this.username,
    };
  }
}

export class MainUser extends User {
  constructor() {
    super();
    this.accessToken = null;
    this.refreshToken = null;
    this.lastValidCheckDate = null;
  }

  saveToLocalStorage() {
    localStorage.setItem(USER_SETTING_IN_LOCALSTORAGE,
      JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
      }));
  }

  loadFromLocalStorage() {
    const text = localStorage.getItem(USER_SETTING_IN_LOCALSTORAGE);
    if (text) {
      const data = JSON.parse(text);
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
    }
  }

  deleteFromLocalStorage() {
    localStorage.removeItem(USER_SETTING_IN_LOCALSTORAGE);
  }

  async refreshTokens() {
    if (this.refreshToken) {
      const data = await authApi.refreshTokens(this.refreshToken);
      if (data) {
        this.accessToken = data.access;
        this.refreshToken = data.refresh;
        this.saveToLocalStorage();
      }
    }
  }

  async updateInfoFromServer() {
    const data = await usersApi.getMe(this);
    if (data) {
      this.color = data.account_color;
      this.username = data.username;
      this.mail = data.email;
      return true;
    }
    return false;
  }

  async isValid() {
    if (this.lastValidCheckDate && (new Date() - this.lastValidCheckDate) / 1000 / 60 < 5) {
      return true;
    }
    if (this.accessToken && this.refreshToken) {
      const status = await this.updateInfoFromServer();
      this.lastValidCheckDate = new Date();
      return status;
    }
    return false;
  }
}
