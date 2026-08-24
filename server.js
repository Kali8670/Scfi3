const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('join-room', ({ room, role }) => {
    socket.join(room);
    console.log(`User joined room ${room} as ${role}`);
  });

  socket.on('send-command', ({ room, action }) => {
    io.to(room).emit('execute-command', { action });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
