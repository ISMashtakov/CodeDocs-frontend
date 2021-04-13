import {diff_match_patch} from '../packages/text_differents';


class Operation{

}

class Insert extends Operation{

}

class Delete extends Operation{

}

class Neutral extends Operation{

}

export function getOperation(oldText, newText) {
    const diff = new diff_match_patch()    
    var a = diff.diff_main(oldText, newText)
    console.log(a)
}