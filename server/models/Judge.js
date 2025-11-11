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
  assignedToProjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null,
  },
}, {
  timestamps: true,
});

const Judge = mongoose.model('Judge', judgeSchema);

export default Judge;

