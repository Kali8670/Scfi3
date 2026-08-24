const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // ಫೋನ್-A ಯಿಂದ ಕಮಾಂಡ್ ಬಂದಾಗ ಫೋನ್-B ಗೆ ಕಳುಹಿಸುವುದು
  socket.on('send-command', (data) => {
    console.log('Command received:', data);
    io.emit('execute-command', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
