import mongoose from 'mongoose';

// Note: Judges are now Users with role='judge'
// This model is kept for backward compatibility but will be deprecated
// Use User model with role='judge' instead

const judgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  // User account linked to this judge
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // Track assignment for specialty matching
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    default: null,
  },
  // Maximum number of projects this judge can handle
  maxProjects: {
    type: Number,
    default: 5,
    min: 1,
  },
  // Current number of assigned projects
  currentProjectsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

const Judge = mongoose.model('Judge', judgeSchema);

export default Judge;

