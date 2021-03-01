function getParams(data) {
  let params = '';
  Object.keys(data).forEach((key) => {
    params += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
  });

  if (params.endsWith('&')) {
    return params.slice(0, -1);
  }

  return params;
}

export async function post(url, data = {}, token) {
  const params = getParams(data);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: params,
  });
  return response;
}

export async function get(url, data = {}, token) {
  const params = getParams(data);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${url}?${params}`, {
    method: 'GET',
    headers,
  });
  return response;
}
