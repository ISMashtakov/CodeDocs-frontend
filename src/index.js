import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";

import store from './redux/store';
import SignPage from './sign/SignPage';
import Workspace from './workspace/Workspace';

function App(){
  return(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path='/login'> 
          <SignPage isLogin/> 
        </Route>
        <Route path='/signup'>
          <SignPage/>
        </Route>
        <Route path='/workspace'>
          <SignPage/>
        </Route>
        <Redirect from='/' to='/login'/>
      </Switch>
    </Router>
  </Provider>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
