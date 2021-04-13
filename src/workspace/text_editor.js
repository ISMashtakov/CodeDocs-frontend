import { sendOperationMessage } from './connectionActions'


class TextEditor{
    constructor(){
        this.text = ""
        this.last_revision
        this.notAproovedActions = []
        this.actionWaitedAproove = null
        this.aproovedActions = []
    }

    addOperation(operation){
        this.notAproovedActions(operation)
        this.trySend()
    }

    trySend(){
        if(this.actionWaitedAproove === null && this.notAproovedActions.length > 0){
            this.actionWaitedAproove = this.notAproovedActions[0];
            this.notAproovedActions = this.notAproovedActions.slice(1)
            sendOperationMessage(this.actionWaitedAproove.getMessage())
        }
    }
    

}

const textEditor = new TextEditor()

export default textEditor;
