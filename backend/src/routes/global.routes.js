import express  from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { getGlobalChatMessages } from '../controllers/global.controller.js';

const router = express.Router();
router.get("/", auth, getGlobalChatMessages);

export default router;