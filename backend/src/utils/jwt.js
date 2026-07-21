
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';


//  Accesss Token
export const signAccessToken = (payload) => {
       return jwt.sign(payload, env.ACCESS_SECRET, {expiresIn: '2m'});
};

//  Refresh Token
export const signRefreshToken = (payload) => {
       return jwt.sign(payload, env.REFRESH_SECRET, {expiresIn: '5m'});
};



// ? Access Verify  BU ISlemelr mifdllware de tanimlandi , cnunki bu LOgin isleminde sonra ki sislemlerdir
//?  Mesel kullanici change password ve avatar ve ya geolocation deyisdimek istedidke kualnilir UNUTMAAAAAAAAAAAAAAAA ondan ANcka MIDDLWARDEDIR 
//? Bu islemde yeni toekn oolusdurmaz loginolmus tokeni inceler dogrumu diye bunu iicndir  ADINDNA da gorsendiyi gibi --- jwt.verify   ---- ile yapilmis
//?  --- jwt.sign---   ile deyil
//? Bu islem ancak LOGIN OMUS kULLANICLAR ICINDIR
export const verifyAccessToken = (token) => {
       return jwt.verify(token, env.ACCESS_SECRET)
}

// Refresh verify
export const verifyRefreshToken = (token) => {
       return jwt.verify(token, env.REFRESH_SECRET)
}