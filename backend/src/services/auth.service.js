import bcrypt from 'bcrypt';

import { UserModel } from '../models/user.model.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { generateToken } from '../utils/crypto.js';

export const registerUser = async ({username, email, password}) => {
  const hash = await bcrypt.hash(password, 10);
  const token = generateToken();

  const user = await UserModel.create(username, email, hash, token);
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

