import express from 'express';
import { register, login, verify, current_user, logout} from '../controllers/auth.controller.js';
import { refresh } from "../controllers/refresh.controller.js";
import { auth } from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verify);
router.post("/refresh", refresh);
router.get('/profile', auth, current_user);
router.post('/logout', logout);


export default router;
