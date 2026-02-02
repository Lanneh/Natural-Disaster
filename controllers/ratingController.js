const Map = require('../models/Map');

// Set map rating
exports.setRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    const validRatings = ['Rated', 'Epic', 'Legendary', 'Mythic'];
    
    if (!rating || !validRatings.includes(rating)) {
      return res.status(400).json({ 
        error: 'Valid rating required', 
        validRatings 
      });
    }
    
    const map = await Map.findByIdAndUpdate(
      id,
      {
        $set: {
          'moderation.ownerRating': rating,
          'moderation.ratedDate': new Date()
        }
      },
      { new: true }
    );
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    res.json({
      success: true,
      map,
      message: `Map rated as ${rating}`
    });
  } catch (error) {
    next(error);
  }
};

// Remove rating
exports.removeRating = async (req, res, next) => {
  try {
    const map = await Map.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'moderation.ownerRating': null,
          'moderation.ratedDate': null
        }
      },
      { new: true }
    );
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    res.json({ success: true, message: 'Rating removed' });
  } catch (error) {
    next(error);
  }
};

// Get all rated maps
exports.getRatedMaps = async (req, res, next) => {
  try {
    const maps = await Map.find({
      'moderation.ownerRating': { $ne: null },
      'moderation.isPublic': true
    })
    .sort({ 'moderation.ratedDate': -1 })
    .limit(100);
    
    res.json(maps);
  } catch (error) {
    next(error);
  }
};

// Get maps by rating tier
exports.getMapsByRating = async (req, res, next) => {
  try {
    const { tier } = req.params;
    
    const validRatings = ['Rated', 'Epic', 'Legendary', 'Mythic'];
    
    if (!validRatings.includes(tier)) {
      return res.status(400).json({ 
        error: 'Invalid rating tier',
        validRatings 
      });
    }
    
    const maps = await Map.find({
      'moderation.ownerRating': tier,
      'moderation.isPublic': true
    })
    .sort({ 'moderation.ratedDate': -1 })
    .limit(50);
    
    res.json(maps);
  } catch (error) {
    next(error);
  }
};