import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import SignPage from './sign/SignPage';

ReactDOM.render(
  <Provider store={store}>
    <SignPage />
  </Provider>,
  document.getElementById('root'),
);
