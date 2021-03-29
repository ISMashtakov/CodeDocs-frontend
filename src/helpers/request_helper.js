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

export async function post(url, data = {}, user, type = 'POST') {
  const params = getParams(data);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (user) {
    if (!user.accessToken) throw new Error('Bad auth token');
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  let response = await fetch(url, {
    method: type,
    headers,
    body: params,
  });

  if (user && response.status === 401) {
    await user.refreshTokens();
    if (!user.accessToken) throw new Error('Bad auth token');
    headers.Authorization = `Bearer ${user.accessToken}`;
    response = await fetch(url, {
      method: type,
      headers,
      body: params,
    });
  }
  return response;
}

export async function get(url, data = {}, user) {
  const params = getParams(data);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (user) {
    if (!user.accessToken) throw new Error('Bad auth token');
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  let response = await fetch(`${url}?${params}`, {
    method: 'GET',
    headers,
  });

  if (user && response.status === 401) {
    await user.refreshTokens();
    if (!user.accessToken) throw new Error('Bad auth token');
    headers.Authorization = `Bearer ${user.accessToken}`;
    response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers,
    });
  }
  return response;
}
