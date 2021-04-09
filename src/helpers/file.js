import pythonIcon from '../images/icons/language_python_icon.png';
import haskellIcon from '../images/icons/language_haskell_icon.png';
import { openPage } from './general_helpers';

export const LANGUAGE_NAME = {
  python: 'Python3',
  js: 'JS',
};

export const ACCESS_TYPES = {
  OWNER: 'Owner',
  VIEWER: 'Viewer',
  EDITOR: 'Editor',
};

export const LANGUAGE_ICON = {
  python: pythonIcon,
  js: haskellIcon,
};

export const ACCESS_TYPES_NUMBER_TO_STRING = {
  0: ACCESS_TYPES.VIEWER,
  1: ACCESS_TYPES.EDITOR,
  2: ACCESS_TYPES.OWNER,
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
      ACCESS_TYPES_NUMBER_TO_STRING[dict.access],
      0,
    );
  }

  get isOwner() {
    return this.access === ACCESS_TYPES.OWNER;
  }

  get icon() {
    return LANGUAGE_ICON[this.language];
  }

  open() {
    const link = `http://localhost:3000/file/${this.name}/`;
    openPage(link);
  }
}
