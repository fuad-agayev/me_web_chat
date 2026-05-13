import express from 'express';

import * as ctrl from '../controllers/group.controller.js';

import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', auth, ctrl.createGroup);

router.get('/', auth, ctrl.getMyGroups);

router.get('/:groupId/messages', auth, ctrl.getMessages);

export default router;
