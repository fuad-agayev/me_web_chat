import { env } from '../config/env.js'
import multer from 'multer';
import path from 'path';

import { CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

//* _______________  AVATAR FILE  ______________//

let storage;

if(env.NODE_ENV === "production") {
   // Production + Cloudinary
   storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "avatars",
        allowed_formats: ["png", "jpg", "jpeg", "webp"],
        public_id: (req, file) => 
               Date.now() + "-" + Math.round(Math.random() * 1e9)
      },
   });
} else {
  // Development + local uploads
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, "uploads/avatars");  // backend/uploads/avatars
    },
    filename: (req, file, cb) => {
       const ext = path.extname(file.originalname);
       cb(null, Date.now() + "-" + Math.random() + ext)
    }
  })
}
export const upload = multer({ storage });


//* _______________  AUDIO FILE  ______________//

let storageAudio;

if(env.NODE_ENV === "production") {
  storageAudio = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "audios",
      resource_type: "video",
      allowed_formats: ["mp3", "wav", "ogg", "webm","m4a", "aac"],
      public_id: () => Date.now() + "-" + Math.round(Math.random() * 1e9)
    },
  });
} else {
  storageAudio = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/audios"),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + "-" + Math.random() + ext);
    }
  });
}
export const uploadAudio = multer({ storage: storageAudio });







