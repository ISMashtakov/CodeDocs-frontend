import receive from './connectionReceiver';
import { getFileInfoMessage, getAllUsersMessage } from '../__test_helpers__/messagesData';

class Connection {
  constructor() {
    this.socket = null;
  }

  get isConnect() {
    return this.socket !== null;
  }

  onOpen() {
    console.log('Соединение установлено.');
  }

  onClose(event) {
    if (event.wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения'); // например, "убит" процесс сервера
    }
    console.log(`Код: ${event.code} причина: ${event.reason}`);
  }

  onMessage(event) {
    const data = JSON.parse(event.data);
    receive(data);
  }

  onError(error) {
    console.error(`Ошибка ${error.message}`);
  }

  connect() {
    const url = 'asd';
    this.socket = undefined;
    receive(getFileInfoMessage());
    receive(getAllUsersMessage());
    // this.socket = new WebSocket(url);

    // this.socket.onopen = this.onOpen
    // this.socket.onclose = this.onClose
    // this.socket.onmessage = this.onMessage
    // this.socket.onerror = this.onError
  }

  send(content) {
    if (this.socket === null) {
      console.error('socket is null');
    }
    this.socket.send(content);
  }
}

const connection = new Connection();

export default connection;
