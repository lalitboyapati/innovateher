import mongoose from 'mongoose';

const judgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  initials: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 5,
  },
  specialty: {
    type: String,
    required: true,
    trim: true,
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

