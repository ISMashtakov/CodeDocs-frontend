import React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';

import logo from '../images/logo.png';
import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import authApi from '../helpers/auth_helper';
import { MainUser } from "../helpers/user";
import * as style from '../style/style';


const TEXT_FIELD_STYLE = {
  ...FONTS.BODY, background: COLORS.WHITE, border: `1px solid ${COLORS.BADGE_GRAY}`, borderRadius: '7px', width: "404px", height: 46, paddingLeft: 15, color: COLORS.BLACK
};
const BUTTON_STYLE = {
  ...style.BUTTON_STYLE, width: "404px", height: 45,
};
const TEXT_FIELD_TEXT_STYLE = {
  ...FONTS.CAPTION, textAlign: 'left', color: COLORS.DARK_BLUE, paddingLeft: 15
};
const PANEL_STYLE = {
  display: "flex", borderRadius: '7px 7px 7px 7px', display: 'inline-block', boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", padding: "15px 25px", marginTop: 52, background: COLORS.WHITE
};
const FORGOT_TEXT_STYLE = {
  ...FONTS.BODY, textDecoration: "none", color: COLORS.BLUE, float: "right", marginTop: 10
}

function PasswordField({style, value, onChange}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      disableUnderline
      style={TEXT_FIELD_STYLE}
      value={value} 
      onChange={onChange}
      type={showPassword ? 'text' : 'password'}
      endAdornment={(
        <InputAdornment position="end">
          <IconButton
            style={{color:COLORS.BADGE_GRAY}}
            onClick={() => { setShowPassword(!showPassword); }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
          )}
    />
  );
}

function TextFieldWithCheck({text, style, checkFunc, textIfExist, onChange, value}) {
  const [isExist, setIsExist] = React.useState(false);
  async function checkExisting()
  {
    const responce = await checkFunc(value);
    setIsExist(responce);
  }
  return(
    <div style={style} >
      <div style={TEXT_FIELD_TEXT_STYLE}>{text}</div>
      <Input disableUnderline style={TEXT_FIELD_STYLE} value={value} onChange={onChange} onBlur={checkExisting}/>
      <div style={{color: "red"}}> {isExist?textIfExist:""}</div>
    </div>
  )
}

function SignUp(){
  const [username, setUsername] = React.useState("");
  const [mail, setMail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  
  async function handlerSignUp() {
    const result = await authApi.signUp(username, mail, password);
    if (result)
    {
      setIsSnackbarOpen(true);
    }
    else
    {
      alert("problem with creating"); //TODO work with differents problems
    }
    
  }

  return (
    <div>
      <div style={PANEL_STYLE} id="sign_SignPage_SignUpTab_div">
        <TextFieldWithCheck text="Username" 
                            onChange={(event) => setUsername(event.target.value)} 
                            value={username} 
                            checkFunc={authApi.checkUsername} 
                            textIfExist="username is already taken" 
        />
        <TextFieldWithCheck text="Email" 
                            onChange={(event) => setMail(event.target.value)} 
                            value={mail} 
                            checkFunc={authApi.checkMail}
                            textIfExist="email is already taken"
                            style={{marginTop: 10}} 
        />
        <div style={{ ...TEXT_FIELD_TEXT_STYLE, marginTop: 10}}>Password</div>
        <div><PasswordField style={TEXT_FIELD_STYLE} value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        <Button variant="contained" disableElevation onClick={handlerSignUp} style={{ ...BUTTON_STYLE, marginTop: 20}}>SIGN UP</Button>
      </div>
      <div style={{marginTop: 30}}>
          <div ><Typography style={{fontSize: 22, fontFamily: "Calibri", fontWeight: 400}}>Already have an account? <Link href="/login">Login</Link></Typography></div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        message="Mail for activating send to mail"
        autoHideDuration={5000}
      />
    </div>
  );
}

function LogIn(){
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handlerLogIn() {
    const result = await authApi.logIn(username, password);
    console.log(result)
    if(result)
    {
      const user = new MainUser();
      user.accessToken = result["access"]
      user.refreshToken = result["refresh"]
      await user.update();
      user.saveToLocalStorage();
      console.log(user)
      document.location.href = "/workspace";
    }

  }

  return (
    <div>
      <div style={PANEL_STYLE} id="sign_SignPage_LogInTab_div">
        <div style={TEXT_FIELD_TEXT_STYLE}>Username</div>
        <Input disableUnderline style={TEXT_FIELD_STYLE} value={username} onChange={(event) => setUsername(event.target.value)} />
        <div style={{ ...TEXT_FIELD_TEXT_STYLE, marginTop: 10 }}>
          Password 
        </div>        
        <PasswordField style={TEXT_FIELD_STYLE} value={password} onChange={(event) => setPassword(event.target.value)}/>
        <div>
          <a href="#0" style={FORGOT_TEXT_STYLE}>Forgot password?</a>
        </div>
        <Button variant="contained" disableElevation onClick={handlerLogIn} style={{ ...BUTTON_STYLE, marginTop: 10}}>LOGIN</Button>
      </div>
      <div style={{marginTop: 20}}>
          <div ><Typography style={{...FONTS.BODY}}>New in Code Docs? <Link href="/signup">Sign Up</Link></Typography></div>
      </div>
    </div>
    
  );
}

function SignPage({isLogin}) {

  return (
    <div style={{height: '100vh', background: COLORS.LIGHT_BLUE }}>
      <div style={{
        display: 'block', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center',
      }}
      >
        <img src={logo} alt="logo" style={{ height: 80, width: "auto", marginTop: 50}} />
        <div style={{...FONTS.H1, color: COLORS.DARK_BLUE}}>{isLogin? "Login" : "Sign up"} Code Docs</div>
      {isLogin? <LogIn/> : <SignUp/>}
      </div>
    </div>
  );
}

export default SignPage;
