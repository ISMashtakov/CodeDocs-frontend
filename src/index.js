import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";

import store from './redux/store';
import SignPage from './sign/SignPage';
import DocumentPage from './workspace/DocumentPage';
import MailActivatePage from './sign/MailActivatePage';
import TEXT from './sockets';

function App(){
  return(
  <Provider store={store}>
    <style>{`
      body {
        margin: 0px;
        padding: 0px;
      }
    `}</style>
    <Router>
      <Switch>
        <Route path='/login'> 
          <SignPage isLogin/> 
        </Route>
        <Route path='/signup'>
          <SignPage/>
        </Route>
        <Route path='/workspace'>
          <TEXT/>
        </Route>
        <Route path='/activate'>
          <MailActivatePage/>
        </Route>
        <Redirect from='/' to='/workspace'/>
      </Switch>
    </Router>
  </Provider>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
