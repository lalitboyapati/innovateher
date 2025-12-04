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
  githubUrl: {
    type: String,
    trim: true,
  },
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedJudges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Judges are now Users
  }],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'judged'],
    default: 'draft',
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;

