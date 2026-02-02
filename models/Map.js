const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
  mapName: { type: String, required: true },
  creatorUserId: { type: Number, required: true },
  creatorUsername: { type: String, required: true },
  description: { type: String, default: '' },
  dataStoreKey: { type: String, required: true },
  thumbnailId: { type: Number, default: 0 },
  
  stats: {
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    averageSurvivalTime: { type: Number, default: 0 }
  },
  
  metadata: {
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'expert'], default: 'medium' },
    estimatedPlayTime: { type: Number, default: 180 },
    tags: [String],
    partCount: { type: Number, default: 0 },
    modelCount: { type: Number, default: 0 },
    totalObjects: { type: Number, default: 0 },
    dataSizeBytes: { type: Number, default: 0 }
  },
  
  moderation: {
    ownerRating: { 
      type: String, 
      enum: [null, 'Rated', 'Epic', 'Legendary', 'Mythic'], 
      default: null 
    },
    featuredPosition: { type: Number, default: null },
    ratedDate: { type: Date, default: null },
    moderatorNotes: { type: String, default: '' },
    reportCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true }
  },
  
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastPlayedAt: { type: Date, default: null }
  },
  
  version: { type: Number, default: 1 }
});

// Indexes for better query performance
mapSchema.index({ 'moderation.isPublic': 1, 'timestamps.createdAt': -1 });
mapSchema.index({ 'moderation.isPublic': 1, 'stats.plays': -1 });
mapSchema.index({ 'moderation.isPublic': 1, 'moderation.ownerRating': 1 });
mapSchema.index({ 'moderation.featuredPosition': 1 });
mapSchema.index({ mapName: 'text', creatorUsername: 'text', description: 'text' });

module.exports = mongoose.model('Map', mapSchema);