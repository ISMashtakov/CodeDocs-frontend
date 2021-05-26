import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';

import { setDeleteUserIsOpenAction } from './actions';
import * as mainStyle from '../style/style';
import changePasswordIcon from '../images/icons/change_password_blue.png';
import usersApi from '../helpers/users_helper';
import CustomDialog from '../general_items/CustomDialog';
import { toLogin } from '../helpers/auth_helper';

const TEXT_FIELD_STYLE = { ...mainStyle.TEXT_FIELD_STYLE, width: 470 };

function DeleteUserWindow({ mainUser, isOpen, setDeleteUserIsOpen }) {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});

  async function clickToDelete() {
    const response = await usersApi.deleteUser(mainUser, currentPassword);
    if (response.isGood) {
      toLogin();
    } else {
      setErrors(response.reason);
    }
  }

  return (
    <CustomDialog
      icon={changePasswordIcon}
      title="Delete account"
      onCancel={() => setDeleteUserIsOpen(false)}
      isOpen={isOpen}
      onAction={clickToDelete}
      actionText="Delete"
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
    </CustomDialog>
  );
}

function mapStateToProps(state) {
  return {
    mainUser: state.generalData.mainUser,
    isOpen: state.accountData.deleteUserWindowIsOpen,
  };
}

export default connect(mapStateToProps, {
  setDeleteUserIsOpen: setDeleteUserIsOpenAction,
})(DeleteUserWindow);
