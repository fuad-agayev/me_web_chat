import { pool } from '../config/db.js';
import { UserModel } from '../models/user.model.js';

export const getUsers = async () => {
  const r = await pool.query('SELECT id, username, email, avatar, latitude, longitude FROM users');
  return r.rows; 
};


export const updateLastSeen = async (userId) => {
   return await UserModel.updateLastSeen(userId)
}

export const updateAvatar = (userId, avatar) => {
   return UserModel.updateAvatarModel(userId, avatar);
};

export const updateLocationService = async (userId, latitude, longitude) => {
  return await UserModel.updateLocationModel(userId, latitude, longitude);
};