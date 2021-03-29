import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';

import { setChangePasswordIsOpenAction } from './actions';
import * as mainStyle from '../style/style';
import changePasswordIcon from '../images/icons/change_password_blue.png';
import usersApi from '../helpers/users_helper';
import CustomDialog from '../general_items/CustomDialog';

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
    <CustomDialog
      icon={changePasswordIcon}
      title="Change password"
      onCancel={() => setChangePasswordIsOpen(false)}
      isOpen={isOpen}
      onAction={clickToSave}
      actionText="Save"
    >
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
    </CustomDialog>
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
