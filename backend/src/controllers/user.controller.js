import { env } from "../config/env.js";
import { getUsers, updateAvatar, updateLocationService } from "../services/user.service.js";
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


// export const updateLocation = async (req, res) => {
//      try {
//          const { latitude, longitude } = req.body;
//          const result = await updateLocationService(req.user.id, latitude, longitude);
//          res.json(result);
//   } catch (err) {
//          res.status(500).json({ message: err.message });
//   }
// };

// export const updateLocation = async (req, res) => {
//     try {

//         console.log("BODY:", req.body);
//         console.log("USER:", req.user);

//         const { latitude, longitude } = req.body;

//         const result = await updateLocationService(
//             req.user.id,
//             latitude,
//             longitude
//         );

//         console.log(result);

//         res.json(result);

//     } catch (err) {

//         console.error(err);

//         res.status(500).json({
//             message: err.message
//         });
//     }
// };


export const updateLocation = async (req, res) => {
  console.log("===== UPDATE LOCATION =====");

  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
  
    const { latitude, longitude } = req.body;

    const result = await updateLocationService(
      req.user.id,
      latitude,
      longitude
    );

    console.log("DB RESULT:", result);

    return res.status(200).json(result);

  } catch (err) {
    console.error("UPDATE LOCATION ERROR:");
    console.error(err);

    return res.status(500).json({
      message: err.message
    });
  }
};
