import { pool } from '../config/db.js';
import { UserModel } from '../models/user.model.js';

export const getUsers = async () => {
  const r = await pool.query('SELECT id, username, email FROM users');
  return r.rows; 
}


export const updateLastSeen = async (userId) => {
   return await UserModel.updateLastSeen(userId)
}