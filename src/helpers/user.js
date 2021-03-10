import authApi from './auth_helper';

const USER_SETTING_IN_LOCALSTORAGE = 'USER_SETTINGS';

export class User {
  constructor() {
    this.color = null;
    this.username = null;
    this.shortName = null;
  }

  toDict() {
    return {
      color: this.color,
      username: this.username,
      shortName: this.shortName,
    };
  }
}

export class MainUser extends User {
  constructor() {
    super();
    this.accessToken = null;
    this.refreshToken = null;
  }

  toDict() {
    return {
      color: this.color,
      username: this.username,
      shortName: this.shortName,
    };
  }

  saveToLocalStorage() {
    localStorage.setItem(USER_SETTING_IN_LOCALSTORAGE, JSON.stringify(this));
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem(USER_SETTING_IN_LOCALSTORAGE);
    if (data) {
      this.color = data.color;
      this.username = data.username;
      this.shortName = data.shortName;
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
    }
  }

  async refreshTokens() {
    if (this.refreshToken) {
      const data = await authApi.refreshTokens(this.refreshToken);
      if (data) {
        this.accessToken = data.access;
        this.refreshToken = data.refresh;
      }
    }
  }

  async update() {
    if (this.accessToken) {
      const data = await authApi.getUser(this.accessToken);
      console.log(data);
      if (data) {
        this.color = data.account_color;
        this.username = data.username;
        this.shortName = data.shortName;
      }
    }
  }
}
