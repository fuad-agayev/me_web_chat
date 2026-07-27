import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { users, uploadAvatarCtrl, updateLocation, changePassword, uploadAudioCtrl } from '../controllers/user.controller.js';
import { upload } from "../middleware/uploads.middleware.js";

const router = express.Router();

router.get('/', auth, users);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatarCtrl);
router.patch("/location", auth, updateLocation);
router.patch("/changepassword", auth, changePassword);
export default router;