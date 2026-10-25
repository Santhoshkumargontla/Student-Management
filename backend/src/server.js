const studentRoutes = require('./routes/studentRoutes');
const dns = require('node:dns');

// Fix SRV DNS resolution on this computer
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.get('/', (req, res) => {
  res.send('Student Management Backend is running!');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management API is running!',
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
