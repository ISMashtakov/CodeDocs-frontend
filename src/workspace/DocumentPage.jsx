import React from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import COLORS from '../style/colors';
import Workspace from "./Workspace";
import DocumentTab from './DocumentTab';


function DocumentPage() {
  return(
    <div>
      <Header/>
      <div style={{background: COLORS.LIGHT_GREY, display: "block", width: "100%", height: "calc(100vh - 50px)"}}>
        <div style={{height: 80, position: "relative"}} >
          <DocumentTab text="filename.py"/>
        </div>
        <Workspace/>
      </div>
    </div>
  )
  
}
function mapToState(state)
{
  return {

  }
}
export default connect(mapToState)(DocumentPage);