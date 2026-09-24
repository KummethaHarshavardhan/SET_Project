let ioInstance = null;

module.exports = {
  init: (server) => {
    const { Server } = require('socket.io');
    const jwt = require('jsonwebtoken');
    const Users = require('../models/users');

    ioInstance = new Server(server, {
      cors: { origin: '*' },
    });

    // Optional auth: accept token from client and join a room per user id
    ioInstance.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth && socket.handshake.auth.token ? socket.handshake.auth.token : socket.handshake.query?.token;
        if (!token) return next();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findById(decoded.id);
        if (user) {
          socket.user = user;
          socket.join(user._id.toString());
        }
      } catch (err) {
        // ignore auth errors - connection allowed but won't join a room
      }
      next();
    });

    ioInstance.on('connection', (socket) => {
      // connection established
    });

    return ioInstance;
  },
  getIo: () => {
    if (!ioInstance) throw new Error('Socket.io not initialized');
    return ioInstance;
  },
};
