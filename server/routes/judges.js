import express from 'express';
import Judge from '../models/Judge.js';
import Project from '../models/Project.js';

const router = express.Router();

// Get all judges
router.get('/', async (req, res) => {
  try {
    const judges = await Judge.find().sort({ createdAt: -1 });
    res.json(judges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unassigned judges
router.get('/unassigned', async (req, res) => {
  try {
    // Updated to check currentProjectsCount instead of assignedToProjectId
    const judges = await Judge.find({ 
      $or: [
        { currentProjectsCount: { $lt: 4 } },
        { currentProjectsCount: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });
    res.json(judges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single judge
router.get('/:id', async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id).populate('assignedToProjectId');
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }
    res.json(judge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new judge
router.post('/', async (req, res) => {
  try {
    const { name, initials, specialty } = req.body;
    const judge = new Judge({
      name,
      initials,
      specialty,
    });
    const savedJudge = await judge.save();
    res.status(201).json(savedJudge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a judge
router.put('/:id', async (req, res) => {
  try {
    const { name, initials, specialty } = req.body;
    const judge = await Judge.findByIdAndUpdate(
      req.params.id,
      { name, initials, specialty },
      { new: true, runValidators: true }
    );

    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }

    res.json(judge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a judge
router.delete('/:id', async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id);
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }

    // Remove judge from project if assigned
    if (judge.assignedToProjectId) {
      await Project.findByIdAndUpdate(judge.assignedToProjectId, {
        $pull: { assignedJudges: judge._id },
      });
    }

    await Judge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Judge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

