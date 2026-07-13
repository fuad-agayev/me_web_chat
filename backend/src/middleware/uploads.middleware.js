import { env } from '../config/env.js'
import multer from 'multer';
import path from 'path';

import { CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

let storage;

if(env.NODE_ENV === "production") {
   // Production + Cloudinary
   storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "avatars",
        allowed_formats: ["png", "jpg", "jpeg"],
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






