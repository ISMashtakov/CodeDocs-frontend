/* eslint no-use-before-define: 0 */

import { diff_match_patch as DiffMatchPatch } from '../packages/text_differents';

export class Operation {
  getMessage() {
  }

  changeByOperation(oper) {
    if (!(oper instanceof Operation)) {
      throw new Error(`illegal argument`);
    }
    return this;
  }

  get length() {
    return this.text.length;
  }

  get end() {
    return this.pos + this.length;
  }
}

export class Insert extends Operation {
  constructor(pos, text) {
    super();
    this.pos = pos;
    this.text = text;
  }

  getMessage() {
    return {
      type: 'insert',
      position: this.pos,
      text: this.text,
    };
  }

  changeByOperation(oper) {
    super.changeByOperation(oper);

    if (oper instanceof Insert) {
      if (this.pos <= oper.pos) {
        return new Insert(this.pos, this.text);
      }

      return new Insert(this.pos + oper.length, this.text);
    }
    if (oper instanceof Delete) {
      if (this.pos <= oper.pos) {
        return new Insert(this.pos, this.text);
      }
      if (this.pos >= oper.end) {
        return new Insert(this.pos - oper.length, this.text);
      }

      return new Insert(oper.pos, this.text);
    }
    if (oper instanceof Neutral) {
      return new Insert(this.pos, this.text);
    }

    throw Error(`Illegal operation ${oper}`);
  }

  applyToStr(str) {
    if (str.length < this.pos) {
      throw Error('Position for insert not exist');
    }

    return str.slice(0, this.pos) + this.text + str.slice(this.pos);
  }

  get oposite(){
    return new Delete(this.pos, this.text)
  }
}

export class Delete extends Operation {
  constructor(pos, text) {
    super();
    this.pos = pos;
    this.text = text;
  }

  getMessage() {
    return {
      type: 'delete',
      position: this.pos,
      text: this.text,
    };
  }

  changeByOperation(oper) {
    super.changeByOperation(oper);

    if (oper instanceof Insert) {
      if (oper.pos <= this.pos) {
        return new Delete(this.pos + oper.length, this.text);
      }
      if (this.end > oper.pos) {
        return new Delete(
          this.pos,
          this.text.slice(0, oper.pos - this.pos)
                + oper.text
                + this.text.slice(oper.pos - this.pos),
        );
      }

      return new Delete(this.pos, this.text);
    }

    if (oper instanceof Delete) {
      if (this.end <= oper.pos) {
        return new Delete(this.pos, this.text);
      }
      if (this.pos < oper.pos && this.end <= oper.end) {
        return new Delete(this.pos, this.text.slice(0, oper.pos - this.pos));
      }
      if (this.pos < oper.pos && this.end > oper.end) {
        return new Delete(
          this.pos,
          this.text.slice(0, oper.pos - this.pos) + this.text.slice(oper.end - this.pos),
        );
      }
      if (this.end <= oper.end) {
        return new Neutral();
      }
      if (this.pos < oper.end) {
        return new Delete(oper.pos, this.text.slice(oper.end - this.pos));
      }

      return new Delete(this.pos - oper.length, this.text);
    }
    if (oper instanceof Neutral) {
      return new Delete(this.pos, this.text);
    }

    throw Error(`Illegal operation ${oper}`);
  }

  applyToStr(str) {
    if (str.slice(this.pos, this.pos + this.length) !== this.text) {
      throw Error('Pattern for delete not exist');
    }
    return str.slice(0, this.pos) + str.slice(this.end);
  }

  get oposite(){
    return new Insert(this.pos, this.text)
  }
}

export class Neutral extends Operation {
  getMessage() {
    return {
      type: 'neutral',
    };
  }

  changeByOperation(oper) {
    super.changeByOperation(oper);
    return new Neutral();
  }

  applyToStr(str) {
    return str;
  }

  get oposite(){
    return new Neutral()
  }
}

export function getOperations(oldText, newText) {
  const diff = (new DiffMatchPatch()).diff_main(oldText, newText);
  const operations = [];
  let pos = 0;
  diff.forEach((item) => {
    switch (item[0]) {
      case 1:
        const insertOp = new Insert(pos, item[1]);
        operations.push(insertOp);
        break;
      case -1:
        const deleteOp = new Delete(pos, item[1]);
        operations.push(deleteOp);
        break;
      default:
        break;
    }
    pos += item[1].length;
  });
  return operations;
}

export function getOperationByMessage({ type, position, text }) {
  switch (type) {
    case 'insert':
      return new Insert(position, text);
    case 'delete':
      return new Delete(position, text);
    case 'neutral':
      return new Neutral();
    default:
      throw Error(`invalid operation ${type}`);
  }
}
