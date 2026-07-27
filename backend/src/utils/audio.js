import { env } from "../config/env.js";

export const formatAudioUrl = (audioPath) => {
  if (!audioPath) return null;
  // Cloudinary və ya Google linkləri
  if (audioPath.startsWith("http")) {
    return audioPath;
  }
  // Local uploads (yalnız developmentdə)
  if (env.NODE_ENV === "development") {
    const serverUrl = env.SERVER_URL || "http://localhost:5000";
    return `${serverUrl}${audioPath}`;
  }
  return audioPath;
};



