import express  from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { uploadAudio } from "../middleware/uploads.middleware.js";
import { getGlobalChatMessages, getGlobalLastMessages, fetchGlobalPaginatedMessages, getGlobalOnlineUsers } from '../controllers/global.controller.js';
import { uploadAudioCtrl } from '../controllers/user.controller.js';


const router = express.Router();
router.get("/", auth, getGlobalChatMessages);
router.get('/last-messages', auth, getGlobalLastMessages);
router.get('/paginated', auth, fetchGlobalPaginatedMessages);
router.get('/online-users', auth, getGlobalOnlineUsers);
router.post("/audio", auth, uploadAudio.single("audio"), uploadAudioCtrl);
export default router;