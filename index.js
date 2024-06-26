import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/database.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const server = createServer(app);
const port = 3000;
const socketPort = 5174;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', postRoutes);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`USER CONNECTED ${socket.id}`);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('send_message', (data) => {
    console.log('message: ' + data);
    socket.broadcast.emit("received_message", data);
  });
});

server.listen(socketPort, () => {
  console.log(`Socket.io server listening on *:${socketPort}`);
});

app.listen(port, () => {
  console.log(`Express server is running at http://localhost:${port}`);
});
