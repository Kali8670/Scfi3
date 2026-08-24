const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// index.html ಎಲ್ಲೇ ಇದ್ದರೂ ಕೆಲಸ ಮಾಡಲು path ಸೇರಿಸಲಾಗಿದೆ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    socket.join(data.room);
    console.log(`User joined room: ${data.room}`);
  });

  socket.on('send-command', (data) => {
    console.log('Sending command to room:', data.room, data.action);
    io.to(data.room).emit('execute-command', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
