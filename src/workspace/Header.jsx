import React from 'react';
import { connect } from 'react-redux';

import COLORS from '../style/colors';
import logo from '../images/logo.png';
import Avatar from '../general_items/Avatar';


function Header({ user }) {
  return(
    <div style={{width: "100%", height: 50, background: COLORS.VIOLET}}>
        <img src={logo} alt="logo" style={{display: "inline-block", height: 50, width: "auto"}} />
        <Avatar user={user} style={{height:50, width:50, float: "right", marginRight: 10}}/>
    </div>
  )
  
}
function mapToState(state)
{
  return {
    user: state.documentData.user
  }
}
export default connect(mapToState)(Header);