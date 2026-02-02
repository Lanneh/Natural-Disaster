const Map = require('../models/Map');

// Update map stats
exports.updateStats = async (req, res, next) => {
  try {
    const map = await Map.findByIdAndUpdate(
      req.params.id,
      { 
        $inc: req.body,
        $set: { 'timestamps.updatedAt': Date.now() }
      },
      { new: true }
    );
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    res.json(map);
  } catch (error) {
    next(error);
  }
};