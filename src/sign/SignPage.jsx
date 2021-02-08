import React from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import signBackground from '../images/signBackground.png';
import logo from '../images/logo.png';
import COLORS from '../style/colors';
import authApi from '../helpers/auth_helper';
import { selectTabAction } from './actions';


const TAB_WIDTH = 205;
const TEXT_FIELD_STYLE = {
  background: COLORS.WHITE, border: '2px solid', borderColor: COLORS.LIGHT_GREY, borderRadius: '7px', width: TAB_WIDTH * 2 - 32, height: 50, paddingLeft: 15, fontSize: 20, fontFamily: 'Roboto',
};
const BUTTON_STYLE = {
  background: COLORS.ORANGE, borderRadius: '7px', width: TAB_WIDTH * 2 - 32, height: 50, color: COLORS.WHITE, fontFamily: 'Roboto',
};
const TEXT_FIELD_TEXT_STYLE = {
  textAlign: 'left', marginLeft: 17, color: COLORS.GREY, fontSize: 24, fontFamily: 'Roboto',
};
const TAB_PANEL_STYLE = {
  boxShadow: '0px 5px 5px 1px rgba(0,0,0,0.3)', width: TAB_WIDTH * 2, borderRadius: '7px 7px 7px 7px', display: 'block', marginLeft: 'auto', marginRight: 'auto', position: 'relative', top: -15, border: '1px solid', borderColor: COLORS.LIGHT_GREY,
};
const PANEL_UNDER_TAB = {
  marginTop: 10, marginBottom: 10
}

function PasswordField({style}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      disableUnderline
      style={style}
      type={showPassword ? 'text' : 'password'}
      endAdornment={(
        <InputAdornment position="end">
          <IconButton
            onClick={() => { setShowPassword(!showPassword); }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
          )}
    />
  );
}

function TextFieldWithCheck({text, style, checkFunc, textIfExist}) {
  const [value, setValue] = React.useState("");
  const [isExist, setIsExist] = React.useState(false);
  async function checkExisting()
  {
    const responce = await checkFunc(value);
    setIsExist(responce);
  }
  return(
    <div style={style} >
      <div style={TEXT_FIELD_TEXT_STYLE}>{text}</div>
      <Input disableUnderline style={TEXT_FIELD_STYLE} value={value} onChange={(event) => setValue(event.target.value)} onBlur={checkExisting}/>
      <div style={{color: "red"}}> {isExist?textIfExist:""}</div>
    </div>
  )
}

function SignUp(){
  return (
    <div>
      <div style={TAB_PANEL_STYLE} id="sign_SignPage_SignUpTab_div">
        <div style={{ height: 15 }} />
        <TextFieldWithCheck text="Username" checkFunc={authApi.checkUsername} textIfExist="username is already taken" />
        <TextFieldWithCheck text="Email address" checkFunc={authApi.checkMail} textIfExist="email is already taken" style={{marginTop: 30}} />
        <div style={{ ...TEXT_FIELD_TEXT_STYLE, marginTop: 30 }}>Password</div>
        <PasswordField style={TEXT_FIELD_STYLE} />
        <Button variant="contained" style={{ ...BUTTON_STYLE, marginTop: 50, marginBottom: 20 }}>SIGN UP</Button>
      </div>
    </div>
  );
}

function LogIn(){
  return (
    <div>
      <div style={TAB_PANEL_STYLE} id="sign_SignPage_LogInTab_div">
        <div style={{ height: 15 }} />
        <div style={TEXT_FIELD_TEXT_STYLE}>Username or E-mail</div>
        <Input disableUnderline style={TEXT_FIELD_STYLE} />
        <div style={{ ...TEXT_FIELD_TEXT_STYLE, marginTop: 30 }}>Password</div>
        <PasswordField style={TEXT_FIELD_STYLE} />
        <div style={{
          textAlign: 'right', fontSize: 17, fontFamily: 'Arimo', marginTop: 15, marginRight: 17,
        }}
        >
          <u><a href="#0" style={{ color: COLORS.GREY }}>Forgot password or username?</a></u>
        </div>
        <Button variant="contained" style={{ ...BUTTON_STYLE, marginTop: 50, marginBottom: 20 }}>LOG IN</Button>
      </div>
      <div style={{...TAB_PANEL_STYLE, marginTop: 20}}>
          <div style={PANEL_UNDER_TAB}><Typography style={{fontSize: 20}}>New in CodeDocs? <Link style={{marginLeft:10, fontSize: 20}} href="/signup">Sign Up</Link></Typography></div>
      </div>
    </div>
    
  );
}

function SignPage({isLogin}) {

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <img
        src={signBackground}
        alt="signBackground"
        style={{
          zIndex: -10, position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
        }}
      />
      <div style={{
        display: 'block', marginLeft: 'auto', marginRight: 'auto', width: 480, textAlign: 'center',
      }}
      >
        <img src={logo} alt="logo" style={{ width: 463, top: 46 }} />
        <font style={{ fontSize: 28, fontFamily: 'Segoe UI', color: COLORS.GREY }}><p>Welcome to Code Docs</p></font>
      {isLogin? <LogIn/> : <SignUp/>}
      </div>
    </div>
  );
}

export default SignPage;
