const socketIo = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (message) => {
    var discussionId = message['discussionId'];
    io.emit('chat message', { ...message, discussionId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server listening on port 3001');
});

module.exports = io;