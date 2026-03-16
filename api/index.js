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

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Path-stripping middleware
app.use(async (req, res, next) => {
  // Ensure DB connection for every request
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      });
      console.log('MongoDB late-connected');
    } catch (err) {
      console.error('DB connect failed in middleware:', err.message);
      // DON'T block health check
      if (req.url.includes('/health')) return next();
      return res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
  }

  // Remove /api prefix if present
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

// Health check with detailed error reporting
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  source: 'v-stay-api-v11-FIXED-SYNC',
  db_state: mongoose.connection.readyState,
  env_check: {
    uri: !!process.env.MONGODB_URI,
    jwt: !!process.env.JWT_SECRET
  }
}));

// 404 Handler - MUST return JSON
app.use((req, res) => {
  res.status(404).json({ 
    error: 'API Route Not Found', 
    path: req.url 
  });
});

// Error handling - MUST return JSON
app.use((err, req, res, next) => {
  console.error('Fatal API Error:', err);
  res.status(500).json({ 
    error: 'Critical Server Error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
