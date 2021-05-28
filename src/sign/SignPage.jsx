import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';

import logo from '../images/logo.png';
import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import authApi, { getAfterLoginPage } from '../helpers/auth_helper';
import { MainUser } from '../helpers/user';
import * as mainStyle from '../style/style';
import { setProblems, setWrongLogin } from './actions';
import { openPage } from '../helpers/general_helpers';
import CustomDialog from '../general_items/CustomDialog';
import changePasswordIcon from '../images/icons/change_password_blue.png';

export const BUTTON_STYLE = {
  ...mainStyle.BUTTON_STYLE, width: '404px',
};
export const PANEL_STYLE = {
  borderRadius: '6px', display: 'inline-block', boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)', padding: '15px 25px', marginTop: 52, background: COLORS.WHITE,
};
const FORGOT_TEXT_STYLE = {
  ...FONTS.BODY, textDecoration: 'none', color: COLORS.BLUE, float: 'right', marginTop: 20,
};
const LOGIN_ERROR_TEXT_STYLE = {
  ...FONTS.H3, color: COLORS.TEXT_RED,
};

export function PasswordField({
  value, onChange, id, onKeyDown, errorText = '',
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <TextField
      style={mainStyle.TEXT_FIELD_STYLE}
      id={id}
      key={id}
      onKeyDown={onKeyDown}
      value={value}
      error={!!errorText}
      variant="outlined"
      onChange={onChange}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE,
        endAdornment:
  <InputAdornment position="end">
    <IconButton
      style={{ color: COLORS.BADGE_GRAY, marginRight: 5 }}
      onClick={() => { setShowPassword(!showPassword); }}
    >
      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
    </IconButton>
  </InputAdornment>,
      }}
      helperText={errorText}
    />
  );
}

function TextFieldWithCheck({
  label, style, checkFunc, onChange, value, id, problem = '',
}) {
  const [text, setText] = React.useState('');

  async function checkExisting() {
    const responce = await checkFunc(value);
    setText(responce);
  }
  const error = !!(text || problem);
  return (
    <div style={style} id={id}>
      <div style={mainStyle.TEXT_FIELD_TEXT_STYLE}>{label}</div>
      <TextField
        style={mainStyle.TEXT_FIELD_STYLE}
        error={error}
        value={value}
        variant="outlined"
        onChange={onChange}
        onBlur={checkExisting}
        InputProps={{
          style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE,
          endAdornment:
            (error) ? (
              <InputAdornment position="end">
                <InfoOutlinedIcon style={{ color: COLORS.BUTTON_RED, marginRight: 17 }} />
              </InputAdornment>
            )
              : null,
        }}
        helperText={text || problem}
      />
    </div>
  );
}

function mapStateToPropsSignUp(state) {
  return {
    passwordProblem: state.signData.passwordProblem,
    emailProblem: state.signData.emailProblem,
    usernameProblem: state.signData.usernameProblem,
  };
}

const SignUp = connect(mapStateToPropsSignUp,
  { setProblemsDispatched: setProblems })(({
  passwordProblem, emailProblem, usernameProblem, setProblemsDispatched,
}) => {
  const [username, setUsername] = React.useState('');
  const [mail, setMail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();

  async function handlerSignUp() {
    const result = await authApi.signUp(username, mail, password);
    if (result.isGood) {
      enqueueSnackbar({ text: 'Activation email was sended!', type: 'success' });
    } else {
      setProblemsDispatched(result);
    }
  }

  return (
    <div>
      <div style={PANEL_STYLE} id="sign_SignPage_SignUp_div">
        <TextFieldWithCheck
          label="Username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
          checkFunc={(...args) => authApi.checkUsername(...args)}
          id="sign_SignPage_SignUp_usernameDiv"
          problem={usernameProblem}
        />
        <TextFieldWithCheck
          label="Email"
          onChange={(event) => setMail(event.target.value)}
          value={mail}
          checkFunc={(...args) => authApi.checkMail(...args)}
          style={{ marginTop: 10 }}
          id="sign_SignPage_SignUp_mailDiv"
          problem={emailProblem}
        />
        <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 10 }}>Password</div>
        <div><PasswordField errorText={passwordProblem} value={password} onChange={(event) => setPassword(event.target.value)} id="sign_SignPage_SignUp_passwordInput" /></div>

        <Button id="sign_SignPage_SignUp_signupButton" variant="contained" disableElevation onClick={handlerSignUp} style={{ ...BUTTON_STYLE, marginTop: 20 }}>SIGN UP</Button>
      </div>
      <div style={{ marginTop: 30 }}>
        <div>
          <Typography style={{ ...FONTS.H3 }}>
            {'Already have an account? '}
            <Link href="/login">Login</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
});

function mapStateToPropsLogIn(state) {
  return {
    wrongLogin: state.signData.wrongLogin,
  };
}

const LogIn = connect(mapStateToPropsLogIn, {
  setWrongLoginDispatched: setWrongLogin,
})(({ wrongLogin, setWrongLoginDispatched }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [sendPasswordWindowIsOpen, setSendPasswordWindowIsOpen] = React.useState(false);
  const [resetPasswordMail, setResetPasswordMail] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();

  async function handlerLogIn() {
    const result = await authApi.logIn(username, password);
    if (result.isGood) {
      const user = new MainUser();
      user.accessToken = result.access;
      user.refreshToken = result.refresh;
      user.saveToLocalStorage();
      openPage(getAfterLoginPage());
    } else if (result.problem) {
      setWrongLoginDispatched(true);
    }
  }

  async function ResetPassword() {
    if (resetPasswordMail === '') {
      enqueueSnackbar({ text: 'Field can not be empty!', type: 'error' });
      return;
    }

    const response = await authApi.resetPassword(resetPasswordMail);
    if (response.isGood) {
      enqueueSnackbar({ text: 'Reset password email was sended!', type: 'success' });
      setSendPasswordWindowIsOpen(false);

      setErrors({});
    } else {
      setErrors(response.reason);
    }
  }

  return (
    <div>
      <div style={PANEL_STYLE} id="sign_SignPage_LogInTab_div">
        {(wrongLogin)
          ? (
            <div style={{ ...LOGIN_ERROR_TEXT_STYLE, display: 'inline-flex', marginBottom: 20 }}>
              <ErrorOutlineOutlinedIcon style={{ marginRight: 20 }} />
              Username or password is incorrect
            </div>
          )
          : null}
        <div style={mainStyle.TEXT_FIELD_TEXT_STYLE}>Username or Email</div>
        <TextField
          id="sign_SignPage_LogInTab_UsernameTextField"
          variant="outlined"
          onKeyDown={(e) => { if (e.key === 'Enter') handlerLogIn(); }}
          style={mainStyle.TEXT_FIELD_STYLE}
          InputProps={{ style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE }}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 10 }}>
          Password
        </div>
        <PasswordField
          id="sign_SignPage_LogInTab_PasswordTextField"
          value={password}
          onKeyDown={(e) => { if (e.key === 'Enter') handlerLogIn(); }}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div>
          <a href="#" style={FORGOT_TEXT_STYLE} onClick={() => setSendPasswordWindowIsOpen(true)}>Forgot password?</a>
        </div>
        <Button id="sign_SignPage_LogInTab_LoginButton" variant="contained" disableElevation onClick={handlerLogIn} style={{ ...BUTTON_STYLE, marginTop: 20 }}>LOGIN</Button>
      </div>
      <div style={{ marginTop: 20 }}>
        <div>
          <Typography style={{ ...FONTS.H3 }}>
            {'New in Code Docs? '}
            <Link href="/signup">Sign Up</Link>
          </Typography>
        </div>
      </div>
      <CustomDialog
        icon={changePasswordIcon}
        title="Reset password"
        onCancel={() => setSendPasswordWindowIsOpen(false)}
        isOpen={sendPasswordWindowIsOpen}
        onAction={ResetPassword}
        actionText="Reset"
      >
        <div style={{ ...mainStyle.TEXT_FIELD_TEXT_STYLE, marginTop: 20 }}>Email</div>
        <TextField
          variant="outlined"
          id="sign_SignPage_LogInTab_ResetPasswordWindow_EmailField"
          style={{ ...mainStyle.TEXT_FIELD_STYLE, width: 470 }}
          InputProps={{ style: mainStyle.TEXT_FIELD_INPUT_PROPS_STYLE }}
          value={resetPasswordMail}
          type="email"
          error={!!errors.email}
          helperText={errors.email}
          onChange={(event) => setResetPasswordMail(event.target.value)}
        />
      </CustomDialog>
    </div>

  );
});

function SignPage({ isLogin }) {
  return (
    <div style={{ height: '100vh', background: COLORS.LIGHT_BLUE }}>
      <div style={{
        display: 'block', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center',
      }}
      >
        <img src={logo} alt="logo" style={{ height: 80, width: 'auto', marginTop: 50 }} />
        <div style={{ ...FONTS.H1, color: COLORS.DARK_BLUE }}>
          {isLogin ? 'Login' : 'Sign up'}
          {' '}
          Code Docs
        </div>
        {isLogin ? <LogIn /> : <SignUp />}
      </div>
    </div>
  );
}

export default SignPage;
