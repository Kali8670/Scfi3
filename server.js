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

// index.html ಫೈಲ್ ಸೇವನೆಗಾಗಿ (Serving index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io Real-time Signals and Commands
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Room ಗೆ Join ಆಗುವುದು
  socket.on('join-room', (data) => {
    socket.join(data.room);
    console.log(`User ${socket.id} joined room: ${data.room} as ${data.role}`);
  });

  // WebRTC Screen Sharing Signals ರವಾನಿಸುವುದು (Video Stream)
  socket.on('signal', (data) => {
    socket.to(data.room).emit('signal', data);
  });

  // Controls ಮತ್ತು Commands ರವಾನಿಸುವುದು
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
  console.log(`Server is running successfully on port ${PORT}`);
});
