import { env } from "../config/env.js";
import { getUsers, updateAvatar } from "../services/user.service.js";

export const users = async (req, res) => {
  const data = await getUsers();
  res.json(data);
};

export const uploadAvatar = async (req, res) => {
  let avatarPath = `/uploads/avatars/${req.file.filename}`;
  if (env.NODE_ENV === "production") {
    avatarPath = req.file.path; // Cloudinary URL
  }
  await updateAvatar(req.user.id, avatarPath);
  res.json({ avatar: avatarPath });
};

