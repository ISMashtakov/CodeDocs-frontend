import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';

import { setChangeUsernameIsOpenAction } from './actions';
import * as mainStyle from '../style/style';
import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import changeUsernameIcon from '../images/icons/change_username_blue.png';
import usersApi from '../helpers/users_helper';
import { setMainUserAction } from '../redux/actions';

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
    <Dialog open={isOpen} style={{ bottom: '20%' }} id="account_ChangeUsernameWindow_Dialog">
      <div style={{
        ...FONTS.H2, display: 'flex', marginTop: 15, justifyContent: 'center',
      }}
      >
        <img src={changeUsernameIcon} alt="change_username_icon" style={{ height: 30, width: 'auto' }} />
        <span style={{ paddingTop: 5, marginLeft: 15 }}>Change username</span>
      </div>
      <DialogContent>

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

      </DialogContent>
      <DialogActions>
        <Button
          style={{ ...mainStyle.OUTLINED_BUTTON_STYLE, color: COLORS.BUTTON_BLUE, width: 150 }}
          onClick={() => setChangeUsernameIsOpen(false)}
          id="account_ChangeUsernameWindow_Dialog_CancelButton"
        >
          Cancel
        </Button>
        <Button
          style={{
            ...mainStyle.BUTTON_STYLE, backgroundColor: COLORS.BUTTON_BLUE, width: 150, boxShadow: '0 0 0 0', marginRight: 15,
          }}
          variant="contained"
          onClick={clickToSave}
          id="account_ChangeUsernameWindow_Dialog_SaveButton"
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
    isOpen: state.accountData.changeUsernameWindowIsOpen,
  };
}

export default connect(mapStateToProps, {
  setChangeUsernameIsOpen: setChangeUsernameIsOpenAction,
  setMainUser: setMainUserAction,
})(ChangeUsernameWindow);
