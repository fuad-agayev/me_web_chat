import { env } from "../config/env.js";

export const formatAudioUrl = (audioPath) => {
  if (!audioPath) return null;
  // Cloudinary və ya Google linkləri
  if (audioPath.startsWith("http")) {
    return audioPath;
  }

   const serverUrl = env.SERVER_URL || "https://me-web-chat.onrender.com";

  // // 2. Production mühitində, amma local uploads istifadə olunursa
  // if (env.NODE_ENV === "production" && audioPath.startsWith("/uploads/audios")) {
  //   return `${serverUrl}${audioPath}`;
  // }

  if (env.NODE_ENV === "development") {
    //const serverUrl = env.SERVER_URL || "http://localhost:5000";
    return `${serverUrl}${audioPath}`;
  }
  return audioPath;
};





