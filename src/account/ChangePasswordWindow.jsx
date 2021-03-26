import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';

import { setChangePasswordIsOpenAction } from './actions';
import * as mainStyle from '../style/style';
import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import changePasswordIcon from '../images/icons/change_password_blue.png';
import usersApi from '../helpers/users_helper';

const TEXT_FIELD_STYLE = { ...mainStyle.TEXT_FIELD_STYLE, width: 470 };

function ChangePasswordWindow({ mainUser, isOpen, setChangePasswordIsOpen }) {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();

  async function clickToSave() {
    const response = await usersApi.changePassword(mainUser, currentPassword, password);
    if (response.isGood) {
      setChangePasswordIsOpen(false);
      enqueueSnackbar({ text: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setPassword('');
      setErrors({});
    } else {
      setErrors(response.reason);
    }
  }

  return (
    <Dialog open={isOpen} style={{ bottom: '20%' }} id="account_ChangePasswordWindow_Dialog">
      <div style={{
        ...FONTS.H2, display: 'flex', marginTop: 15, justifyContent: 'center',
      }}
      >
        <img src={changePasswordIcon} alt="change_password_icon" style={{ height: 30, width: 'auto' }} />
        <span style={{ paddingTop: 5, marginLeft: 15 }}>Change password</span>
      </div>
      <DialogContent>
        <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 20 }}>Current password</div>
        <TextField
          id="account_ChangePasswordWindow_Dialog_CurrentPasswordTextField"
          variant="outlined"
          style={TEXT_FIELD_STYLE}
          InputProps={{ style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE }}
          value={currentPassword}
          error={!!errors.current_password}
          helperText={errors.current_password}
          type="password"
          onChange={(event) => setCurrentPassword(event.target.value)}
        />

        <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 20 }}>New password</div>
        <TextField
          variant="outlined"
          id="account_ChangePasswordWindow_Dialog_NewPasswordTextField"
          style={TEXT_FIELD_STYLE}
          InputProps={{ style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE }}
          value={password}
          error={!!errors.new_password}
          helperText={errors.new_password}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          style={{ ...mainStyle.OUTLINED_BUTTON_STYLE, color: COLORS.BUTTON_BLUE, width: 150 }}
          onClick={() => setChangePasswordIsOpen(false)}
          id="account_ChangePasswordWindow_Dialog_CancelButton"
        >
          Cancel
        </Button>
        <Button
          style={{
            ...mainStyle.BUTTON_STYLE, backgroundColor: COLORS.BUTTON_BLUE, width: 150, boxShadow: '0 0 0 0', marginRight: 15,
          }}
          variant="contained"
          onClick={clickToSave}
          id="account_ChangePasswordWindow_Dialog_SaveButton"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state) {
  return {
    mainUser: state.generalData.mainUser,
    isOpen: state.accountData.changePasswordWindowIsOpen,
  };
}

export default connect(mapStateToProps, {
  setChangePasswordIsOpen: setChangePasswordIsOpenAction,
})(ChangePasswordWindow);
