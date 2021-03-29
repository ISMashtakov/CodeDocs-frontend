import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';

import { setChangeEmailIsOpenAction } from './actions';
import * as mainStyle from '../style/style';
import changeMailIcon from '../images/icons/change_email_blue.png';
import usersApi from '../helpers/users_helper';
import { setMainUserAction } from '../redux/actions';
import CustomDialog from '../general_items/CustomDialog';

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
      enqueueSnackbar({ text: 'Email changed successfully!', type: 'success' });
      setMainUser(mainUser);
      setChangeEmailIsOpen(false);

      setErrors({});
    } else {
      setErrors(response.reason);
    }
  }

  return (
    <CustomDialog
      icon={changeMailIcon}
      title="Change email"
      onCancel={() => setChangeEmailIsOpen(false)}
      isOpen={isOpen}
      onAction={clickToSave}
      actionText="Save"
    >

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
    </CustomDialog>
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
