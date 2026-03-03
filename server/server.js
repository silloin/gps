const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); // Adjust path to root .env

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/runterra';
mongoose
  .connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

// Init Middleware
// app.use(express.json({ extended: false })); // Already added express.json() above

// Attach socket.io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/runs', require('./routes/runs'));
app.use('/api/tiles', require('./routes/tiles'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/events', require('./routes/events'));
app.use('/api/training-plans', require('./routes/trainingPlans'));
app.use('/api/gpx', require('./routes/gpx'));

// Socket.io integration
require('./sockets')(io);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!', error: err.message });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server started on port ${port}`));
