import express from 'express';
import RubricConfig from '../models/RubricConfig.js';
import { requireAdmin, requireAnyAuth } from '../middleware/auth.js';

const router = express.Router();

// Get rubric configuration
router.get('/', async (req, res) => {
  try {
    const config = await RubricConfig.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rubric for a specific track
router.get('/track/:trackId', async (req, res) => {
  try {
    const config = await RubricConfig.getConfig();
    const rubric = config.getRubricForTrack(req.params.trackId);
    res.json({
      rubric,
      trackId: req.params.trackId,
      maxJudgesPerProject: config.maxJudgesPerProject,
      minJudgesPerProject: config.minJudgesPerProject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update global rubric configuration (Admin only)
router.put('/global', requireAdmin, async (req, res) => {
  try {
    const { globalRubric, maxJudgesPerProject, minJudgesPerProject } = req.body;
    
    const config = await RubricConfig.getConfig();
    
    if (globalRubric) {
      config.globalRubric = { ...config.globalRubric, ...globalRubric };
    }
    
    if (maxJudgesPerProject !== undefined) {
      config.maxJudgesPerProject = maxJudgesPerProject;
    }
    
    if (minJudgesPerProject !== undefined) {
      config.minJudgesPerProject = minJudgesPerProject;
    }
    
    await config.save();
    
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update rubric for a specific track (Admin only)
router.put('/track/:trackId', requireAdmin, async (req, res) => {
  try {
    const { rubric } = req.body;
    const config = await RubricConfig.getConfig();
    
    // Find existing override or create new one
    const existingIndex = config.trackOverrides.findIndex(
      o => o.trackId?.toString() === req.params.trackId
    );
    
    if (existingIndex >= 0) {
      // Update existing override
      config.trackOverrides[existingIndex].rubric = {
        ...config.trackOverrides[existingIndex].rubric,
        ...rubric,
      };
    } else {
      // Create new override
      config.trackOverrides.push({
        trackId: req.params.trackId,
        rubric: rubric || {},
      });
    }
    
    await config.save();
    
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove track-specific override (revert to global) (Admin only)
router.delete('/track/:trackId', requireAdmin, async (req, res) => {
  try {
    const config = await RubricConfig.getConfig();
    
    config.trackOverrides = config.trackOverrides.filter(
      o => o.trackId?.toString() !== req.params.trackId
    );
    
    await config.save();
    
    res.json({ message: 'Track override removed, using global rubric now', config });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Validate rubric weights (ensure they sum to 1.0)
router.post('/validate', requireAdmin, async (req, res) => {
  try {
    const { rubric } = req.body;
    
    const weights = Object.values(rubric).map(r => r.weight || 0);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    const isValid = Math.abs(totalWeight - 1.0) < 0.01; // Allow small floating point errors
    
    res.json({
      isValid,
      totalWeight: Math.round(totalWeight * 100) / 100,
      message: isValid 
        ? 'Rubric weights are valid' 
        : `Weights sum to ${totalWeight.toFixed(2)}, should sum to 1.0`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

