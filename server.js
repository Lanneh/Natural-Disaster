const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Map Schema
const mapSchema = new mongoose.Schema({
  mapName: String,
  creatorUserId: Number,
  creatorUsername: String,
  description: String,
  dataStoreKey: String,
  thumbnailId: { type: Number, default: 0 },
  stats: {
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    averageSurvivalTime: { type: Number, default: 0 }
  },
  metadata: {
    difficulty: String,
    estimatedPlayTime: Number,
    tags: [String],
    partCount: { type: Number, default: 0 },
    modelCount: { type: Number, default: 0 }
  },
  moderation: {
    ownerRating: { type: String, default: null },
    featuredPosition: { type: Number, default: null },
    ratedDate: Date,
    moderatorNotes: String,
    reportCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true }
  },
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastPlayedAt: Date
  },
  version: { type: Number, default: 1 }
});

const Map = mongoose.model('Map', mapSchema);

// API Endpoints

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running!' });
});

// Get recent maps
app.get('/api/maps/recent', async (req, res) => {
  try {
    const maps = await Map.find({ 'moderation.isPublic': true })
      .sort({ 'timestamps.createdAt': -1 })
      .limit(50);
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured maps
app.get('/api/maps/featured', async (req, res) => {
  try {
    const maps = await Map.find({ 
      'moderation.ownerRating': { $ne: null },
      'moderation.isPublic': true 
    })
    .sort({ 'moderation.featuredPosition': 1 })
    .limit(50);
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get most played
app.get('/api/maps/most-played', async (req, res) => {
  try {
    const maps = await Map.find({ 'moderation.isPublic': true })
      .sort({ 'stats.plays': -1 })
      .limit(50);
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get highest rated
app.get('/api/maps/highest-rated', async (req, res) => {
  try {
    const maps = await Map.find({ 
      'moderation.isPublic': true,
      'stats.plays': { $gte: 50 }
    }).lean();
    
    // Calculate rating and sort
    const rated = maps.map(map => ({
      ...map,
      calculatedRating: map.stats.likes / (map.stats.likes + map.stats.dislikes) || 0
    }))
    .sort((a, b) => b.calculatedRating - a.calculatedRating)
    .slice(0, 50);
    
    res.json(rated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search maps
app.get('/api/maps/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const maps = await Map.find({
      'moderation.isPublic': true,
      $or: [
        { mapName: { $regex: query, $options: 'i' } },
        { creatorUsername: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(50);
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new map
app.post('/api/maps', async (req, res) => {
  try {
    const newMap = new Map(req.body);
    await newMap.save();
    res.status(201).json(newMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update map stats (likes, plays, etc.)
app.patch('/api/maps/:id/stats', async (req, res) => {
  try {
    const map = await Map.findByIdAndUpdate(
      req.params.id,
      { 
        $inc: req.body,
        'timestamps.updatedAt': Date.now()
      },
      { new: true }
    );
    res.json(map);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single map by ID
app.get('/api/maps/:id', async (req, res) => {
  try {
    const map = await Map.findById(req.params.id);
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    res.json(map);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
