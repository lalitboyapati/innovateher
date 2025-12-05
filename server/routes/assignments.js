import express from 'express';
import { requireAdmin, requireJudge, requireAnyAuth } from '../middleware/auth.js';
import { autoAssignUnassignedProjects } from '../utils/autoAssignJudges.js';

const router = express.Router();

// Auto-assign judges to unassigned projects (Admin or Judge can trigger)
router.post('/auto-assign', requireAnyAuth, async (req, res) => {
  try {
    // Only admins and judges can trigger auto-assignment
    if (req.user.role !== 'admin' && req.user.role !== 'judge') {
      return res.status(403).json({ message: 'Only admins and judges can trigger auto-assignment' });
    }
    
    const results = await autoAssignUnassignedProjects();
    res.json({
      message: 'Auto-assignment completed',
      ...results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assignment statistics (Admin only)
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const Project = (await import('../models/Project.js')).default;
    const User = (await import('../models/User.js')).default;
    
    const totalProjects = await Project.countDocuments();
    const unassignedProjects = await Project.countDocuments({
      $or: [
        { assignedJudges: { $size: 0 } },
        { assignedJudges: { $exists: false } }
      ]
    });
    const totalJudges = await User.countDocuments({ role: 'judge' });
    
    const projects = await Project.find().populate('assignedJudges', 'firstName lastName');
    const judgeLoads = {};
    
    projects.forEach(project => {
      if (project.assignedJudges) {
        project.assignedJudges.forEach(judge => {
          const judgeId = judge._id?.toString() || judge.toString();
          judgeLoads[judgeId] = (judgeLoads[judgeId] || 0) + 1;
        });
      }
    });
    
    res.json({
      totalProjects,
      unassignedProjects,
      totalJudges,
      assignedProjects: totalProjects - unassignedProjects,
      judgeLoads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

