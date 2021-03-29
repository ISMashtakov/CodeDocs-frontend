import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';

import { setChangeUsernameIsOpenAction } from './actions';
import * as mainStyle from '../style/style';
import changeUsernameIcon from '../images/icons/change_username_blue.png';
import usersApi from '../helpers/users_helper';
import { setMainUserAction } from '../redux/actions';
import CustomDialog from '../general_items/CustomDialog';

const TEXT_FIELD_STYLE = { ...mainStyle.TEXT_FIELD_STYLE, width: 470 };

function ChangeUsernameWindow({
  mainUser, isOpen, setChangeUsernameIsOpen, setMainUser,
}) {
  const [errors, setErrors] = React.useState({});
  const [username, setUsername] = React.useState(mainUser.username);
  const [password, setPassword] = React.useState('');

  const { enqueueSnackbar } = useSnackbar();

  async function clickToSave() {
    const response = await usersApi.changeUsername(mainUser, username, password);
    if (response.isGood) {
      mainUser.username = username;
      setMainUser(mainUser);
      setChangeUsernameIsOpen(false);
      enqueueSnackbar({ text: 'Username changed successfully!', type: 'success' });
      setPassword('');
      setErrors({});
    } else {
      setErrors(response.reason);
    }
  }

  return (
    <CustomDialog
      icon={changeUsernameIcon}
      title="Change username"
      onCancel={() => setChangeUsernameIsOpen(false)}
      isOpen={isOpen}
      onAction={clickToSave}
      actionText="Save"
    >

      <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 20 }}>Username</div>
      <TextField
        variant="outlined"
        style={TEXT_FIELD_STYLE}
        id="account_ChangeUsernameWindow_Dialog_UsernameTextField"
        InputProps={{ style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE }}
        value={username}
        error={!!errors.new_username}
        helperText={errors.new_username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 20 }}>Current password</div>
      <TextField
        variant="outlined"
        id="account_ChangeUsernameWindow_Dialog_CurrentPasswordTextField"
        style={TEXT_FIELD_STYLE}
        InputProps={{ style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE }}
        value={password}
        error={!!errors.current_password}
        helperText={errors.current_password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />

    </CustomDialog>
  );
}

function mapStateToProps(state) {
  return {
    mainUser: state.generalData.mainUser,
    isOpen: state.accountData.changeUsernameWindowIsOpen,
  };
}

export default connect(mapStateToProps, {
  setChangeUsernameIsOpen: setChangeUsernameIsOpenAction,
  setMainUser: setMainUserAction,
})(ChangeUsernameWindow);
