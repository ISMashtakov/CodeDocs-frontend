import { sleep } from './help_funcs';

export function simpleFetch(status = 200) {
  return (url, params = {}) => Promise.resolve({
    url,
    params,
    status,
  });
}

export function getFetchWithJsonParams(params, status = 200) {
  return (url) => Promise.resolve({
    json: () => Promise.resolve(params),
    url,
    status,
  });
}

export function getFetchWithTextParams(params, status = 200) {
  return (url) => Promise.resolve({
    text: () => Promise.resolve(params),
    url,
    status,
  });
}

export function badFetch() {
  return Promise.reject(new Error('problem'));
}

export function queueMocks(mocks) {
  let numberMock = 0;
  return (...rest) => {
    numberMock += 1;
    return mocks[numberMock - 1](...rest);
  };
}

export function conditionalPromiseFetch(mock, condition) {
  return async (...rest) => {
    while (!condition()) { await sleep(100); }
    return mock(...rest);
  };
}
