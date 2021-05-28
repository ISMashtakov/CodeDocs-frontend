import receive from './connectionReceiver';
import { CHANNELS_SERVER_URL } from '../constants';
import urlParams from '../helpers/url_helper';

class Connection {
  constructor() {
    this.socket = null;
    this.user = null;
    this.queueMessage = [];
  }

  get isConnect() {
    return this.socket !== null && this.socket.readyState === this.socket.OPEN;
  }

  onMessage(event) {
    const data = JSON.parse(event.data);
    receive(data);
  }

  connect(user) {
    this.user = user;
    const url = `${CHANNELS_SERVER_URL}/files/${urlParams.getFileToken()}/${this.user.accessToken}/`;
    this.socket = new WebSocket(url);
    this.socket.onopen = () => this.send();
    this.socket.onclose = () => {};
    this.socket.onmessage = this.onMessage;
    this.socket.onerror = () => {};
  }

  send(content = null) {
    if (content) {
      this.queueMessage.push(content);
    }
    if (this.isConnect) {
      this.queueMessage.forEach((item) => this.socket.send(item));
      this.queueMessage = [];
    }
  }
}

const connection = new Connection();

export default connection;
