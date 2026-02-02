const Map = require('../models/Map');

// Feature a map at position
exports.featureMap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { position } = req.body;
    
    if (!position || position < 1) {
      return res.status(400).json({ error: 'Valid position required (1 or greater)' });
    }
    
    // Find maps to shift
    const mapsToShift = await Map.find({
      'moderation.featuredPosition': { $gte: position, $ne: null }
    });
    
    // Shift them down
    for (const map of mapsToShift) {
      await Map.findByIdAndUpdate(map._id, {
        $set: { 'moderation.featuredPosition': map.moderation.featuredPosition + 1 }
      });
    }
    
    // Set new position
    const map = await Map.findByIdAndUpdate(
      id,
      { $set: { 'moderation.featuredPosition': position } },
      { new: true }
    );
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    res.json({
      success: true,
      map,
      shiftedCount: mapsToShift.length,
      message: `Map featured at position ${position}`
    });
  } catch (error) {
    next(error);
  }
};

// Unfeature a map
exports.unfeatureMap = async (req, res, next) => {
  try {
    const map = await Map.findById(req.params.id);
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    const oldPosition = map.moderation.featuredPosition;
    
    // Remove featured position
    await Map.findByIdAndUpdate(req.params.id, {
      $set: { 'moderation.featuredPosition': null }
    });
    
    // Close gap
    if (oldPosition) {
      await Map.updateMany(
        { 'moderation.featuredPosition': { $gt: oldPosition, $ne: null } },
        { $inc: { 'moderation.featuredPosition': -1 } }
      );
    }
    
    res.json({ 
      success: true, 
      message: 'Map unfeatured',
      oldPosition 
    });
  } catch (error) {
    next(error);
  }
};

// Get featured maps list
exports.getFeaturedList = async (req, res, next) => {
  try {
    const maps = await Map.find({
      'moderation.featuredPosition': { $ne: null },
      'moderation.isPublic': true
    })
    .sort({ 'moderation.featuredPosition': 1 })
    .limit(100);
    
    res.json(maps);
  } catch (error) {
    next(error);
  }
};