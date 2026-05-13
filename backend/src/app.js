
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';

const app = express();

app.use(cors({origin: env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import globalRoutes from './routes/global.routes.js';
import groupRoutes from './routes/group.routes.js';
import demoRoutes from './routes/demo.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/global', globalRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/demo', demoRoutes);



export default app;
