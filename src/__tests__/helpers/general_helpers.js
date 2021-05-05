import { Cursor } from '../../helpers/general_helpers';

const TEXT = '\nHello\n World \n\n With u i can fly\n';
// 0 123456 78901234 5 678901234567890123 4
describe('test Cursor', () => {
  it('fromPos', () => {
    let cursor = null;
    cursor = Cursor.fromPos(TEXT, 0);
    expect(cursor.row).toEqual(0);
    expect(cursor.column).toEqual(0);

    cursor = Cursor.fromPos(TEXT, 1);
    expect(cursor.row).toEqual(1);
    expect(cursor.column).toEqual(0);

    cursor = Cursor.fromPos(TEXT, 3);
    expect(cursor.row).toEqual(1);
    expect(cursor.column).toEqual(2);

    cursor = Cursor.fromPos(TEXT, 7);
    expect(cursor.row).toEqual(2);
    expect(cursor.column).toEqual(0);

    cursor = Cursor.fromPos(TEXT, 9);
    expect(cursor.row).toEqual(2);
    expect(cursor.column).toEqual(2);

    cursor = Cursor.fromPos(TEXT, 15);
    expect(cursor.row).toEqual(3);
    expect(cursor.column).toEqual(0);

    cursor = Cursor.fromPos(TEXT, 16);
    expect(cursor.row).toEqual(4);
    expect(cursor.column).toEqual(0);

    cursor = Cursor.fromPos(TEXT, 20);
    expect(cursor.row).toEqual(4);
    expect(cursor.column).toEqual(4);

    cursor = Cursor.fromPos(TEXT, 34);
    expect(cursor.row).toEqual(5);
    expect(cursor.column).toEqual(0);
  });

  it('toPos', () => {
    let cursor = null;

    cursor = new Cursor(0, 0);
    expect(cursor.toPos(TEXT)).toEqual(0);

    cursor = new Cursor(1, 0);
    expect(cursor.toPos(TEXT)).toEqual(1);

    cursor = new Cursor(1, 2);
    expect(cursor.toPos(TEXT)).toEqual(3);

    cursor = new Cursor(2, 0);
    expect(cursor.toPos(TEXT)).toEqual(7);

    cursor = new Cursor(2, 2);
    expect(cursor.toPos(TEXT)).toEqual(9);

    cursor = new Cursor(3, 0);
    expect(cursor.toPos(TEXT)).toEqual(15);

    cursor = new Cursor(4, 0);
    expect(cursor.toPos(TEXT)).toEqual(16);

    cursor = new Cursor(4, 4);
    expect(cursor.toPos(TEXT)).toEqual(20);

    cursor = new Cursor(5, 0);
    expect(cursor.toPos(TEXT)).toEqual(34);
  });
});
