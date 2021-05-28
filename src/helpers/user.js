import authApi from './auth_helper';
import usersApi from './users_helper';
import File, { ACCESS_TYPES } from './file';

const USER_SETTING_IN_LOCALSTORAGE = 'USER_SETTINGS';

export class User {
  constructor() {
    this.id = null;
    this.color = null;
    this.username = null;
    this.mail = null;
    this.access = null;
  }

  get shortName() {
    return this.username[0];
  }

  get shortMail() {
    if (!this.mail) return this.mail;

    if (this.mail.length > 20) {
      return `${this.mail.slice(0, 20)}...`;
    }
    return this.mail;
  }

  get isOwner() {
    return this.access === ACCESS_TYPES.OWNER;
  }

  get isEditor() {
    return this.access === ACCESS_TYPES.EDITOR;
  }

  get isViewer() {
    return this.access === ACCESS_TYPES.VIEWER;
  }

  static decodeDict(data) {
    const returnUser = new User();
    const { user, access } = data;
    returnUser.access = access;
    returnUser.id = user.id;
    returnUser.username = user.username;
    returnUser.mail = user.email;
    returnUser.color = user.account_color;

    return returnUser;
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
    this.files = null;
    this.channel = null;
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
    const result = await usersApi.getMe(this);
    if (result.isGood) {
      this.color = result.data.account_color;
      this.username = result.data.username;
      this.mail = result.data.email;
      return true;
    }
    return false;
  }

  async updateFilesFromServer() {
    const data = await usersApi.getMyFiles(this);
    if (data) {
      this.files = data.map((item) => File.dictEncode(item));
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

  get filesIsUpdated() {
    return this.files !== null;
  }

  get myFiles() {
    if (this.filesIsUpdated) return this.files.filter((item) => item.isOwner);
    return null;
  }

  addFile(id, filename, language) {
    const file = new File(id, filename, language, ACCESS_TYPES.OWNER);
    if (this.filesIsUpdated) {
      this.files.push(file);
    }
  }

  get filesLength() {
    if (this.filesIsUpdated) return this.files.length;
    return 0;
  }

  deleteFile(id) {
    if (this.filesIsUpdated) {
      this.files = this.files.filter((item) => item.id !== id);
    }
  }
}
