const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve index.html file directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io Signaling & Remote Commands
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Room Join Event
  socket.on('join-room', (data) => {
    socket.join(data.room);
    console.log(`Socket ${socket.id} joined room: ${data.room} as ${data.role}`);
  });

  // Ready Signal Trigger (To start stream correctly)
  socket.on('ready-signal', (data) => {
    socket.to(data.room).emit('ready-signal', data);
  });

  // WebRTC Video Stream Signals
  socket.on('signal', (data) => {
    socket.to(data.room).emit('signal', data);
  });

  // Action Commands (Home, Swipe, etc.)
  socket.on('send-command', (data) => {
    console.log(`Command '${data.action}' sent to room: ${data.room}`);
    io.to(data.room).emit('execute-command', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});
