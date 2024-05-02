import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express(
  {
    cors: {
      origin: '*',
    }
  }
);
const server = createServer(app);
const io = new Server(server, 
  {
    cors: {
      origin: '*',
    }
  });

app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});

app.post('/api/recieve', (req, res) => {
  res.end();
});

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });

  socket.on('message', (message) => {
    console.log('New message', message);
    io.emit('message', message);
  });
})

server.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});