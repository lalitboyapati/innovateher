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
  assignedJudges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Judge',
  }],
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;

