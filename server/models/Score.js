import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Judges are Users with role='judge'
    required: true,
  },
  // Rubric scores with weights (matching the new rubric structure)
  rubricScores: {
    techStack: {
      score: { type: Number, min: 0, max: 10, default: 0 },
      weight: { type: Number, default: 0.2 },
    },
    design: {
      score: { type: Number, min: 0, max: 10, default: 0 },
      weight: { type: Number, default: 0.2 },
    },
    growthPotential: {
      score: { type: Number, min: 0, max: 10, default: 0 },
      weight: { type: Number, default: 0.2 },
    },
    presentation: {
      score: { type: Number, min: 0, max: 10, default: 0 },
      weight: { type: Number, default: 0.2 },
    },
    inspiration: {
      score: { type: Number, min: 0, max: 10, default: 0 },
      weight: { type: Number, default: 0.2 },
    },
  },
  // Overall weighted score (calculated)
  totalScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  // Feedback/comments
  feedback: {
    type: String,
    trim: true,
    default: '',
  },
  // Sentiment analysis score (from ML model)
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1,
    default: null,
  },
}, {
  timestamps: true,
});

// Index to prevent duplicate scoring
scoreSchema.index({ projectId: 1, judgeId: 1 }, { unique: true });

// Calculate weighted score before saving
scoreSchema.pre('save', function(next) {
  const { techStack, design, growthPotential, presentation, inspiration } = this.rubricScores;
  
  const scores = [
    { score: techStack.score, weight: techStack.weight },
    { score: design.score, weight: design.weight },
    { score: growthPotential.score, weight: growthPotential.weight },
    { score: presentation.score, weight: presentation.weight },
    { score: inspiration.score, weight: inspiration.weight },
  ];
  
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  const weightedSum = scores.reduce((sum, s) => sum + (s.score * s.weight), 0);
  
  this.totalScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  this.totalScore = Math.round(this.totalScore * 100) / 100; // Round to 2 decimals
  next();
});

const Score = mongoose.model('Score', scoreSchema);

export default Score;

