import React from 'react';
import { connect } from 'react-redux';

import COLORS from '../style/colors';


function DocumentTab({ text }) {
  return(
    <div style={{width: 200, height:40, background: COLORS.WHITE, position: "absolute", display: "flex", bottom: 0, left:30, borderRadius: '7px 7px 0px 0px', fontSize: 20}}>
        <span style={{margin: "auto"}}>
            {text}
        </span>
    </div>
  )
}
function mapToState(state)
{
  return {
  }
}
export default connect(mapToState)(DocumentTab);