import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  // Track-specific settings
  minJudges: {
    type: Number,
    default: 3,
    min: 1,
  },
  maxJudges: {
    type: Number,
    default: 4,
    min: 1,
  },
}, {
  timestamps: true,
});

const Track = mongoose.model('Track', trackSchema);

export default Track;

