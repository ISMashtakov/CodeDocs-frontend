import { MainUser } from '../helpers/user';

export function getTestUser() {
  const testUser = new MainUser();
  testUser.username = 'test_username';
  testUser.mail = 'test_mail';
  testUser.accessToken = 'test_access';
  testUser.refreshToken = 'test_refresh';
  testUser.color = '#FF0000';
  testUser.isValid = () => Promise.resolve(true);
  testUser.updateInfoFromServer = () => Promise.resolve(true);
  testUser.loadFromLocalStorage = () => {};
  return testUser;
}

export function getFileJson(id = 0, name = 'filename', language = 'python', access = 2) {
  return { access, file: { id, name, programming_language: language } };
}

export const FILES_LIST = [
  getFileJson(),
  getFileJson(1, 'filename1'),
  getFileJson(2, 'filename2'),
  getFileJson(3, 'filename3'),
];
