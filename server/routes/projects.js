import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Hackathon from '../models/Hackathon.js';
import { requireAnyAuth, requireAdmin, requireParticipant, requireJudge } from '../middleware/auth.js';
import { getDefaultHackathonId, initializeDefaultHackathon } from '../utils/initializeDefaultHackathon.js';
import { autoAssignJudgesToProject } from '../utils/autoAssignJudges.js';

const router = express.Router();

// Get all projects with assigned judges (any authenticated user)
router.get('/', requireAnyAuth, async (req, res) => {
  try {
    const { hackathonId, judgeId } = req.query;
    const query = {};
    if (hackathonId) query.hackathonId = hackathonId;
    
    // If judgeId is provided, only return projects assigned to that judge
    let projects = await Project.find(query)
      .populate('assignedJudges', 'firstName lastName email specialty initials')
      .populate('createdBy', 'firstName lastName email')
      .populate('hackathonId', 'name')
      .sort({ createdAt: -1 });
    
    if (judgeId) {
      projects = projects.filter(project => {
        if (!project.assignedJudges || project.assignedJudges.length === 0) return false;
        return project.assignedJudges.some(judge => {
          const judgeIdStr = typeof judge === 'string' ? judge : judge._id?.toString();
          return judgeIdStr === judgeId;
        });
      });
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single project (any authenticated user)
router.get('/:id', requireAnyAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedJudges', 'firstName lastName email specialty initials')
      .populate('createdBy', 'firstName lastName email')
      .populate('hackathonId', 'name');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new project (participant or admin)
router.post('/', requireParticipant, async (req, res) => {
  try {
    const { name, category, description, hackathonId, status, githubUrl } = req.body;
    
    if (!name || !category || !description) {
      return res.status(400).json({ 
        message: 'Name, category, and description are required' 
      });
    }

    // If no hackathonId provided, use the default InnovateHer hackathon
    let projectHackathonId = hackathonId;
    if (!projectHackathonId) {
      // Try to get the default InnovateHer hackathon
      projectHackathonId = await getDefaultHackathonId();
      
      // If default hackathon doesn't exist yet, try to initialize it
      if (!projectHackathonId) {
        const defaultHackathon = await initializeDefaultHackathon();
        if (defaultHackathon) {
          projectHackathonId = defaultHackathon._id;
        } else {
          // Last resort: create it with the current user as creator
          const now = new Date();
          const endDate = new Date(now);
          endDate.setFullYear(endDate.getFullYear() + 1);
          
          const newHackathon = new Hackathon({
            name: 'InnovateHer',
            description: 'The default hackathon for all InnovateHer project submissions. Join us in creating innovative solutions!',
            startDate: now,
            endDate: endDate,
            status: 'active',
            createdBy: req.user._id,
          });
          const savedHackathon = await newHackathon.save();
          projectHackathonId = savedHackathon._id;
        }
      }
    }

    const project = new Project({
      name,
      category,
      description,
      githubUrl,
      hackathonId: projectHackathonId,
      createdBy: req.user._id,
      status: status || 'draft',
      assignedJudges: [],
    });
    const savedProject = await project.save();
    
    // Auto-assign judges based on specialty matching
    try {
      await autoAssignJudgesToProject(savedProject._id);
      // Reload project to get assigned judges
      const updatedProject = await Project.findById(savedProject._id);
      if (updatedProject) {
        savedProject.assignedJudges = updatedProject.assignedJudges;
      }
    } catch (assignError) {
      console.error('Error auto-assigning judges:', assignError);
      // Continue even if auto-assignment fails
    }
    
    const populatedProject = await Project.findById(savedProject._id)
      .populate('assignedJudges', 'firstName lastName email specialty initials')
      .populate('createdBy', 'firstName lastName email')
      .populate('hackathonId', 'name');
    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a project (participant can update own project, admin can update any)
router.put('/:id', requireAnyAuth, async (req, res) => {
  try {
    const { name, category, description, assignedJudges, status, githubUrl } = req.body;
    
    // Get the current project to compare old vs new assignedJudges
    const oldProject = await Project.findById(req.params.id);
    if (!oldProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions: participant can only update their own projects
    if (req.user.role === 'participant' && oldProject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own projects' });
    }

    // Only admin and judges can assign judges
    if (assignedJudges && req.user.role === 'participant') {
      return res.status(403).json({ message: 'Only admins and judges can assign judges to projects' });
    }

    const oldAssignedJudges = oldProject.assignedJudges.map(id => id.toString());
    const newAssignedJudges = assignedJudges ? assignedJudges.map(id => id.toString()) : oldAssignedJudges;

    // Update the project
    const updateData = { name, category, description };
    if (githubUrl !== undefined) {
      updateData.githubUrl = githubUrl;
    }
    if (assignedJudges !== undefined) {
      updateData.assignedJudges = assignedJudges;
    }
    if (status !== undefined && (req.user.role === 'admin' || req.user.role === 'participant')) {
      updateData.status = status;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedJudges', 'name email specialty initials')
     .populate('createdBy', 'name email')
     .populate('hackathonId', 'name');

    // Update judge assignments and clean up stale references
    if (assignedJudges) {
      // Find judges that were removed from this project
      const removedJudges = oldAssignedJudges.filter(id => !newAssignedJudges.includes(id));
      
      // Find judges that were added to this project (moved from other projects)
      const addedJudges = newAssignedJudges.filter(id => !oldAssignedJudges.includes(id));

      // Remove judges from their old projects' assignedJudges arrays
      if (addedJudges.length > 0) {
        const judgesToMove = await User.find({ _id: { $in: addedJudges }, role: 'judge' });
        for (const judge of judgesToMove) {
          // Find projects where this judge is assigned and remove them
          await Project.updateMany(
            { assignedJudges: judge._id, _id: { $ne: req.params.id } },
            { $pull: { assignedJudges: judge._id } }
          );
        }
      }
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Assign a judge to a project (admin or judge only)
router.post('/:id/judges/:judgeId', requireJudge, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const judge = await User.findById(req.params.judgeId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (!judge || judge.role !== 'judge') {
      return res.status(404).json({ message: 'Judge not found' });
    }

    // Remove judge from previous projects if assigned
    await Project.updateMany(
      { assignedJudges: judge._id, _id: { $ne: req.params.id } },
      { $pull: { assignedJudges: judge._id } }
    );

    // Add judge to new project
    if (!project.assignedJudges.includes(judge._id)) {
      project.assignedJudges.push(judge._id);
      await project.save();
    }

    const updatedProject = await Project.findById(req.params.id)
      .populate('assignedJudges', 'firstName lastName email specialty initials')
      .populate('createdBy', 'firstName lastName email')
      .populate('hackathonId', 'name');
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove a judge from a project (admin or judge only)
router.delete('/:id/judges/:judgeId', requireJudge, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const judge = await User.findById(req.params.judgeId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (!judge || judge.role !== 'judge') {
      return res.status(404).json({ message: 'Judge not found' });
    }

    project.assignedJudges = project.assignedJudges.filter(
      (id) => id.toString() !== judge._id.toString()
    );
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('assignedJudges', 'firstName lastName email specialty initials')
      .populate('createdBy', 'firstName lastName email')
      .populate('hackathonId', 'name');
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a project (participant can delete own project, admin can delete any)
router.delete('/:id', requireAnyAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions: participant can only delete their own projects
    if (req.user.role === 'participant' && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own projects' });
    }

    // Unassign all judges from this project (cleanup)
    await Project.updateMany(
      { assignedJudges: { $in: project.assignedJudges } },
      { $pull: { assignedJudges: { $in: project.assignedJudges } } }
    );

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

