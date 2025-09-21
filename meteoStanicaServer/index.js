const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { setupArduino } = require('./services/arduino');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// Import ruta
app.use('/api/merenja', require('./routes/merenja'));
app.use('/api/senzori', require('./routes/senzori'));
app.use('/api/podesavanja', require('./routes/podesavanja'));

const io = new Server(server, {
  cors: { origin: 'http://localhost:4200' }
});

// Arduino komunikacija
setupArduino(io);

io.on('connection', (socket) => {
  console.log('Klijent povezan:', socket.id);
});

server.listen(3000, () => {
  console.log('Server radi na http://localhost:3000');
});