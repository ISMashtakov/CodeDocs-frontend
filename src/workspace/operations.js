import {diff_match_patch} from '../packages/text_differents';


class Operation{
    getMessage(){
    }
    
    changeByOperation(oper){
        if (!(oper instanceof Operation)){
            throw new Error("illegal argument")
        }
        return this
    }
}

class Insert extends Operation{
    constructor(pos, text){
        super()
        this.pos = pos
        this.text = text
    }

    getMessage(){
        return{
            type: "insert",
            position: this.pos,
            text: this.text
        }
    }

    changeByOperation(oper){
        super.changeByOperation(oper);

        if (oper instanceof Insert){
            if(this.pos <= oper.pos){
                return new Insert(this.pos, this.text)
            }
            else {
                return new Insert(this.pos + oper.text.length, this.text)
            }
        }
        

    }
}

class Delete extends Operation{
    constructor(pos, text){
        super()
        this.pos = pos
        this.text = text
    }

    getMessage(){
        return{
            type: "delete",
            position: this.pos,
            text: this.text
        }
    }
}

class Neutral extends Operation{
    getMessage(){
        return{
            type: "neutral"
        }
    }
}

export function getOperations(oldText, newText) {
    const diff = (new diff_match_patch()).diff_main(oldText, newText)
    const operations = []
    var pos = 0;
    diff.forEach(item => {
        switch(item[0]){
            case 1:
                const insertOp = new Insert(pos, item[1])
                operations.push(insertOp)
                break
            case -1:
                const deleteOp = new Delete(pos, item[1])
                operations.push(deleteOp)
                break
        }
        pos += item[1].length
    });
    return operations
}