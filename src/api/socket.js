const socketIo = require('socket.io');
const http = require('http');

const initSocket = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (message) => {
      io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

module.exports = initSocket;