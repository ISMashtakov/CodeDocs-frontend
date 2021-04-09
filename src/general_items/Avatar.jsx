import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import { ACCESS_TYPES_NUMBER_TO_STRING } from '../helpers/file';

const CustomTooltip = withStyles({
  tooltip: {
    background: COLORS.TEXT_DARK_GRAY,
  },
})(Tooltip);

function Avatar({
  user, style, onClick, id,
}) {
  return (
    <CustomTooltip
      title={(
        <div>
          <div style={{ ...FONTS.CAPTION, color: COLORS.WHITE, textAlign: 'center' }}>{user.username}</div>
          <div style={{ ...FONTS.SUBTITLE, color: COLORS.TEXT_GRAY, textAlign: 'center' }}>{`(${ACCESS_TYPES_NUMBER_TO_STRING[user.access]})`}</div>
        </div>
  )}
    >
      <div
        id={id}
        style={{
          ...FONTS.BODY, cursor: (onClick ? 'pointer' : 'default'), background: user.color, display: 'flex', borderRadius: '50%', width: 50, height: 50, color: COLORS.WHITE, ...style,
        }}
        onClick={onClick}
      >
        <span style={{ margin: 'auto' }}>{user.shortName}</span>
      </div>
    </CustomTooltip>
  );
}

export default Avatar;
