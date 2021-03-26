import { MainUser } from '../helpers/user';

export const testUser = new MainUser();
testUser.username = 'test_username';
testUser.mail = 'test_mail';
testUser.accessToken = 'test_access';
testUser.refreshToken = 'test_refresh';
testUser.color = '#FF0000';
testUser.isValid = () => Promise.resolve(true);
testUser.updateInfoFromServer = () => Promise.resolve(true);
testUser.loadFromLocalStorage = () => {};
