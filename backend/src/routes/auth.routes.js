import express from 'express';
import { register, login, verify, current_user, logout, forgotPasswordController, resetPasswordController} from '../controllers/auth.controller.js';
import { refresh } from "../controllers/refresh.controller.js";
import { auth } from '../middleware/auth.middleware.js'

import passport from "passport"
//import passport from "../config/passport.js";
import { googleCallback } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verify);
router.post("/refresh", refresh);
router.get('/profile', auth, current_user);
router.post('/logout', logout);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), googleCallback);

export default router;
