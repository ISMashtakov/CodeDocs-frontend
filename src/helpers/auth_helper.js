import {get, post} from './request_helper';
import {SERVER_URL} from '../constants';

const MAIN_AUTH_URL = SERVER_URL + "/auth"

const LOG_IN_URL = MAIN_AUTH_URL + "/jwt/create/";
const USER_ACTIVATE_URL = MAIN_AUTH_URL + "/users/activation/";
const GET_USER_URL = MAIN_AUTH_URL + "/users/me/";
const REFRESH_TOKEN_URL = MAIN_AUTH_URL + "/jwt/refresh/";
const SIGN_UP_URL = MAIN_AUTH_URL + "/users/";
const CHECK_USERNAME_URL = MAIN_AUTH_URL + "/check_username/";
const CHECK_MAIL_URL = MAIN_AUTH_URL + "/check_email/";


class AuthApi{   
    async checkUsername(username){
        const params = {
            username: username.trim()
        }
        try{
            const result = await post(CHECK_USERNAME_URL, params)
            return result.status === 409
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
            const result = await post(CHECK_MAIL_URL, params)
            return result.status === 409
        }
        catch{
            return false
        }
        
    }

    async signUp(username, mail, password){

        const params = {
            username: username,
            email: mail,
            password: password
        }
        try{
            const result = await post(SIGN_UP_URL, params)
            return result.status === 201
        }
        catch{
            return false
        }
        
    }

    async logIn(username, password){

        const params = {
            username: username,
            password: password
        }
        try{
            const result = await post(LOG_IN_URL, params)
            if (!result.ok){
                return null;
            }
            return await result.json()
        }
        catch{
            return null
        }
        
    }

    async refreshTokens(refreshToken){
        const params = {
            refresh: refreshToken,
        }
        try{
            const result = await post(REFRESH_TOKEN_URL, params)
            return await result.json()
        }
        catch{
            return null
        }
    }

    async getUser(accessToken){
        try{
            const result = await get(GET_USER_URL, undefined, accessToken)
            return await result.json()
        }
        catch{
            return null
        }
    }

    async activateUser(uid, token){
        const params = {
            uid: uid,
            token: token
        }
        try{
            const result = await post(USER_ACTIVATE_URL, params)
            return result.status === 204
        }
        catch{
            return false
        }
    }
}

const authApi = new AuthApi()

export default authApi;