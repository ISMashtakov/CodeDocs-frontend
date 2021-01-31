import { combineReducers } from 'redux';

import signData from '../sign/reducer';

const rootReducer = combineReducers(
  {
    signData,
  },
);

export default rootReducer;
