import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';

import { setChangeEmailIsOpenAction } from './actions';
import * as mainStyle from '../style/style';
import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import changeMailIcon from '../images/icons/change_email_blue.png';
import usersApi from '../helpers/users_helper';
import { setMainUserAction } from '../redux/actions';

const TEXT_FIELD_STYLE = { ...mainStyle.TEXT_FIELD_STYLE, width: 470 };

function ChangeEmailWindow({
  mainUser, isOpen, setChangeEmailIsOpen, setMainUser,
}) {
  const [errors, setErrors] = React.useState({});
  const [email, setEmail] = React.useState(mainUser.mail);

  const { enqueueSnackbar } = useSnackbar();

  async function clickToSave() {
    const response = await usersApi.changeEmail(mainUser, email);
    if (response.isGood) {
      mainUser.mail = email;
      setMainUser(mainUser);
      setChangeEmailIsOpen(false);
      enqueueSnackbar({ text: 'Email changed successfully!', type: 'success' });

      setErrors({});
    } else {
      setErrors(response.reason);
    }
  }

  return (
    <Dialog open={isOpen} style={{ bottom: '20%' }} id="account_ChangeEmailWindow_Dialog">
      <div style={{
        ...FONTS.H2, display: 'flex', marginTop: 15, justifyContent: 'center',
      }}
      >
        <img src={changeMailIcon} alt="change_mail_icon" style={{ height: 30, width: 'auto' }} />
        <span style={{ paddingTop: 5, marginLeft: 15 }}>Change mail</span>
      </div>
      <DialogContent>

        <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 20 }}>Email</div>
        <TextField
          variant="outlined"
          id="account_ChangeEmailWindow_Dialog_EmailTextField"
          style={TEXT_FIELD_STYLE}
          InputProps={{ style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE }}
          value={email}
          type="email"
          error={!!errors.email}
          helperText={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />

      </DialogContent>
      <DialogActions>
        <Button
          style={{ ...mainStyle.OUTLINED_BUTTON_STYLE, color: COLORS.BUTTON_BLUE, width: 150 }}
          onClick={() => setChangeEmailIsOpen(false)}
          id="account_ChangeEmailWindow_Dialog_CancelButton"
        >
          Cancel
        </Button>
        <Button
          style={{
            ...mainStyle.BUTTON_STYLE, backgroundColor: COLORS.BUTTON_BLUE, width: 150, boxShadow: '0 0 0 0', marginRight: 15,
          }}
          variant="contained"
          onClick={clickToSave}
          id="account_ChangeEmailWindow_Dialog_SaveButton"
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
    isOpen: state.accountData.changeMailWindowIsOpen,
  };
}

export default connect(mapStateToProps, {
  setChangeEmailIsOpen: setChangeEmailIsOpenAction,
  setMainUser: setMainUserAction,
})(ChangeEmailWindow);
