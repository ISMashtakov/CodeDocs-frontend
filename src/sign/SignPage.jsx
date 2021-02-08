import React from 'react';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import signBackground from '../images/signBackground.png';
import logo from '../images/logo.png';
import COLORS from '../style/colors';
import authApi from '../helpers/auth_helper';


const TAB_WIDTH = 205;
const TAB_HEIGHT = 50;
const TAB_STYLE = {
  opacity: 1, border: '1px solid', zIndex: 1, background: COLORS.LIGHT_GREY, color: COLORS.GREY, borderColor: COLORS.LIGHT_GREY, width: TAB_WIDTH, height: TAB_HEIGHT, fontSize: 15, fontFamily: 'Roboto',
};
const SELECT_TAB_STYLE = {
  ...TAB_STYLE, zIndex: 0, background: COLORS.LIGHT_GREY, color: COLORS.VIOLET,
};
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
  boxShadow: '0px 5px 5px 1px rgba(0,0,0,0.1)', width: TAB_WIDTH * 2, borderRadius: '0 0 7px 7px', display: 'block', marginLeft: 'auto', marginRight: 'auto', position: 'relative', top: -15, border: '1px solid', borderColor: COLORS.LIGHT_GREY,
};

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
      <div> {isExist?textIfExist:""}</div>
    </div>
  )
}


function SignUpTab() {
  return (
    <div style={TAB_PANEL_STYLE} id="sign_SignPage_SignUpTab_div">
      <div style={{ height: 15 }} />
      <TextFieldWithCheck text="Username" checkFunc={authApi.checkUsername} textIfExist="username alredy exist" />
      <TextFieldWithCheck text="Email address" checkFunc={authApi.checkMail} textIfExist="email alredy exist" style={{marginTop: 30}} />
      <div style={{ ...TEXT_FIELD_TEXT_STYLE, marginTop: 30 }}>Password</div>
      <PasswordField style={TEXT_FIELD_STYLE} />
      <Button variant="contained" style={{ ...BUTTON_STYLE, marginTop: 50, marginBottom: 20 }}>SIGN UP</Button>
    </div>
  );
}

function LogInTab() {
  return (
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
  );
}

function SignTabs() {
  const [value, setValue] = React.useState(0);

  return (
    <div>
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        TabIndicatorProps={{ hidden: true }}
        style={{
          width: TAB_WIDTH * 2, borderRadius: '7px', marginLeft: 'auto', marginRight: 'auto', height: TAB_HEIGHT + 15,
        }}
      >
        <Tab id="sign_SignPage_SignTabs_TabLogIn" label="LOG IN" style={{ ...(value === 0 ? SELECT_TAB_STYLE : TAB_STYLE), boxShadow: (value !== 0 ? '1px 1px 5px 1px rgba(0,0,0,0.3)' : 'none'), borderRadius: '0 7px 0 0' }} />
        <Tab id="sign_SignPage_SignTabs_TabSignUp" label="SIGN UP" style={{ ...(value === 1 ? SELECT_TAB_STYLE : TAB_STYLE), boxShadow: (value !== 1 ? '-1px 1px 5px 1px rgba(0,0,0,0.3)' : 'none'), borderRadius: '7px 0 0 0' }} />
      </Tabs>
      {(value === 1) ? <SignUpTab /> : <LogInTab />}
    </div>
  );
}

function SignPage() {
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
        <SignTabs />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, {})(SignPage);
