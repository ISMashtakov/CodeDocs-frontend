import pythonIcon from '../images/icons/language_python_icon.png';
import haskellIcon from '../images/icons/language_haskell_icon.png';
import { openPage } from './general_helpers';
import usersApi from './users_helper';

export const ACCESS_TYPES = {
  OWNER: 2,
  VIEWER: 0,
  EDITOR: 1,
};

export const LANGUAGE_NAME = {
  python: 'Python3',
  js: 'JS',
};

export const ACCESS_TYPES_STRINGS = {
  OWNER: 'Owner',
  VIEWER: 'Viewer',
  EDITOR: 'Editor',
};

export const LANGUAGE_ICON = {
  python: pythonIcon,
  js: haskellIcon,
};

export const ACCESS_TYPES_NUMBER_TO_STRING = {
  0: ACCESS_TYPES_STRINGS.VIEWER,
  1: ACCESS_TYPES_STRINGS.EDITOR,
  2: ACCESS_TYPES_STRINGS.OWNER,
};

export default class File {
  constructor(id, name, language, access, defaultAccess) {
    this.id = id;
    this.name = name;
    this.language = language;
    this.access = access;
    this.defaultAccess = defaultAccess;
  }

  static dictEncode(dict) {
    return new File(
      dict.file.id,
      dict.file.name,
      dict.file.programming_language,
      dict.access,
      dict.link_access,
    );
  }

  get isOwner() {
    return this.access === ACCESS_TYPES.OWNER;
  }

  get icon() {
    return LANGUAGE_ICON[this.language];
  }

  async open(user) {
    const response = await usersApi.getFileLink(this.id, user);
    if (response.isGood) {
      openPage(response.link);
    }
  }
}
