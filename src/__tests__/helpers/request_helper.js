import { get, post } from '../../helpers/request_helper';
import { queueMocks, simpleFetch, getFetchWithJsonParams } from '../../__test_helpers__/mocks';
import { MainUser } from '../../helpers/user';

let testUser = null;
const ACCESS = 'ACCESS';
const REFRESH = 'REFRESH';

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(simpleFetch());
  testUser = new MainUser();
  testUser.accessToken = ACCESS;
  testUser.refreshToken = REFRESH;
});

afterEach(() => {
  global.fetch.mockRestore();
});

it('encode url params in get', async () => {
  const responce = await get('test_url', { norm_params: 'text123', 'bad_params &4%29': '&qe&d%232# &123&' });
  expect(responce.url).toContain('test_url?');
  expect(responce.url).toContain('norm_params=text123');
  expect(responce.url).toContain('bad_params%20%264%2529=%26qe%26d%25232%23%20%26123%26');
});

it('default params in get', async () => {
  const responce = await get('test_url');
  expect(responce.url).toContain('test_url?');
});

it('encode url params in post', async () => {
  const responce = await post('test_url', { norm_params: 'text123', 'bad_params &4%29': '&qe&d%232# &123&' });
  expect(responce.url).toBe('test_url');
  expect(responce.params.method).toBe('POST');
  expect(responce.params.body).toContain('norm_params=text123');
  expect(responce.params.body).toContain('bad_params%20%264%2529=%26qe%26d%25232%23%20%26123%26');
});

it('default params in post', async () => {
  const responce = await post('test_url');
  expect(responce.url).toContain('test_url');
  expect(responce.params.method).toBe('POST');
});

it('user with good access in get', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(queueMocks([
    simpleFetch(200),
    getFetchWithJsonParams({ access: 'NEW_ACCESS', refresh: 'NEW_REFRESH' }),
    simpleFetch(200),
  ]));
  const responce = await get('test_url', {}, testUser);
  expect(responce.url).toContain('test_url?');
  expect(responce.params.headers.Authorization).toContain(ACCESS);
  expect(fetch).toHaveBeenCalledTimes(1);
});

it('user with bad access in get', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockImplementation(queueMocks([
    simpleFetch(401),
    getFetchWithJsonParams({ access: 'NEW_ACCESS', refresh: 'NEW_REFRESH' }),
    simpleFetch(200),
  ]));
  const responce = await get('test_url', {}, testUser);
  expect(responce.url).toContain('test_url?');
  expect(responce.params.headers.Authorization).toContain('NEW_ACCESS');
  expect(fetch).toHaveBeenCalledTimes(3);
  expect(testUser.accessToken).toEqual('NEW_ACCESS');
  expect(testUser.refreshToken).toEqual('NEW_REFRESH');
});
