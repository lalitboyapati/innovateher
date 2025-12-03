import express from 'express';
import Track from '../models/Track.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find().sort({ name: 1 });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single track
router.get('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create track (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, description, category, minJudges, maxJudges } = req.body;
    const track = new Track({
      name,
      description,
      category,
      minJudges: minJudges || 2,
      maxJudges: maxJudges || 5,
    });
    const savedTrack = await track.save();
    res.status(201).json(savedTrack);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update track (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete track (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const track = await Track.findByIdAndDelete(req.params.id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

