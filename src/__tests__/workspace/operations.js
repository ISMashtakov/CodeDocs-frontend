import { Insert, Delete, Neutral } from '../../workspace/operations';
import { getAllPairs } from '../../helpers/general_helpers'

// 0123456789
const DIFERENS_OPERATIONS = [
  //Insert 
  new Insert(1, '1'), 
  new Insert(3, '4'),
  new Insert(3, '6'),

  //Delete 
  new Delete(3, '3456'),
  new Delete(2, '2'),
  new Delete(2, '23456'),
  new Delete(3, '34567'),

  //Neutral
  new Neutral()
]



describe('Test applyToStr', () => {
  it('Insert', () => {
    const text = 'Hlo World!';
    const op = new Insert(1, 'el');
    expect(op.applyToStr(text)).toEqual('Hello World!');

    const op2 = new Insert(100, 'el');
    expect(() => op2.applyToStr(text)).toThrow(Error);
  });

  it('Delete', () => {
    const text = 'Helello World!';
    const op = new Delete(1, 'el');
    expect(op.applyToStr(text)).toEqual('Hello World!');

    const op2 = new Delete(1, 'elo');
    expect(() => op2.applyToStr(text)).toThrow(Error);
  });

  it('Neutral', () => {
    const text = 'Hello World!';
    const op = new Neutral();
    expect(op.applyToStr(text)).toEqual('Hello World!');
  });
});

describe('Test changeByOperation', () => {
  it('Insert / Insert', () => {
    const text = '0235';
    const op1 = new Insert(1, '1');
    const op2 = new Insert(3, '4');
    const op3 = new Insert(3, '6');

    const op21 = op1.changeByOperation(op2);
    expect(op21).toBeInstanceOf(Insert);
    expect(op21.pos).toEqual(1);
    expect(op21.text).toEqual('1');
    expect(op21.applyToStr(op2.applyToStr(text))).toEqual('012345');

    const op12 = op2.changeByOperation(op1);
    expect(op12).toBeInstanceOf(Insert);
    expect(op12.pos).toEqual(4);
    expect(op12.text).toEqual('4');
    expect(op12.applyToStr(op1.applyToStr(text))).toEqual('012345');

    const op23 = op3.changeByOperation(op2);
    expect(op23).toBeInstanceOf(Insert);
    expect(op23.pos).toEqual(3);
    expect(op23.text).toEqual('6');
    expect(op23.applyToStr(op2.applyToStr(text))).toEqual('023645');
  });

  it('Insert / Delete', () => {
    const text = '0012233';
    const op1 = new Insert(2, '1');
    const op2 = new Delete(4, '2');
    const op3 = new Delete(0, '0');
    const op4 = new Delete(2, '1');
    const op5 = new Delete(0, '0012');

    const op21 = op1.changeByOperation(op2);
    expect(op21).toBeInstanceOf(Insert);
    expect(op21.pos).toEqual(2);
    expect(op21.text).toEqual('1');
    expect(op21.applyToStr(op2.applyToStr(text))).toEqual('0011233');

    const op31 = op1.changeByOperation(op3);
    expect(op31).toBeInstanceOf(Insert);
    expect(op31.pos).toEqual(1);
    expect(op31.text).toEqual('1');
    expect(op31.applyToStr(op3.applyToStr(text))).toEqual('0112233');

    const op41 = op1.changeByOperation(op4);
    expect(op41).toBeInstanceOf(Insert);
    expect(op41.pos).toEqual(2);
    expect(op41.text).toEqual('1');
    expect(op41.applyToStr(op4.applyToStr(text))).toEqual('0012233');

    const op51 = op1.changeByOperation(op5);
    expect(op51).toBeInstanceOf(Insert);
    expect(op51.pos).toEqual(0);
    expect(op51.text).toEqual('1');
    expect(op51.applyToStr(op5.applyToStr(text))).toEqual('1233');
  });

  it('Insert / Neutral', () => {
    const text = '02345';
    const op1 = new Insert(1, '1');
    const op2 = new Neutral();

    const op21 = op1.changeByOperation(op2);
    expect(op21).toBeInstanceOf(Insert);
    expect(op21.pos).toEqual(1);
    expect(op21.text).toEqual('1');
    expect(op21.applyToStr(op2.applyToStr(text))).toEqual('012345');
  });

  it('Delete / Insert', () => {
    const text = '012345679';
    const op1 = new Delete(3, '3456');
    const op2 = new Insert(8, '8');
    const op3 = new Insert(6, '56');
    const op4 = new Insert(3, '3');
    const op5 = new Insert(7, '7');
    const op6 = new Insert(8, '8');

    const op21 = op1.changeByOperation(op2);
    expect(op21).toBeInstanceOf(Delete);
    expect(op21.pos).toEqual(3);
    expect(op21.text).toEqual('3456');
    expect(op21.applyToStr(op2.applyToStr(text))).toEqual('012789');

    const op31 = op1.changeByOperation(op3);
    expect(op31).toBeInstanceOf(Delete);
    expect(op31.pos).toEqual(3);
    expect(op31.text).toEqual('345566');
    expect(op31.applyToStr(op3.applyToStr(text))).toEqual('01279');

    const op41 = op1.changeByOperation(op4);
    expect(op41).toBeInstanceOf(Delete);
    expect(op41.pos).toEqual(4);
    expect(op41.text).toEqual('3456');
    expect(op41.applyToStr(op4.applyToStr(text))).toEqual('012379');

    const op51 = op1.changeByOperation(op5);
    expect(op51).toBeInstanceOf(Delete);
    expect(op51.pos).toEqual(3);
    expect(op51.text).toEqual('3456');
    expect(op51.applyToStr(op5.applyToStr(text))).toEqual('012779');

    const op61 = op1.changeByOperation(op6);
    expect(op61).toBeInstanceOf(Delete);
    expect(op61.pos).toEqual(3);
    expect(op61.text).toEqual('3456');
    expect(op61.applyToStr(op6.applyToStr(text))).toEqual('012789');
  });

  it('Delete / Delete', () => {
    const text = '0123456789';
    const op1 = new Delete(3, '3456');
    const op2 = new Delete(2, '2');
    const op3 = new Delete(2, '23');
    const op4 = new Delete(2, '23456');
    const op5 = new Delete(2, '234567');
    const op6 = new Delete(3, '3456');
    const op7 = new Delete(3, '34567');
    const op8 = new Delete(6, '67');
    const op9 = new Delete(7, '78');

    const op12 = op2.changeByOperation(op1);
    expect(op12).toBeInstanceOf(Delete);
    expect(op12.pos).toEqual(2);
    expect(op12.text).toEqual('2');
    expect(op12.applyToStr(op1.applyToStr(text))).toEqual('01789');

    const op13 = op3.changeByOperation(op1);
    expect(op13).toBeInstanceOf(Delete);
    expect(op13.pos).toEqual(2);
    expect(op13.text).toEqual('2');
    expect(op13.applyToStr(op1.applyToStr(text))).toEqual('01789');

    const op14 = op4.changeByOperation(op1);
    expect(op14).toBeInstanceOf(Delete);
    expect(op14.pos).toEqual(2);
    expect(op14.text).toEqual('2');
    expect(op14.applyToStr(op1.applyToStr(text))).toEqual('01789');

    const op15 = op5.changeByOperation(op1);
    expect(op15).toBeInstanceOf(Delete);
    expect(op15.pos).toEqual(2);
    expect(op15.text).toEqual('27');
    expect(op15.applyToStr(op1.applyToStr(text))).toEqual('0189');

    const op16 = op6.changeByOperation(op1);
    expect(op16).toBeInstanceOf(Neutral);
    expect(op16.applyToStr(op1.applyToStr(text))).toEqual('012789');

    const op17 = op7.changeByOperation(op1);
    expect(op17).toBeInstanceOf(Delete);
    expect(op17.pos).toEqual(3);
    expect(op17.text).toEqual('7');
    expect(op17.applyToStr(op1.applyToStr(text))).toEqual('01289');

    const op18 = op8.changeByOperation(op1);
    expect(op18).toBeInstanceOf(Delete);
    expect(op18.pos).toEqual(3);
    expect(op18.text).toEqual('7');
    expect(op18.applyToStr(op1.applyToStr(text))).toEqual('01289');

    const op19 = op9.changeByOperation(op1);
    expect(op19).toBeInstanceOf(Delete);
    expect(op19.pos).toEqual(3);
    expect(op19.text).toEqual('78');
    expect(op19.applyToStr(op1.applyToStr(text))).toEqual('0129');
  });

  it('Delete / Neutral', () => {
    const text = '012345';
    const op1 = new Delete(1, '123');
    const op2 = new Neutral();

    const op21 = op1.changeByOperation(op2);
    expect(op21).toBeInstanceOf(Delete);
    expect(op21.pos).toEqual(1);
    expect(op21.text).toEqual('123');
    expect(op21.applyToStr(op2.applyToStr(text))).toEqual('045');
  });
});

describe('Test oposite', () => {
  it('Insert', () => {
    const op1 = new Insert(1, '123');
    const op2 = op1.oposite
    expect(op2).toBeInstanceOf(Delete);
    expect(op2.pos).toEqual(1);
    expect(op2.text).toEqual('123');
  });

  it('Delete', () => {
    const op1 = new Delete(1, '123');
    const op2 = op1.oposite
    expect(op2).toBeInstanceOf(Insert);
    expect(op2.pos).toEqual(1);
    expect(op2.text).toEqual('123');
  });

  it('Neutral', () => {
    const op1 = new Neutral();
    const op2 = op1.oposite
    expect(op2).toBeInstanceOf(Neutral);
  });
})

describe('Test laws', () => {
  it('-(-op) = op', () => {
    DIFERENS_OPERATIONS.forEach(op=>{
      expect(op.oposite.oposite).toEqual(op)
    })
  });

  it('op1 / op2 = op3   =>   op3 / (-op2) = op1', () => {
    const pairs = getAllPairs(DIFERENS_OPERATIONS)
    pairs.forEach(pair=>{
      const op1 = pair[0]
      const op2 = pair[1]
      const op3 = op1.changeByOperation(op2)
      if(op3.changeByOperation(op2.oposite) != op1){
        console.log(op1)
        console.log(op2)
        console.log(op3)
        return
      }
      expect(op3.changeByOperation(op2.oposite)).toEqual(op1)
    })
  });
})
