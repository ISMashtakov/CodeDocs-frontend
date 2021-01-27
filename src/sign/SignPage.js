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
import { color1, color2, color3, color4, color5 } from '../style/colors';


const tab_width = 205;
const tab_height = 50;
const tab_style = {opacity: 1, border: "1px solid", zIndex: 1, background: color5, color: color4, borderColor: color5, width: tab_width, height: tab_height, fontSize: 15, fontFamily: "Roboto"}
const select_tab_style = {...tab_style, zIndex: 0, background: color5, color: color3}
const text_field_style = {background: color2, border: "2px solid", borderColor: color5, borderRadius: "7px", width: tab_width*2 - 32, height: 50, paddingLeft: 15, fontSize: 20, fontFamily: "Roboto"}
const button_style = {background: color1, borderRadius: "7px", width: tab_width*2 - 32, height: 50, color: color2, fontFamily: "Roboto"}
const text_field_text_style = {textAlign: "left", marginLeft: 17, color: color4, fontSize: 24, fontFamily: "Roboto"}
const tab_panel_style = {boxShadow: "0px 5px 5px 1px rgba(0,0,0,0.1)", width: tab_width*2, borderRadius: "0 0 7px 7px", display: "block", marginLeft: "auto", marginRight: "auto", position: "relative", top: -15, border: "1px solid", borderColor: color5}


function PasswordField({style}) {
    const [show_password, setShowPassword] = React.useState(false);

    return (
        <Input disableUnderline style={style} type={show_password ? 'text' : 'password'} endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={()=>{setShowPassword(!show_password)}}
              >
                {show_password ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }/>
    )
    
}

function SignUpTab() {
    return(
        <div style={{...tab_panel_style}} id={"sign_SignPage_SignUpTab_div"}>
            <div style={{height: 15}}/>
            <div style={{...text_field_text_style}}>Username</div>
            <Input disableUnderline style={{...text_field_style}} />
            <div style={{...text_field_text_style, marginTop: 30}}>Email address</div>
            <Input disableUnderline style={{...text_field_style}} />
            <div style={{...text_field_text_style, marginTop: 30}}>Password</div>
            <PasswordField  style={{...text_field_style}}/>
            <Button variant="contained" style={{...button_style, marginTop: 50, marginBottom: 20}} >SIGN UP</Button>
        </div>
    )    
}

function SignInTab() {
    return(
        <div style={{...tab_panel_style}} id={"sign_SignPage_SignInTab_div"}>
            <div style={{height: 15}}/>
            <div style={{...text_field_text_style}}>Username or E-mail</div>
            <Input disableUnderline style={{...text_field_style}} />
            <div style={{...text_field_text_style, marginTop: 30}}>Password</div>
            <PasswordField  style={{...text_field_style}}/>
            <div style={{textAlign: "right", fontSize: 17, fontFamily: "Arimo", marginTop: 15, marginRight: 17}}><u><a href="#0" style={{color: color4}}>Forgot password or username?</a></u></div>
            <Button variant="contained" style={{...button_style, marginTop: 50, marginBottom: 20}} >SIGN IN</Button>
        </div>
    )    
}

function SignTabs() {
    const [value, setValue] = React.useState(0);

    return (
        <div >
            <Tabs value={value} onChange={(_, newValue)=>setValue(newValue)} TabIndicatorProps={{hidden: true}} style={{width:tab_width*2, borderRadius: "7px", marginLeft: "auto", marginRight: "auto", height: tab_height+15}}>
                <Tab id={"sign_SignPage_SignTabs_TabSingUp"} label="SIGN UP" style={{...(value===0? select_tab_style : tab_style), boxShadow: (value!==0? "-1px 1px 5px 1px rgba(0,0,0,0.3)" : "none"), borderRadius: "7px 0 0 0",}}/>
                <Tab id={"sign_SignPage_SignTabs_TabSingIn"} label="SIGN IN" style={{...(value===1? select_tab_style : tab_style), boxShadow: (value!==1? "1px 1px 5px 1px rgba(0,0,0,0.3)" : "none"), borderRadius: "0 7px 0 0",}}/>
            </Tabs>
            {(value === 0) ? <SignUpTab/> : <SignInTab/>}
        </div>
    )
}

function SignPage()
{
    return (
        <div style={{width: "100%", height: "100%"}}>
            <img src={signBackground} alt="signBackground" style={{zIndex: -10, position: "absolute", left: 0, top: 0, width: "100%", height: "100%"}} />
            <div style={{display: "block", marginLeft: "auto", marginRight: "auto", width: 480, textAlign: "center"}}>
                <img src={logo} alt="logo" style={{width: 463, top: 46}}/>
                <font style={{fontSize: 28, fontFamily: "Segoe UI", color: color4}}><p >Welcome to Code Docs</p></font>
                <SignTabs/>
            </div>
        </div>)
}


function mapStateToProps(state)
{
    return {

    }
}


export default connect(mapStateToProps,{})(SignPage)