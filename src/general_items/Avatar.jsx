import React from 'react';
import viewerIcon from '../images/icons/viewer_grey.png';
import editorIcon from '../images/icons/editor_grey.png';
import ownerIcon from '../images/icons/owner_grey.png';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import { ACCESS_TYPES_NUMBER_TO_STRING, ACCESS_TYPES } from '../helpers/file';
import { CustomTooltip } from '../style/style';

const ACCESS_ICON_MAP = {
  [ACCESS_TYPES.OWNER]: ownerIcon,
  [ACCESS_TYPES.EDITOR]: editorIcon,
  [ACCESS_TYPES.VIEWER]: viewerIcon,
};

function Avatar({
  user, style, onClick, id, showTip = false, showAccess = false,
}) {
  return (
    <CustomTooltip
      title={(!showTip) ? '' : (
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
        {showAccess
          ? (
            <div
              style={{
                background: COLORS.WHITE, display: 'inline', position: 'absolute', borderRadius: '50%', width: 20, height: 20, right: -5, bottom: -5,
              }}
            >
              <img src={ACCESS_ICON_MAP[user.access]} alt="icon" style={{ marginTop: 2, marginLeft: 2 }} />
            </div>
          )
          : null}
      </div>
    </CustomTooltip>
  );
}

export default Avatar;
