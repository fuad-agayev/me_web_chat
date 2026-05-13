import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { users } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', auth, users);
 
export default router;