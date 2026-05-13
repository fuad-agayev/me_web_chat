import express from 'express';
import { getChat } from '../controllers/message.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:userId', auth, getChat);
export default router;
