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
import authApi from '../helpers/auth_helper';
import { MainUser } from "../helpers/user";


const TEXT_FIELD_STYLE = {
  background: COLORS.WHITE, border: `1px solid ${COLORS.GREY}`, borderRadius: '7px', width: "340px", height: 50, paddingLeft: 15, fontSize: 20, fontFamily: 'Roboto',
};
const BUTTON_STYLE = {
  display: 'block', background: COLORS.BUTTON_ORANGE, borderRadius: '10px', width: "340px", height: 50,  color: COLORS.WHITE, fontSize: 18,
};
const TEXT_FIELD_TEXT_STYLE = {
  display: "block", textAlign: 'left', marginBottom: 5, marginLeft: 15, color: COLORS.DARK_BLUE, fontSize: 22, fontFamily: 'Calibri',
};
const PANEL_STYLE = {
  borderRadius: '7px 7px 7px 7px', display: 'inline-block', border: `1px solid ${COLORS.BORDER_BLUE}`, paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40, marginTop: 60
};

function PasswordField({style, value, onChange}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      disableUnderline
      style={style}
      value={value} 
      onChange={onChange}
      type={showPassword ? 'text' : 'password'}
      endAdornment={(
        <InputAdornment position="end">
          <IconButton
            style={{color:COLORS.GREY}}
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
        <TextFieldWithCheck text="Email address" 
                            onChange={(event) => setMail(event.target.value)} 
                            value={mail} 
                            checkFunc={authApi.checkMail}
                            textIfExist="email is already taken"
                            style={{marginTop: 30}} 
        />
        <div style={{ ...TEXT_FIELD_TEXT_STYLE, marginTop: 30}}>Password</div>
        <PasswordField style={TEXT_FIELD_STYLE} value={password} onChange={(event) => setPassword(event.target.value)} />
        <Button variant="contained" onClick={handlerSignUp} style={{ ...BUTTON_STYLE, marginTop: 50, marginBottom: 20 }}>SIGN UP</Button>
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
        <div style={{ ...TEXT_FIELD_TEXT_STYLE, marginTop: 35 }}>
          Password 
          <a href="#0" 
            style={{ textDecoration: "none", color: COLORS.BLUE, float:"right", fontFamily: "Calibri"}}
          >Forgot password?</a>
          </div>
        
        <PasswordField style={TEXT_FIELD_STYLE} value={password} onChange={(event) => setPassword(event.target.value)}/> 
        <Button variant="contained" onClick={handlerLogIn} style={{ ...BUTTON_STYLE, marginTop: 30}}>LOGIN</Button>
      </div>
      <div style={{marginTop: 30}}>
          <div ><Typography style={{fontSize: 22, fontFamily: "Calibri"}}>New in Code Docs? <Link href="/signup">Sign Up</Link></Typography></div>
      </div>
    </div>
    
  );
}

function SignPage({isLogin}) {

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{
        display: 'block', marginLeft: 'auto', marginRight: 'auto', width: 480, textAlign: 'center',
      }}
      >
        <img src={logo} alt="logo" style={{ height: 110, marginTop: 50}} />
        <Typography style={{ fontSize: 40, color: COLORS.DARK_BLUE}}>{isLogin? "Login" : "Sign up"} Code Docs</Typography>
      {isLogin? <LogIn/> : <SignUp/>}
      </div>
    </div>
  );
}

export default SignPage;
