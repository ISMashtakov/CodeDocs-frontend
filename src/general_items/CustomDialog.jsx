import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import * as mainStyle from '../style/style';
import COLORS from '../style/colors';
import FONTS from '../style/fonts';

export default function CustomDialog({
  icon, title, children, onCancel,
  isOpen, onAction, actionText, contentStyle = {}, buttonWidth = 150,
}) {
  return (
    <Dialog
      open={isOpen}
      style={{ bottom: '20%' }}
      id="general_items_CustomDialog_Dialog"
      onClose={onCancel}
    >
      <div style={{
        ...FONTS.H2, display: 'flex', marginTop: 15, justifyContent: 'center',
      }}
      >
        <img src={icon} alt="icon" style={{ height: 30, width: 'auto' }} />
        <span style={{ paddingTop: 5, marginLeft: 15 }}>{title}</span>
      </div>
      <DialogContent style={{ ...contentStyle }}>
        {children}
      </DialogContent>
      {onAction === undefined ? null
        : (
          <DialogActions>
            <Button
              style={{
                ...mainStyle.OUTLINED_BUTTON_STYLE,
                color: COLORS.BUTTON_BLUE,
                width: buttonWidth,
              }}
              onClick={onCancel}
              id="general_items_CustomDialog_Dialog_CancelButton"
            >
              Cancel
            </Button>
            <Button
              style={{
                ...mainStyle.OUTLINED_BUTTON_STYLE,
                color: COLORS.BUTTON_BLUE,
                width: buttonWidth,
                marginRight: 15,
              }}
              onClick={onAction}
              id="general_items_CustomDialog_Dialog_ActionButton"
            >
              {actionText}
            </Button>
          </DialogActions>
        )}
    </Dialog>
  );
}
