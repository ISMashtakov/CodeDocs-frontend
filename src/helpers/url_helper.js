class UrlParams {
  get params() {
    const { href } = window.location;
    const params = href.slice(href.indexOf('?') + 1);
    return new URLSearchParams(params);
  }

  get linkParts() {
    return window.location.href.split('/');
  }

  get(name) {
    return this.params.get(name);
  }

  has(name) {
    return this.params.has(name);
  }

  getUID() {
    return this.params.get('uid');
  }

  getToken() {
    return this.params.get('token');
  }

  getFileToken() {
    const parts = this.linkParts;
    const fileIndex = parts.indexOf('file');
    return parts[fileIndex + 1];
  }
}

const urlParams = new UrlParams();

export default urlParams;
