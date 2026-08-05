import { env } from "../config/env.js";
import { formatAvatarUrl } from "../utils/avatar.js";
import { formatAudioUrl } from "../utils/audio.js";
import { MessageModel } from "../models/message.model.js"
import { getUsers, updateAvatar, updateLocationService, changePasswordService } from "../services/user.service.js";
//import cloudinary from '../config/cloudinary.js';


export const users = async (req, res) => {
  const data = await getUsers();
  // Avatar URL tam qaytarmaq üçün düzəliş:

  // const serverUrl = env.SERVER_URL || "http://localhost:5000";
  // const formatted = data.map(u => ({
  //   ...u,
  //   avatar: u.avatar ? `${serverUrl}${u.avatar}` : null
  // }));
  // res.json(formatted);

  const formatted = data.map(u => ({
  ...u,
  avatar: formatAvatarUrl(u.avatar),
 // audio_url: formatAudioUrl(u.audio_url)
}));
   return res.json(formatted)
}


// export const uploadAudioCtrl = async (req, res) => {
//   try {
//     let audioPath;
//     if (env.NODE_ENV === "production") {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "chats/audios",
//         resource_type: "video"
//       });
//       audioPath = result.secure_url; // Cloudinary URL
//     } else {
//       audioPath = `/uploads/audios/${req.file.filename}`; // Local path
//     }

   
//     const formattedUrl = formatAudioUrl(audioPath);

//     const receiverId = req.body.receiverId;
//     if (receiverId) {
//       const msg = await MessageModel.create(
//         req.user.id,
//         receiverId,
//         "",
//         formattedUrl
//       );
//       return res.json({ ...msg, audio_url: formattedUrl });
//     }

//     res.json({ audio_url: formattedUrl });
//   } catch (err) {
//     res.status(500).json({ message: "Error uploading audio" });
//   }
// };

export const uploadAudioCtrl = async (req, res) => {
  try {

    //!if esle YERINE BUNALIR DA YAPAbilirdik
    //? const audioPath = env.NODE_ENV === "production"
    //?                  ? req.file.path
    //?                  : `/uploads/audios/${req.file.filename}`;


    let audioPath;
    if (env.NODE_ENV === "production") {
      audioPath = req.file.path;
       //?  multer-storage-cloudinary  Kullaniyorsak  secure_url lazım deyil, çünki Cloudinary URL-ni avtomatik qaytarır.
      console.log("Audio req file: ", req.file);
    } else {
      audioPath = `/uploads/audios/${req.file.filename}`; // Local path
    }

   
    const formattedUrl = formatAudioUrl(audioPath);

    // const receiverId = req.body.receiverId;
    // if (receiverId) {
    //   const msg = await MessageModel.create(
    //     req.user.id,
    //     receiverId,
    //     "",
    //     formattedUrl
    //   );
    //   return res.json({ ...msg, audio_url: formattedUrl });
    // }
    //  res.json({ audio_url: formattedUrl });
   return  res.json({ audio_url: formattedUrl });
  } catch (err) {
    res.status(500).json({ message: "Error uploading audio" });
  }
};



// export const uploadAvatarCtrl = async (req, res) => {
//   try {
//     let avatarPath;

//     if (env.NODE_ENV === "production") {
//       // Production → Cloudinary
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "chats/avatars"
//       });
//       avatarPath = result.secure_url;
//     } else {
//       // Development → Localhost
//       avatarPath = `/uploads/avatars/${req.file.filename}`;
//     }

//     await updateAvatar(req.user.id, avatarPath);
//     res.json({ avatar: avatarPath });
//   } catch (err) {
//     res.status(500).json({ message: "Error uploading avatar" });
//   }
// };


export const uploadAvatarCtrl = async (req, res) => {
  try {
    let avatarPath;

    if (env.NODE_ENV === "production") {
      avatarPath = req.file.path;
      //?  multer-storage-cloudinary  Kullaniyorsak  secure_url lazım deyil, çünki Cloudinary URL-ni avtomatik qaytarır.
      console.log("Avatar req file: ", req.file);
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


export const changePassword = async (req, res) => {
   try {
        const { oldPassword, newPassword } = req.body;
              await changePasswordService(req.user.id, oldPassword, newPassword);
              res.json({message: "Password update succcesfully" });
   } catch(err) {
        res.status(400).json({ message: err.message });
   }
}