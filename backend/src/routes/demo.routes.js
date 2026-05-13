import express from 'express';
import { demoLogin } from '../controllers/demo.controller.js';

const router = express.Router();

router.post('/', demoLogin);

export default router;