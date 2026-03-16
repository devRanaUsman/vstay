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

// Routes (Handling both /api and direct hits)
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/homes', homeRoutes);
apiRouter.use('/favorites', favoriteRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.get('/health', (req, res) => res.json({ status: 'ok', source: 'v-stay-api' }));

app.use('/api', apiRouter);

// Fallback for direct function hits
app.use('/auth', authRoutes);
app.use('/homes', homeRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/bookings', bookingRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', source: 'v-stay-direct' }));
app.get('/homes', (req, res) => res.json({ status: 'fallback-ok', message: 'If you see this, routing needs refinement but code is working' }));

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
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB error:', err));
}

module.exports = app;
