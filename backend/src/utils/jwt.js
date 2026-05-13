
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';


//  Accesss Token
export const signAccessToken = (payload) => {
       return jwt.sign(payload, env.ACCESS_SECRET, {expiresIn: '20m'});
};

//  Refresh Token
export const signRefreshToken = (payload) => {
       return jwt.sign(payload, env.REFRESH_SECRET, {expiresIn: '7d'});
};



//  Access Verify
export const verifyAccessToken = (token) => {
       return jwt.verify(token, env.ACCESS_SECRET)
}

// Refresh verify
export const verifyRefreshToken = (token) => {
       return jwt.verify(token, env.REFRESH_SECRET)
}