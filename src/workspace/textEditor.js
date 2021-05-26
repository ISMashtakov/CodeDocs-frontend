import { sendOperationMessage, requestOperationHistory } from './connectionActions';
import { textEditor as receiverTextEditor } from './connectionReceiver';
import { updateAction } from './actions';
import store from '../redux/store';
import { Cursor } from '../helpers/general_helpers';

export class StorageOperation {
  static get TYPES() {
    return {
      APPLIED: 0,
      CANCELED: 1,
      CANCELING: 2,
      ALIEN: 3,
    };
  }

  constructor(operation, type = StorageOperation.TYPES.APPLIED) {
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
    this.cursor = null;
    this.anchor = null;
    this.showedNotification = false;
    this.usersCursorsPositions = {};
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
    let cursorPos = this.cursor.toPos(this.text);
    let anchorPos = this.anchor.toPos(this.text);
    this.text = operation.applyToStr(this.text);
    cursorPos = operation.changePosition(cursorPos);
    this.cursor = Cursor.fromPos(this.text, cursorPos);

    anchorPos = operation.changePosition(anchorPos);
    this.anchor = Cursor.fromPos(this.text, anchorPos);

    Object.keys(this.usersCursorsPositions).forEach((key) => {
      this.usersCursorsPositions[key] = operation.changePosition(this.usersCursorsPositions[key]);
    });
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
        this.notApprovedOperations.slice().reverse().forEach((item) => {
          this.applyOperation(item.operation.oposite);
        });

        if (this.operationWaitedApprove !== null) {
          this.applyOperation(this.operationWaitedApprove.operation.oposite);
        }

        this.applyOperation(operation);
        this.approvedOperations.push(new StorageOperation(operation, StorageOperation.TYPES.ALIEN));

        this.updateNotAprovedOperations(operation);
        if (this.operationWaitedApprove !== null) {
          const neoOp = this.operationWaitedApprove.operation.changeByOperation(operation);
          this.operationWaitedApprove.operation = neoOp;
          this.applyOperation(this.operationWaitedApprove.operation);
        }

        this.notApprovedOperations.forEach((item) => {
          this.applyOperation(item.operation);
        });

        this.revision = revision;
        store.dispatch(updateAction());
      }
    }
    return null;
  }

  // undo(){
  //   if (this.notApprovedOperations.length > 0){
  //     for(let i = this.notApprovedOperations.length - 1; i>=0; i-=1){
  //       const oper = this.notApprovedOperations[i];
  //       if (oper.type === )
  //       this.applyOperation(oper.oposite)
  //       return;
  //     }
  //   }
  //   if(this.operationWaitedApprove !== null){
  //     const oper = this.operationWaitedApprove
  //     this.applyOperation(oper.oposite)
  //     this.notApprovedOperations.push(oper.oposite)
  //     return;
  //   }

  // }
}

const textEditor = new TextEditor();
receiverTextEditor.push(textEditor);
export default textEditor;
