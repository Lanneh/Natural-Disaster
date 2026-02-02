const Map = require('../models/Map');

// Get recent maps
exports.getRecentMaps = async (req, res, next) => {
  try {
    const maps = await Map.find({ 'moderation.isPublic': true })
      .sort({ 'timestamps.createdAt': -1 })
      .limit(50);
    res.json(maps);
  } catch (error) {
    next(error);
  }
};

// Get most played maps
exports.getMostPlayedMaps = async (req, res, next) => {
  try {
    const maps = await Map.find({ 'moderation.isPublic': true })
      .sort({ 'stats.plays': -1 })
      .limit(50);
    res.json(maps);
  } catch (error) {
    next(error);
  }
};

// Get highest rated maps
exports.getHighestRatedMaps = async (req, res, next) => {
  try {
    const maps = await Map.find({ 
      'moderation.isPublic': true,
      'stats.plays': { $gte: 50 }
    }).lean();
    
    const rated = maps
      .map(map => ({
        ...map,
        calculatedRating: map.stats.likes / (map.stats.likes + map.stats.dislikes) || 0
      }))
      .sort((a, b) => b.calculatedRating - a.calculatedRating)
      .slice(0, 50);
    
    res.json(rated);
  } catch (error) {
    next(error);
  }
};

// Search maps
exports.searchMaps = async (req, res, next) => {
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
    next(error);
  }
};

// Get single map by ID
exports.getMapById = async (req, res, next) => {
  try {
    const map = await Map.findById(req.params.id);
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    res.json(map);
  } catch (error) {
    next(error);
  }
};

// Create new map
exports.createMap = async (req, res, next) => {
  try {
    const newMap = new Map(req.body);
    await newMap.save();
    res.status(201).json(newMap);
  } catch (error) {
    next(error);
  }
};

// Update map
exports.updateMap = async (req, res, next) => {
  try {
    const map = await Map.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    res.json(map);
  } catch (error) {
    next(error);
  }
};

// Delete map
exports.deleteMap = async (req, res, next) => {
  try {
    const map = await Map.findByIdAndDelete(req.params.id);
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    res.json({ success: true, message: 'Map deleted' });
  } catch (error) {
    next(error);
  }
};