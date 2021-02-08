import {get, post} from './request_helper';
import {SERVER_URL} from '../constants';

const SIGN_UP_URL = SERVER_URL + "/sign_up";
const CHECK_USERNAME = SERVER_URL + "/check_username"
const CHECK_MAIL = SERVER_URL + "/check_mail"


class AuthApi{   

    async checkUsername(username){
        const params = {
            username: username.trim()
        }
        try{
            if(username.trim() == "exist")
                return true
            return false
            const result = await get(CHECK_USERNAME, params)
            return await result.json()
        }
        catch{
            return false
        }
        
    }

    async checkMail(mail){
        const params = {
            mail: mail.trim()
        }
        try{
            if(mail.trim() == "exist")
                return true
            return false
            const result = await get(CHECK_MAIL, params)
            return await result.json()
        }
        catch{
            return false
        }
        
    }

    async signUp(username, mail, password){

        const params = {
            username: username,
            mail: mail,
            password: password
        }
        try{
            const result = await get(SIGN_UP_URL, params)
            return await result.json()
        }
        catch{
            return null
        }
        
    }
}

const authApi = new AuthApi()

export default authApi;