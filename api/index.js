const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../server/routes/auth');
const homeRoutes = require('../server/routes/homes');
const favoriteRoutes = require('../server/routes/favorites');
const bookingRoutes = require('../server/routes/bookings');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// DB connection middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ error: 'MONGODB_URI is not set' });
    }
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      });
    } catch (err) {
      if (req.path.includes('/health')) return next();
      return res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
  }
  next();
});

// Routes mounted at /api/* paths
app.use('/api/auth', authRoutes);
app.use('/api/homes', homeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  db_state: mongoose.connection.readyState,
  env: { uri: !!process.env.MONGODB_URI, jwt: !!process.env.JWT_SECRET }
}));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.url });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

module.exports = app;