import {diff_match_patch} from '../packages/text_differents';


export class Operation{
    getMessage(){
    }
    
    changeByOperation(oper){
        if (!(oper instanceof Operation)){
            throw new Error("illegal argument")
        }
        return this
    }

    applyToStr(str){
    }

    get length(){
        return this.text.length
    }
    
    get end(){
        return this.pos + this.length
    }
}

export class Insert extends Operation{
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
                return new Insert(this.pos + oper.length, this.text)
            }
        }
        else if (oper instanceof Delete){
            if(this.pos <= oper.pos){
                return new Insert(this.pos, this.text)
            }
            else if(this.pos >= oper.end){
                return new Insert(this.pos - oper.length, this.text)
            }
            else{
                return new Insert(oper.pos, this.text)
            }
        }
        else if (oper instanceof Neutral){
            return new Insert(this.pos, this.text)
        }
        else{
            throw Error(`Illegal operation ${oper}`)
        }
    }

    applyToStr(str){
        if (str.length < this.pos){
            throw Error('Position for insert not exist')
        }

        return str.slice(0, this.pos) + this.text + str.slice(this.pos)
    }
}

export class Delete extends Operation{
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

    changeByOperation(oper){
        super.changeByOperation(oper);

        if (oper instanceof Insert){
            if (oper.pos <= this.pos){
                return new Delete(this.pos + oper.length, this.text)
            }
            else if (this.end > oper.pos){
                return new Delete(
                    this.pos, 
                    this.text.slice(0, oper.pos - this.pos) + oper.text + this.text.slice(oper.pos - this.pos)
                )
            }
            else {
                return new Delete(this.pos, this.text)
            }
        }
        
        else if (oper instanceof Delete){
            if (this.end <= oper.pos){
                return new Delete(this.pos, this.text)
            }
            else if (this.pos < oper.pos && this.end <= oper.end){
                return new Delete(this.pos, this.text.slice(0, oper.pos - this.pos))
            }
            else if (this.pos < oper.pos && this.end > oper.end){
                return new Delete(
                    this.pos, 
                    this.text.slice(0, oper.pos - this.pos) + this.text.slice(oper.end - this.pos)
                )
            }
            else if (this.end <= oper.end){
                return new Neutral()
            }
            else if (this.pos < oper.end){
                return new Delete(oper.pos, this.text.slice(oper.end - this.pos))
            }
            else {
                return new Delete(this.pos - oper.length, this.text)
            }
        }
        else if (oper instanceof Neutral){
            return new Delete(this.pos, this.text)
        }
        else{
            throw Error(`Illegal operation ${oper}`)
        }
    }

    applyToStr(str){
        if (str.slice(this.pos, this.pos + this.length) !== this.text){
            throw Error('Pattern for delete not exist')
        }
        return str.slice(0, this.pos) + str.slice(this.end) 
    }
}

export class Neutral extends Operation{
    getMessage(){
        return{
            type: "neutral"
        }
    }

    changeByOperation(oper){
        super.changeByOperation(oper);
        return new Neutral()
    }

    applyToStr(str){
        return str
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