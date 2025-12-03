import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { assignJudgesToAllProjects, getAssignmentStats } from '../utils/autoAssign.js';

const router = express.Router();

// Auto-assign judges to all projects (Admin only)
router.post('/auto-assign', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const results = await assignJudgesToAllProjects();
    res.json({
      message: 'Auto-assignment completed',
      ...results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assignment statistics (Admin only)
router.get('/stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const stats = await getAssignmentStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

