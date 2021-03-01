class UrlParams {
  constructor(params) {
    this.params = params;
  }

  get(name) {
    return this.params.get(name);
  }

  has(name) {
    return this.params.has(name);
  }

  getUID(){
    return this.params.get('uid');
  }

  getToken(){
    return this.params.get('token');
  }
}

function getURLSeatchParams(href = null) {
  if (href === null) href = window.location.href;
  const params = href.slice(href.indexOf('?') + 1);
  return new URLSearchParams(params);
}

const urlParams = new UrlParams(getURLSeatchParams());

export default urlParams;
