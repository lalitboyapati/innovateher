import express from 'express';
import Project from '../models/Project.js';
import Judge from '../models/Judge.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all projects with assigned judges
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // If authenticated, apply role-based filtering
    if (req.headers.authorization) {
      try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
          const jwt = await import('jsonwebtoken');
          const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
          const User = (await import('../models/User.js')).default;
          const decoded = jwt.default.verify(token, JWT_SECRET);
          const user = await User.findById(decoded.userId);
          
          if (user && user.role === 'participant') {
            query.participantId = user._id;
          }
        }
      } catch (authError) {
        // If auth fails, just show all projects (public view)
      }
    }
    
    const projects = await Project.find(query)
      .populate('assignedJudges')
      .populate('participantId', 'name email')
      .populate('trackId')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('assignedJudges');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, description, githubUrl, demoUrl, trackId } = req.body;
    
    // Participants can only create projects for themselves
    const participantId = req.user.role === 'participant' 
      ? req.user._id 
      : req.body.participantId || req.user._id;
    
    const project = new Project({
      name,
      category,
      description,
      participantId,
      trackId: trackId || null,
      githubUrl: githubUrl || '',
      demoUrl: demoUrl || '',
      assignedJudges: [],
      status: 'submitted',
    });
    
    const savedProject = await project.save();
    const populatedProject = await Project.findById(savedProject._id)
      .populate('assignedJudges')
      .populate('participantId', 'name email')
      .populate('trackId');
    
    // Update user's projects array
    if (req.user.role === 'participant') {
      req.user.projects.push(savedProject._id);
      await req.user.save();
    }
    
    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const { name, category, description, assignedJudges } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, category, description, assignedJudges },
      { new: true, runValidators: true }
    ).populate('assignedJudges');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update judge assignments
    if (assignedJudges) {
      await Judge.updateMany(
        { _id: { $in: assignedJudges } },
        { assignedToProjectId: req.params.id }
      );
      await Judge.updateMany(
        { _id: { $nin: assignedJudges }, assignedToProjectId: req.params.id },
        { assignedToProjectId: null }
      );
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Assign a judge to a project
router.post('/:id/judges/:judgeId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const judge = await Judge.findById(req.params.judgeId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }

    // Remove judge from previous project if assigned
    if (judge.assignedToProjectId) {
      await Project.findByIdAndUpdate(judge.assignedToProjectId, {
        $pull: { assignedJudges: judge._id },
      });
    }

    // Add judge to new project
    if (!project.assignedJudges.includes(judge._id)) {
      project.assignedJudges.push(judge._id);
      await project.save();
    }

    // Update judge's assigned project
    judge.assignedToProjectId = project._id;
    await judge.save();

    const updatedProject = await Project.findById(req.params.id).populate('assignedJudges');
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove a judge from a project
router.delete('/:id/judges/:judgeId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const judge = await Judge.findById(req.params.judgeId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }

    project.assignedJudges = project.assignedJudges.filter(
      (id) => id.toString() !== judge._id.toString()
    );
    await project.save();

    judge.assignedToProjectId = null;
    await judge.save();

    const updatedProject = await Project.findById(req.params.id).populate('assignedJudges');
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Unassign all judges from this project
    await Judge.updateMany(
      { assignedToProjectId: req.params.id },
      { assignedToProjectId: null }
    );

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

