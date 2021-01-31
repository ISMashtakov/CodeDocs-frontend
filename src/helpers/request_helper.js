function getParams(data) {
  let params = '';
  Object.keys(data).forEach((key) => {
    params += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
  });

  if (params.endsWith('&')) {
    params = params.slice(0, -1);
  }

  return params;
}

export async function post(url, data = {}) {
  const params = getParams(data);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  return response;
}

export async function get(url, data = {}) {
  const params = getParams(data);
  const response = await fetch(`${url}?${params}`);
  return response;
}
