
import http from 'http';
import app from './src/app.js';

import { initSocket } from './src/sockets/socket.js';
import { env } from './src/config/env.js';

const server = http.createServer(app);

initSocket(server);

server.listen(env.PORT, () => {
  console.log('Server is running on port:', env.PORT || 5000);
});