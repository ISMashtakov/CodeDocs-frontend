import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import COLORS from './colors';
import FONTS from './fonts';

export const BUTTON_STYLE = {
  ...FONTS.BUTTON, background: COLORS.BUTTON_BLUE, borderRadius: '6px', color: COLORS.WHITE, height: 45,
};

export const OUTLINED_BUTTON_STYLE = {
  ...FONTS.BUTTON, borderRadius: '6px', height: 45,
};

export const TEXT_FIELD_STYLE = {
  ...FONTS.BODY, width: '404px', backgroundColor: 'white',
};

export const TEXT_FIELD_INPUT_PROPS_STYLE = {
  height: 50, backgroundColor: 'white',
};

export const TEXT_FIELD_TEXT_STYLE = {
  ...FONTS.CAPTION, textAlign: 'left', color: COLORS.TEXT_GRAY, paddingLeft: 15,
};

export const POPOVER_STYLE = {
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
};

export const CustomTooltip = withStyles({
  tooltip: {
    background: COLORS.TEXT_DARK_GRAY,
  },
})(Tooltip);
