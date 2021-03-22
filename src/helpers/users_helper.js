import { get } from './request_helper';
import { SERVER_URL } from '../constants';

const MAIN_AUTH_URL = `${SERVER_URL}/auth`;
const GET_USER_URL = `${MAIN_AUTH_URL}/users/me/`;

class UsersApi {
  async getMe(user) {
    try {
      const result = await get(GET_USER_URL, undefined, user);
      return await result.json();
    } catch (err) {
      return null;
    }
  }
}

const usersApi = new UsersApi();

export default usersApi;
