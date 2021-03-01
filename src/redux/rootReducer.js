import { combineReducers } from 'redux';

import signData from '../sign/reducer';
import documentData from '../workspace/reducer';

const rootReducer = combineReducers(
  {
    signData,
    documentData,
  },
);

export default rootReducer;
