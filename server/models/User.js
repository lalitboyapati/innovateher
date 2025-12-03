import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'judge', 'participant'],
    required: true,
  },
  // For participants - track their projects
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
  // For judges - their judge profile
  judgeProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Judge',
    default: null,
  },
  // Track assignment (optional - for organizing hackathons by tracks)
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    default: null,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;

