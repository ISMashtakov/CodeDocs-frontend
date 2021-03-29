import { fireEvent } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function acceptDialog() {
  await act(async () => fireEvent.click(document.getElementById('general_items_CustomDialog_Dialog_ActionButton')));
}
