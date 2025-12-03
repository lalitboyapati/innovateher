import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  // Participant who submitted the project
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Track assignment
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    default: null,
  },
  // Project submission details
  githubUrl: {
    type: String,
    trim: true,
    default: '',
  },
  demoUrl: {
    type: String,
    trim: true,
    default: '',
  },
  // Assigned judges
  assignedJudges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Judge',
  }],
  // Status
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'judged', 'winner'],
    default: 'submitted',
  },
  // Auto-calculated average score from all judges
  averageScore: {
    type: Number,
    min: 0,
    max: 10,
    default: null,
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;

