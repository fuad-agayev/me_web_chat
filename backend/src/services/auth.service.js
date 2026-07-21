import bcrypt from 'bcrypt';

import { UserModel } from '../models/user.model.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { generateToken } from '../utils/crypto.js';
 import { env } from "../config/env.js"
 import { transporter } from '../config/mail.js';


export const registerUser = async ({username, email, password, latitude, longitude}) => {
  const hash = await bcrypt.hash(password, 10);
  const token = generateToken();

  const user = await UserModel.create(username, email, hash, token, latitude, longitude);
  return {user, token};
};


export const loginUser = async ({email, password}) => {

  const user = await UserModel.findByEmail(email);

  if(!user) throw new Error('User not found');

  if(!user.is_verified) throw new Error('Please verify your email before logging in');

  const valid = await bcrypt.compare(password, user.password);

  if(!valid) throw new Error('Invalid password');

  const accessToken = signAccessToken({id: user.id});
  const refreshToken = signRefreshToken({id: user.id});

  return {user, accessToken, refreshToken};
}



export const forgotPasswordService = async (email) => {
  const user = await UserModel.findByEmail(email);
  if (!user) throw new Error("User not found");

  const token = generateToken();
  await UserModel.saveResetToken(user.id, token);



await transporter.sendMail({
  from: env.SMTP_USER,
  to: user.email,
  subject: "Password Reset",
  text: `Reset link: ${env.CLIENT_URL}/reset-password?token=${token}`,
  html: `<a href="${env.CLIENT_URL}/reset-password?token=${token}">Reset your password</a>`
});


  return { message: "Reset link sent to email" };
};

export const resetPasswordService = async (token, newPassword) => {
  const user = await UserModel.findByResetToken(token);
  if (!user) throw new Error("Invalid token");

  const hashed = await bcrypt.hash(newPassword, 10);
  await UserModel.updatePassword(user.id, hashed);
  await UserModel.clearResetToken(user.id);

  return { message: "Password reset successfully" };
};



export const googleLoginService = async (profile) => {
   let user = await UserModel.findByGoogleId(profile.id);

   if(!user){
       user = await UserModel.createGoogleUser({
        username: profile.displayName,
        email: profile.emails[0].value,
        google_id: profile.id,
        avatar: profile.photos[0].value
       });
   }

   const googleAccessToken = signAccessToken({id: user.id});
   const googleRefreshToken = signRefreshToken({id: user.id});

   return {user, googleAccessToken , googleRefreshToken};
}