const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'API is running!',
    version: '1.0.0',
    endpoints: {
      maps: '/api/maps',
      rating: '/api/rating',
      featuring: '/api/featuring',
      stats: '/api/stats'
    }
  });
});

// Routes
app.use('/api/maps', require('./routes/maps'));
app.use('/api/rating', require('./routes/rating'));
app.use('/api/featuring', require('./routes/featuring'));
app.use('/api/stats', require('./routes/stats'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
