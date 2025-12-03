import mongoose from 'mongoose';

const rubricConfigSchema = new mongoose.Schema({
  // Global rubric configuration (default for all tracks)
  globalRubric: {
    techStack: {
      name: { type: String, default: 'Tech Stack' },
      weight: { type: Number, default: 0.2, min: 0, max: 1 },
      enabled: { type: Boolean, default: true },
    },
    design: {
      name: { type: String, default: 'Design' },
      weight: { type: Number, default: 0.2, min: 0, max: 1 },
      enabled: { type: Boolean, default: true },
    },
    growthPotential: {
      name: { type: String, default: 'Growth Potential' },
      weight: { type: Number, default: 0.2, min: 0, max: 1 },
      enabled: { type: Boolean, default: true },
    },
    presentation: {
      name: { type: String, default: 'Presentation' },
      weight: { type: Number, default: 0.2, min: 0, max: 1 },
      enabled: { type: Boolean, default: true },
    },
    inspiration: {
      name: { type: String, default: 'Inspiration' },
      weight: { type: Number, default: 0.2, min: 0, max: 1 },
      enabled: { type: Boolean, default: true },
    },
  },
  // Track-specific rubric overrides
  trackOverrides: [{
    trackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
    },
    rubric: {
      techStack: {
        name: String,
        weight: { type: Number, min: 0, max: 1 },
        enabled: Boolean,
      },
      design: {
        name: String,
        weight: { type: Number, min: 0, max: 1 },
        enabled: Boolean,
      },
      growthPotential: {
        name: String,
        weight: { type: Number, min: 0, max: 1 },
        enabled: Boolean,
      },
      presentation: {
        name: String,
        weight: { type: Number, min: 0, max: 1 },
        enabled: Boolean,
      },
      inspiration: {
        name: String,
        weight: { type: Number, min: 0, max: 1 },
        enabled: Boolean,
      },
    },
  }],
  // Max judges per project
  maxJudgesPerProject: {
    type: Number,
    default: 4,
    min: 2,
    max: 10,
  },
  minJudgesPerProject: {
    type: Number,
    default: 3,
    min: 2,
    max: 10,
  },
}, {
  timestamps: true,
});

// Ensure only one rubric config exists
rubricConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = new this({});
    await config.save();
  }
  return config;
};

// Get rubric for a specific track
rubricConfigSchema.methods.getRubricForTrack = function(trackId) {
  if (!trackId) {
    return this.globalRubric;
  }

  const override = this.trackOverrides.find(
    o => o.trackId?.toString() === trackId.toString()
  );

  if (override) {
    // Merge with global, override only specified fields
    const rubric = { ...this.globalRubric };
    Object.keys(override.rubric).forEach(key => {
      if (override.rubric[key]) {
        rubric[key] = { ...rubric[key], ...override.rubric[key] };
      }
    });
    return rubric;
  }

  return this.globalRubric;
};

const RubricConfig = mongoose.model('RubricConfig', rubricConfigSchema);

export default RubricConfig;

