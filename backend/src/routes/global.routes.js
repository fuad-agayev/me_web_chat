import express  from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { getGlobalChatMessages, getGlobalLastMessages, fetchGlobalPaginatedMessages, getGlobalOnlineUsers } from '../controllers/global.controller.js';

const router = express.Router();
router.get("/", auth, getGlobalChatMessages);
router.get('/last-messages', auth, getGlobalLastMessages);
router.get('/paginated', auth, fetchGlobalPaginatedMessages);
router.get('/online-users', auth, getGlobalOnlineUsers);
export default router;