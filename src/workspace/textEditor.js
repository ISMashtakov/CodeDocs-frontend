import { sendOperationMessage, requestOperationHistory } from './connectionActions';
import { textEditor as receiverTextEditor } from './connectionReceiver';
import { updateAction } from './actions';
import store from '../redux/store';

export class StorageOperation {
  static get TYPES() {
    return {
      APPLIED: 0,
      CANCELED: 1,
      CANCELING: 2,
      ALIEN: 3,
    };
  }

  constructor(operation, type = 0) {
    this.operation = operation;
    this.type = type;
  }

  get isApplied() {
    return this.type === this.TYPES.APPLIED;
  }

  get isCanceled() {
    return this.type === this.TYPES.CANCELED;
  }

  get isCanceling() {
    return this.type === this.TYPES.CANCELING;
  }
}

class TextEditor {
  constructor() {
    this.text = '';
    this.notApprovedOperations = [];
    this.operationWaitedApprove = null;
    this.approvedOperations = [];
    this.revision = null;
  }

  trySend() {
    if (this.operationWaitedApprove === null
        && this.notApprovedOperations.length > 0
        && this.revision !== null
    ) {
      this.operationWaitedApprove = this.notApprovedOperations[0];
      this.notApprovedOperations = this.notApprovedOperations.slice(1);
      sendOperationMessage(this.operationWaitedApprove.operation, this.revision);
    }
  }

  addOperation(operation) {
    this.notApprovedOperations.push(new StorageOperation(operation));
    this.trySend();
  }

  applyOperation(operation) {
    this.text = operation.applyToStr(this.text);
  }

  updateNotAprovedOperations(operation) {
    this.notApprovedOperations.forEach((item) => {
      item.operation = item.operation.changeByOperation(operation);
    });
  }

  receiveOperation(operation, revision, isMy) {
    if (this.revision === null || this.revision + 1 > revision) {
      return null;
    } if (this.revision + 1 < revision) {
      requestOperationHistory();
    } else if (this.revision + 1 === revision) {
      if (isMy) {
        if (this.operationWaitedApprove !== null) {
          this.approvedOperations.push(
            new StorageOperation(operation, this.operationWaitedApprove.type),
          );
        }
        this.revision = revision;
        this.operationWaitedApprove = null;
        this.trySend();
      } else {
        let text = this.text;
        this.notApprovedOperations.slice().reverse().forEach((item) => {
          text = item.operation.oposite.applyToStr(text);
        });

        if (this.operationWaitedApprove !== null) {
          text = this.operationWaitedApprove.operation.oposite.applyToStr(text);
        }

        text = operation.applyToStr(text);
        this.approvedOperations.push(new StorageOperation(operation, StorageOperation.TYPES.ALIEN));

        this.updateNotAprovedOperations(operation);
        if (this.operationWaitedApprove !== null) {
          const neoOp = this.operationWaitedApprove.operation.changeByOperation(operation);
          this.operationWaitedApprove.operation = neoOp;
          text = this.operationWaitedApprove.operation.applyToStr(text);
        }

        this.notApprovedOperations.forEach((item) => {
          text = item.operation.applyToStr(text);
        });

        this.text = text;
        this.revision = revision;
        store.dispatch(updateAction());
      }
    }
    return null;
  }
}

const textEditor = new TextEditor();
receiverTextEditor.push(textEditor);
export default textEditor;
