import { env } from "../config/env.js";
export const formatAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  if (env.NODE_ENV === "development") {
    const serverUrl = env.SERVER_URL || "http://localhost:5000";
    return `${serverUrl}${avatarPath}`;
  }
  return avatarPath; // production → Cloudinary URL
};
