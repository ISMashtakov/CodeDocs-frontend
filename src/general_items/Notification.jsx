import React from 'react';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';

const NOTIFICATIONS_STYLE = {
  ...FONTS.H3, display: 'flex', width: 271, padding: '15px 20px', boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)', borderRadius: '6px', backgroundColor: COLORS.TEXT_DARK_GRAY, color: COLORS.WHITE,
};

export default function Notification(key, { text, type }) {
  switch (type) {
    case 'success':
      return (
        <div id={key} style={{ ...NOTIFICATIONS_STYLE }}>
          <CheckCircleOutlinedIcon style={{ color: COLORS.ICON_GREEN, marginRight: 20 }} />
          {text}
        </div>
      );
    case 'error':
      return (
        <div id={key} style={{ ...NOTIFICATIONS_STYLE }}>
          <CancelOutlinedIcon style={{ color: COLORS.ICON_RED, marginRight: 20 }} />
          {text}
        </div>
      );
    default:
      return <div>pad type</div>;
  }
}
