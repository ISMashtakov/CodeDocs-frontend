import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import * as style from '../style/style';
import logo from '../images/logo.png';
import Avatar from '../general_items/Avatar';

export const HEADER_HEIGHT = 75;

function Header({ user, filename, collaborators }) {
  return (
    <div style={{ width: '100%', height: HEADER_HEIGHT, background: COLORS.WHITE }}>
      <img
        src={logo}
        alt="logo"
        style={{
          display: 'inline-block', height: 55, width: 'auto', float: 'left', marginLeft: 25, marginTop: 7,
        }}
      />
      <div style={{ float: 'left', marginTop: 5, marginLeft: 30 }}>
        <div style={{ ...FONTS.H2, color: COLORS.TEXT_GRAY }}>{filename}</div>
        <div style={{ ...FONTS.H3, marginTop: 14 }}>
          <span>New</span>
          <span style={{ marginLeft: 35 }}>Run</span>
          <span style={{ marginLeft: 35 }}>Download</span>
          <span style={{ marginLeft: 35 }}>Settings</span>
        </div>
      </div>

      {(user)
        ? <Avatar user={user} style={{ float: 'right', marginRight: 32, marginTop: 12 }} />
        : null}
      <Button style={{
        ...style.BUTTON_STYLE, float: 'right', height: 37, width: 118, marginTop: 19, marginRight: 35,
      }}
      >
        SHARE CODE
      </Button>
      <div style={{ float: 'right', marginTop: 12, marginRight: 50 }}>
        {
            collaborators.map((item, i) => (
              <div
                key={JSON.stringify(item)}
                style={{
                  display: 'inline-block', position: 'relative', left: 10 * (collaborators.length - i - 1), zIndex: i,
                }}
              >
                <Avatar user={item} style={{}} />
              </div>
            ))
          }
      </div>

    </div>
  );
}
function mapToState(state) {
  return {
    user: state.documentData.user,
    filename: state.documentData.filename,
    collaborators: state.documentData.collaborators,
  };
}
export default connect(mapToState)(Header);
