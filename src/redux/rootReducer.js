import { combineReducers } from 'redux';

import signData from '../sign/reducer';
import documentData from '../workspace/reducer';
import generalData from './reducer';
import accountData from '../account/reducer';

const rootReducer = combineReducers(
  {
    signData,
    documentData,
    generalData,
    accountData,
  },
);

export default rootReducer;
