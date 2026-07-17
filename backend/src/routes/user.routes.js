import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { users, uploadAvatar, updateLocation } from '../controllers/user.controller.js';
import { upload } from "../middleware/uploads.middleware.js";

const router = express.Router();

router.get('/', auth, users);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);
router.patch("/location", auth, updateLocation);
export default router;