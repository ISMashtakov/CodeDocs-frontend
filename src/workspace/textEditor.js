import { sendOperationMessage, requestOperationHistory } from './connectionActions';
import { textEditor as receiverTextEditor } from './connectionReceiver';


export class StorageOperation{
    static TYPES = {
        APPLIED: 0,
        CANCELED: 1,
        CANCELING: 2,
        ALIEN: 3
    }

    constructor(operation, type = 0){
        this.operation = operation
        this.type = type
    }

    get isApplied(){
        return this.type === this.TYPES.APPLIED
    }

    get isCanceled(){
        return this.type === this.TYPES.CANCELED
    }

    get isCanceling(){
        return this.type === this.TYPES.CANCELING
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
        if (this.operationWaitedApprove === null && this.notApprovedOperations.length > 0 && this.revision !== null) {
            this.operationWaitedApprove = this.notApprovedOperations[0];
            this.notApprovedOperations = this.notApprovedOperations.slice(1);
            sendOperationMessage(this.operationWaitedApprove.operation, this.revision);
        }
  }

  addOperation(operation) {
    this.notApprovedOperations.push(new StorageOperation(operation));
    this.trySend();
  }

  applyOperation(operation){
    this.text = operation.applyToStr(this.text)
  }

  updateNotAprovedOperations(operation){
      this.notApprovedOperations.forEach(item => {
        item.operation = item.operation.changeByOperation(operation)
      })
  }

//   receiveListOperations(list){
//       const notApplyedRevisions = Object.keys(list).map(item => item * 1)

//       notApplyedRevisions.filter(rev => rev <= this.revision).forEach(rev => {
//           delete this.list[rev]
//       })

//       notApplyedRevisions.filter(rev => rev > this.revision).sort().forEach(rev => {
        
//           if (rev === this.revision + 1){
//               this.applyOperation(this.list[rev]);
//               this.revision++;
//           }
//       })

//       if (notApplyedRevisions.some(rev => rev > this.revision)){
//           this.list = {}
//           requestOperationHistory(this.revision)
//       }
//   }

    receiveOperation(operation, revision, isMy){
        if (this.revision === null || this.revision + 1 > revision){
        }
        else if (this.revision + 1 < revision){
            requestOperationHistory()
        }
        else if (this.revision + 1 === revision){
            if(isMy){
                this.approvedOperations.push(new StorageOperation(operation, this.operationWaitedApprove.type))
                this.operationWaitedApprove = null;
                this.trySend()
            }else{
                var updatedOp = operation
                this.notApprovedOperations.forEach(item => {
                    updatedOp = updatedOp.changeByOperation(item.operation)
                })
                this.applyOperation(updatedOp)
                this.updateNotAprovedOperations(operation)
                this.approvedOperations.push(new StorageOperation(updatedOp, StorageOperation.TYPES.ALIEN))
                this.revision = revision
            }
        }
    }
}

const textEditor = new TextEditor();
receiverTextEditor.push(textEditor);
export default textEditor;
