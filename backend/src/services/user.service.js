import { pool } from '../config/db.js';
import { UserModel } from '../models/user.model.js';
import bcrypt from "bcrypt";

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

export const changePasswordService = async (userId, oldPassword, newPassword) => {
 // Kullanıcı bilgilerini al
   const fullUser = await UserModel.findById(userId);

   // Google hesabı mı?
   if (fullUser.google_id) {
      throw new Error("Google accounts cannot change password.");
   }

   const user = await UserModel.findPasswordById(userId);

   const ok = await bcrypt.compare(oldPassword, user.password);
   if(!ok) throw new Error("Wrong password");

   const hashed = await bcrypt.hash(newPassword, 10);
                  await UserModel.updatePassword(userId, hashed)
};




