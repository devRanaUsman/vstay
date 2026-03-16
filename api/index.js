const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require(path.resolve(__dirname, '../server/routes/auth'));
const homeRoutes = require(path.resolve(__dirname, '../server/routes/homes'));
const favoriteRoutes = require(path.resolve(__dirname, '../server/routes/favorites'));
const bookingRoutes = require(path.resolve(__dirname, '../server/routes/bookings'));

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

// Routes (Handling both /api and direct hits)
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/homes', homeRoutes);
apiRouter.use('/favorites', favoriteRoutes);
// Health checks
app.get('/api/health', (req, res) => res.json({ status: 'ok', source: 'v-stay-api-fixed' }));
app.get('/health', (req, res) => res.json({ status: 'ok', source: 'v-stay-direct-fixed' }));

// Mount routes on /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/homes', homeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/bookings', bookingRoutes);

// Mount routes on root (for cases where Vercel strips /api)
app.use('/auth', authRoutes);
app.use('/homes', homeRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/bookings', bookingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'API Route Not Found', 
    path: req.url,
    method: req.method 
  });
});

// MongoDB Connection
if (process.env.MONGODB_URI) {
  console.log('Connecting to MongoDB...');
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Error handling for startup crashes
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = app;
