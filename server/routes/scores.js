import express from 'express';
import Score from '../models/Score.js';
import Project from '../models/Project.js';
import Judge from '../models/Judge.js';
import RubricConfig from '../models/RubricConfig.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { analyzeSentiment } from '../utils/sentimentAnalysis.js';

const router = express.Router();

// Submit/Update score (Judge only)
router.post('/', authenticateToken, authorizeRoles('judge'), async (req, res) => {
  try {
    const { projectId, rubricScores, feedback } = req.body;
    const judgeId = req.user.judgeProfile;

    if (!judgeId) {
      return res.status(400).json({ message: 'Judge profile not found' });
    }

    // Verify judge is assigned to this project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.assignedJudges.includes(judgeId)) {
      return res.status(403).json({ message: 'You are not assigned to this project' });
    }

    // Get rubric configuration for this project's track
    const rubricConfig = await RubricConfig.getConfig();
    const projectRubric = rubricConfig.getRubricForTrack(project.trackId);

    // Apply rubric weights from config to scores
    const defaultRubricScores = {
      techStack: { score: 0, weight: projectRubric.techStack.weight },
      design: { score: 0, weight: projectRubric.design.weight },
      growthPotential: { score: 0, weight: projectRubric.growthPotential.weight },
      presentation: { score: 0, weight: projectRubric.presentation.weight },
      inspiration: { score: 0, weight: projectRubric.inspiration.weight },
    };

    // Merge provided scores with defaults (preserving weights from config)
    const finalRubricScores = rubricScores ? {
      techStack: { ...defaultRubricScores.techStack, ...rubricScores.techStack },
      design: { ...defaultRubricScores.design, ...rubricScores.design },
      growthPotential: { ...defaultRubricScores.growthPotential, ...rubricScores.growthPotential },
      presentation: { ...defaultRubricScores.presentation, ...rubricScores.presentation },
      inspiration: { ...defaultRubricScores.inspiration, ...rubricScores.inspiration },
    } : defaultRubricScores;

    // Analyze sentiment from feedback
    const sentiment = feedback ? analyzeSentiment(feedback) : null;

    // Create or update score
    const scoreData = {
      projectId,
      judgeId,
      rubricScores: finalRubricScores,
      feedback: feedback || '',
      sentimentScore: sentiment?.score || null,
    };

    let score = await Score.findOne({ projectId, judgeId });
    
    if (score) {
      // Update existing score
      Object.assign(score, scoreData);
      await score.save();
    } else {
      // Create new score
      score = new Score(scoreData);
      await score.save();
    }

    // Calculate average score for project
    await updateProjectAverageScore(projectId);

    res.json({
      ...score.toObject(),
      sentimentAnalysis: sentiment,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get scores for a project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const scores = await Score.find({ projectId: req.params.projectId })
      .populate('judgeId', 'name initials specialty');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get scores by a judge
router.get('/judge/:judgeId', authenticateToken, async (req, res) => {
  try {
    const scores = await Score.find({ judgeId: req.params.judgeId })
      .populate('projectId', 'name category description');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const projects = await Project.find({ status: { $in: ['under_review', 'judged'] } })
      .populate('participantId', 'name email')
      .populate('trackId', 'name category')
      .sort({ averageScore: -1 });

    const leaderboard = projects.map(project => ({
      projectId: project._id,
      projectName: project.name,
      category: project.category,
      participant: {
        name: project.participantId?.name,
        email: project.participantId?.email,
      },
      track: project.trackId ? {
        name: project.trackId.name,
        category: project.trackId.category,
      } : null,
      averageScore: project.averageScore || 0,
      judgesCount: project.assignedJudges.length,
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update project's average score
async function updateProjectAverageScore(projectId) {
  const scores = await Score.find({ projectId });
  
  if (scores.length === 0) {
    await Project.findByIdAndUpdate(projectId, { averageScore: null });
    return;
  }

  const totalScore = scores.reduce((sum, score) => sum + score.totalScore, 0);
  const averageScore = totalScore / scores.length;
  
  await Project.findByIdAndUpdate(projectId, {
    averageScore: Math.round(averageScore * 100) / 100,
    status: scores.length > 0 ? 'judged' : 'under_review',
  });
}

export default router;

