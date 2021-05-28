import React from 'react';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import logo from '../images/logo.png';
import { PasswordField, PANEL_STYLE, BUTTON_STYLE } from './SignPage';
import * as mainStyle from '../style/style';
import authApi, { toLogin } from '../helpers/auth_helper';
import urlParams from '../helpers/url_helper';

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState('');
  const [rePassword, setRePassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [rePasswordError, setRePasswordError] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();

  async function resetHandler() {
    const result = await authApi.confirmResetPassword(
      urlParams.getUID(),
      urlParams.getToken(),
      password,
      rePassword,
    );
    if (result.isGood) {
      enqueueSnackbar({ text: 'The password has been changed successfully!', type: 'success' });
      setTimeout(() => toLogin(false), 2000);
    } else {
      const newPassword = result.new_password || '';
      const reNewPassword = result.re_new_password || '';
      const nonFieldErrors = result.non_field_errors || '';
      setPasswordError(newPassword);
      setRePasswordError(reNewPassword + nonFieldErrors);
    }
  }

  return (
    <div style={{ height: '100vh', background: COLORS.LIGHT_BLUE }}>
      <div style={{
        display: 'block', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center',
      }}
      >
        <img src={logo} alt="logo" style={{ height: 80, width: 'auto', marginTop: 50 }} />
        <div style={{ ...FONTS.H1, color: COLORS.DARK_BLUE }}>
          Reset your password
        </div>
        <div>
          <div style={{ ...PANEL_STYLE }} id="sign_ResetPasswordPage_div">
            <div style={mainStyle.TEXT_FIELD_TEXT_STYLE}>Password</div>
            <PasswordField
              id="sign_ResetPasswordPage_PasswordTextField"
              value={password}
              errorText={passwordError}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 10 }}>
              Repeat password
            </div>
            <PasswordField
              id="sign_SignPage_LogInTab_RePasswordTextField"
              value={rePassword}
              errorText={rePasswordError}
              onKeyDown={(e) => { if (e.key === 'Enter') resetHandler(); }}
              onChange={(event) => setRePassword(event.target.value)}
            />
            <br />

            <Button id="sign_SignPage_LogInTab_LoginButton" variant="contained" disableElevation onClick={resetHandler} style={{ ...BUTTON_STYLE, marginTop: 20 }}>CHANGE PASSWORD</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
