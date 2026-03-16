const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/homes');
const favoriteRoutes = require('./routes/favorites');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Improved Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url}`);
  next();
});

// Root API check
app.get('/api', (req, res) => {
  res.json({ message: 'V-Stay API Root' });
});

// Middleware (Relaxed for debugging deployment issues)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/homes', homeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/bookings', bookingRoutes);

// Flexible routes (without /api prefix) for Vercel rewrites
app.use('/auth', authRoutes);
app.use('/homes', homeRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'V-Stay API' }));
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'V-Stay API' }));

// 404 Handler for API
app.use((req, res) => {
  console.log(`404 at ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Route ${req.method} ${req.url} not found on this server`,
    paths_tried: ['/api/auth', '/auth', etc]
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Explicitly log the URI (hidden for security) to confirm it's being read
    if (!process.env.MONGODB_URI) {
      console.error('CRITICAL: MONGODB_URI is not defined in environment variables!');
    }
  });

// Export app for Vercel
module.exports = app;

// Listen only if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
