import textEditor, { StorageOperation } from '../../workspace/textEditor';
import { Insert } from '../../workspace/operations';
import * as actions from '../../workspace/connectionActions';
import { simpleFetch } from '../../__test_helpers__/mocks';
import { Cursor } from '../../helpers/general_helpers';

beforeEach(() => {
  textEditor.text = '';
  textEditor.cursor = new Cursor();
  textEditor.anchor = new Cursor();
});

afterEach(() => {
  textEditor.text = '';
  textEditor.notApprovedOperations = [];
  textEditor.operationWaitedApprove = null;
  textEditor.revision = null;
});

it('test trySend', () => {
  const sendOperationMessage = jest.spyOn(actions, 'sendOperationMessage').mockImplementation(simpleFetch());
  const op = new Insert(0, 'hello');
  const storageOp = new StorageOperation(op);
  textEditor.revision = 0;
  textEditor.notApprovedOperations.push(storageOp);
  textEditor.trySend();

  expect(textEditor.operationWaitedApprove).toEqual(storageOp);
  expect(textEditor.notApprovedOperations.length).toEqual(0);
  expect(sendOperationMessage.mock.calls[0][0]).toEqual(op);
  expect(sendOperationMessage.mock.calls[0][1]).toEqual(0);

  actions.sendOperationMessage.mockRestore();
});

it('test addOperation', () => {
  const sendOperationMessage = jest.spyOn(actions, 'sendOperationMessage').mockImplementation(simpleFetch());
  const op = new Insert(0, 'hello');
  textEditor.revision = 0;
  textEditor.addOperation(op);

  expect(textEditor.operationWaitedApprove).toEqual(new StorageOperation(op));
  expect(textEditor.notApprovedOperations.length).toEqual(0);
  expect(sendOperationMessage.mock.calls[0][0]).toEqual(op);
  expect(sendOperationMessage.mock.calls[0][1]).toEqual(0);

  actions.sendOperationMessage.mockRestore();
});

it('test applyOperation', () => {
  const op = new Insert(0, 'hello');
  textEditor.applyOperation(op);
  expect(textEditor.text).toEqual('hello');
  textEditor.cursor.column = 2;
  textEditor.applyOperation(op);
  expect(textEditor.text).toEqual('hellohello');
  expect(textEditor.cursor.row).toEqual(0);
  expect(textEditor.cursor.column).toEqual(7);
});

it('test updateNotAprovedOperations', () => {
  const op1 = new Insert(0, 'hello');
  const op2 = new Insert(3, 'cat');
  const op3 = new Insert(0, 'dog');
  textEditor.notApprovedOperations.push(new StorageOperation(op1));
  textEditor.notApprovedOperations.push(new StorageOperation(op2));
  textEditor.updateNotAprovedOperations(op3);

  expect(textEditor.notApprovedOperations[0].operation.pos).toEqual(0);
  expect(textEditor.notApprovedOperations[0].operation.text).toEqual('hello');

  expect(textEditor.notApprovedOperations[1].operation.pos).toEqual(6);
  expect(textEditor.notApprovedOperations[1].operation.text).toEqual('cat');
});

it('test receiveOperation', () => {
  const requestOperationHistory = jest.spyOn(actions, 'requestOperationHistory').mockImplementation(simpleFetch());
  const sendOperationMessage = jest.spyOn(actions, 'sendOperationMessage').mockImplementation(simpleFetch());

  const op1 = new Insert(0, 'hello');
  const op2 = new Insert(3, 'cat');
  const op3 = new Insert(0, 'dog');
  textEditor.revision = 0;
  textEditor.notApprovedOperations.push(new StorageOperation(op1));
  textEditor.text = 'hello';

  textEditor.receiveOperation(op2, 4, false);
  expect(requestOperationHistory).toBeCalledTimes(1);

  textEditor.receiveOperation(op3, 1, false);
  expect(textEditor.approvedOperations).toEqual(
    [new StorageOperation(op3, StorageOperation.TYPES.ALIEN)],
  );
  expect(textEditor.text).toEqual('hellodog');

  textEditor.receiveOperation(op3, 2, true);
  expect(sendOperationMessage).toBeCalledTimes(1);

  actions.sendOperationMessage.mockRestore();
  actions.requestOperationHistory.mockRestore();
});
