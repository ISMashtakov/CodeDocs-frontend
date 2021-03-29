import pythonIcon from '../images/icons/language_python_icon.png';
import haskellIcon from '../images/icons/language_haskell_icon.png';

export const ACCESS_TYPES = {
  OWNER: 'Owner',
  VIEWER: 'Viewer',
  EDITOR: 'Editor',
};

const LANGUAGE_ICON = {
  python: pythonIcon,
  js: haskellIcon,
};

const ACCESS_TYPES_NUMBER_TO_STRING = {
  0: ACCESS_TYPES.VIEWER,
  1: ACCESS_TYPES.EDITOR,
  2: ACCESS_TYPES.OWNER,
};

export default class File {
  constructor() {
    this.id = null;
    this.name = null;
    this.language = null;
    this.access = null;
  }

  static dictEncode(dict) {
    const file = new File();
    file.id = dict.file.id;
    file.name = dict.file.name;
    file.language = dict.file.programming_language;
    file.access = ACCESS_TYPES_NUMBER_TO_STRING[dict.access];
    return file;
  }

  get isOwner() {
    return this.access === ACCESS_TYPES.OWNER;
  }

  get icon() {
    return LANGUAGE_ICON[this.language];
  }
}
