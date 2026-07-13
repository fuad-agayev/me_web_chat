import { env } from "../config/env.js";
import { getUsers, updateAvatar } from "../services/user.service.js";
import cloudinary from '../config/cloudinary.js';


export const users = async (req, res) => {
  const data = await getUsers();
  // Avatar URL tam qaytarmaq üçün düzəliş:
  const serverUrl = env.SERVER_URL || "http://localhost:5000";
  const formatted = data.map(u => ({
    ...u,
    avatar: u.avatar ? `${serverUrl}${u.avatar}` : null
  }));
  res.json(formatted);
};


export const uploadAvatar = async (req, res) => {
  try {
    let avatarPath;

    if (env.NODE_ENV === "production") {
      // Production → Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars"
      });
      avatarPath = result.secure_url;
    } else {
      // Development → Localhost
      avatarPath = `/uploads/avatars/${req.file.filename}`;
    }

    await updateAvatar(req.user.id, avatarPath);
    res.json({ avatar: avatarPath });
  } catch (err) {
    res.status(500).json({ message: "Error uploading avatar" });
  }
};




