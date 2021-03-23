import React from 'react';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';

function Avatar({ user, style }) {
  return (
    <div style={{
      ...FONTS.BODY, background: user.color, display: 'flex', borderRadius: '50%', width: 50, height: 50, color: COLORS.WHITE, ...style,
    }}
    >
      <span style={{ margin: 'auto' }}>{user.shortName}</span>
    </div>
  );
}

export default Avatar;
