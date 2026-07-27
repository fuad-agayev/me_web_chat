import express from 'express';
import { getChat } from '../controllers/message.controller.js';
import { uploadAudioCtrl } from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { uploadAudio } from "../middleware/uploads.middleware.js";

const router = express.Router();

router.get('/:userId', auth, getChat);
router.post("/audio", auth, uploadAudio.single("audio"), uploadAudioCtrl);
export default router;
