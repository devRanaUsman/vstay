const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('../server/routes/auth');
const homeRoutes = require('../server/routes/homes');
const favoriteRoutes = require('../server/routes/favorites');
const bookingRoutes = require('../server/routes/bookings');

const app = express();

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing from process.env');
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  // Debug log (Safe: only first few chars)
  console.log('Attempting DB connection. URI starts with:', process.env.MONGODB_URI.substring(0, 15) + '...');

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      bufferCommands: false, // Disable buffering so it fails fast
    });
    console.log('MongoDB connection success');
  } catch (err) {
    console.error('MongoDB connection error details:', err.message);
    throw err;
  }
};

// Path-stripping middleware (Crucial for Vercel)
app.use(async (req, res, next) => {
  // Ensure DB connection
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed', details: err.message });
  }

  if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
  }
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/homes', homeRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/bookings', bookingRoutes);

// Direct health/debug checks
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  source: 'v-stay-api-v5',
  db_state: mongoose.connection.readyState,
  uri_loaded: !!process.env.MONGODB_URI,
  uri_prefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) : 'none'
}));

app.get('/debug', (req, res) => {
  res.json({
    cwd: process.cwd(),
    db_connected: mongoose.connection.readyState === 1,
    env_loaded: !!process.env.MONGODB_URI,
    url: req.url,
    files: require('fs').readdirSync(__dirname)
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'API Route Not Found', 
    path: req.url,
    method: req.method,
    full_url: req.originalUrl
  });
});

// Error handling for startup crashes
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = app;
