import { get, post } from '../../helpers/request_helper';



beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation((url, params={}) =>
  Promise.resolve({
    url:url,
    params:params
  })
);
});

afterEach(() => {
  global.fetch.mockRestore();
});


it('encode url params in get', async () => {
  const responce = await get("test_url", {"norm_params": "text123", "bad_params &4%29": "&qe&d%232# &123&"});
  expect(responce.params).toStrictEqual({});
  expect(responce.url).toContain("test_url?");
  expect(responce.url).toContain("norm_params=text123");
  expect(responce.url).toContain("bad_params%20%264%2529=%26qe%26d%25232%23%20%26123%26");
});

it('default params in get', async () => {
  const responce = await get("test_url");
  expect(responce.params).toStrictEqual({});
  expect(responce.url).toContain("test_url?");
});

it('encode url params in post', async () => {
  const responce = await post("test_url", {"norm_params": "text123", "bad_params &4%29": "&qe&d%232# &123&"});
  expect(responce.url).toBe("test_url");
  expect(responce.params.method).toBe("POST");
  expect(responce.params.body).toContain("norm_params=text123");
  expect(responce.params.body).toContain("bad_params%20%264%2529=%26qe%26d%25232%23%20%26123%26");
});

it('default params in get', async () => {
  const responce = await post("test_url");
  expect(responce.url).toContain("test_url");
  expect(responce.params.method).toBe("POST");
});