import Judge from '../models/Judge.js';
import Project from '../models/Project.js';
import Track from '../models/Track.js';
import RubricConfig from '../models/RubricConfig.js';

/**
 * Auto-assign judges to projects based on:
 * - Specialty/track matching
 * - Load balancing (max projects per judge)
 * - Random distribution for fairness
 */
export async function autoAssignJudges() {
  try {
    // Get all unassigned projects
    const projects = await Project.find({
      $or: [
        { assignedJudges: { $size: 0 } },
        { assignedJudges: { $exists: false } }
      ]
    }).populate('trackId');

    // Get all available judges (not at max capacity)
    const judges = await Judge.find({})
      .populate('userId')
      .populate('trackId');

    const results = {
      assigned: [],
      failed: [],
    };

    for (const project of projects) {
      const assignmentResult = await assignJudgesToProject(project, judges);
      if (assignmentResult.success) {
        results.assigned.push({
          projectId: project._id,
          projectName: project.name,
          assignedJudges: assignmentResult.assignedJudges,
        });
      } else {
        results.failed.push({
          projectId: project._id,
          projectName: project.name,
          reason: assignmentResult.reason,
        });
      }
    }

    return results;
  } catch (error) {
    throw new Error(`Auto-assignment failed: ${error.message}`);
  }
}

/**
 * Assign judges to a single project
 */
async function assignJudgesToProject(project, allJudges) {
  // Get rubric config for judge limits
  const rubricConfig = await RubricConfig.getConfig();
  
  // Determine target number of judges (from track, rubric config, or default: 3-4)
  const targetJudgesCount = project.trackId?.minJudges || rubricConfig.minJudgesPerProject || 3;
  const maxJudgesCount = project.trackId?.maxJudges || rubricConfig.maxJudgesPerProject || 4;
  const desiredCount = Math.min(maxJudgesCount, Math.max(targetJudgesCount, 3)); // Aim for min 3, max 4

  // Filter available judges
  const availableJudges = allJudges.filter(judge => {
    // Check if judge has capacity
    if (judge.currentProjectsCount >= judge.maxProjects) {
      return false;
    }
    
    // Check if already assigned to this project
    if (project.assignedJudges?.some(id => id.toString() === judge._id.toString())) {
      return false;
    }

    return true;
  });

  if (availableJudges.length === 0) {
    return { success: false, reason: 'No available judges' };
  }

  // Prioritize judges by specialty/track matching
  const prioritizedJudges = prioritizeJudges(project, availableJudges);

  // Select judges (ensure we have enough)
  const selectedJudges = prioritizedJudges.slice(0, Math.min(desiredCount, prioritizedJudges.length));

  if (selectedJudges.length < targetJudgesCount) {
    return { 
      success: false, 
      reason: `Only ${selectedJudges.length} judge(s) available, need at least ${targetJudgesCount}` 
    };
  }

  // Assign judges to project
  const assignedJudgeIds = selectedJudges.map(judge => judge._id);

  // Update project
  project.assignedJudges = assignedJudgeIds;
  await project.save();

  // Update judge project counts
  for (const judge of selectedJudges) {
    judge.currentProjectsCount += 1;
    await judge.save();
  }

  return {
    success: true,
    assignedJudges: selectedJudges.map(j => ({
      id: j._id,
      name: j.name,
      specialty: j.specialty,
    })),
  };
}

/**
 * Prioritize judges based on specialty/track matching
 */
function prioritizeJudges(project, judges) {
  const projectCategory = project.category?.toLowerCase();
  const projectTrack = project.trackId?.category?.toLowerCase();

  return judges
    .map(judge => {
      let score = 0;
      const judgeSpecialty = judge.specialty?.toLowerCase() || '';
      const judgeTrack = judge.trackId?.category?.toLowerCase() || '';

      // Exact match gets highest score
      if (judgeSpecialty === projectCategory || judgeTrack === projectTrack) {
        score += 10;
      }

      // Partial match
      if (judgeSpecialty.includes(projectCategory) || projectCategory.includes(judgeSpecialty)) {
        score += 5;
      }

      // Lower current load = higher priority (load balancing)
      score += (judge.maxProjects - judge.currentProjectsCount) * 2;

      // Random factor for fairness
      score += Math.random() * 2;

      return { judge, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.judge);
}

/**
 * Assign judges to all projects that need them
 */
export async function assignJudgesToAllProjects() {
  return await autoAssignJudges();
}

/**
 * Get assignment statistics
 */
export async function getAssignmentStats() {
  const projects = await Project.find();
  const judges = await Judge.find();

  const stats = {
    totalProjects: projects.length,
    projectsWithJudges: projects.filter(p => p.assignedJudges?.length > 0).length,
    projectsNeedingJudges: projects.filter(p => !p.assignedJudges || p.assignedJudges.length === 0).length,
    totalJudges: judges.length,
    judgesAtCapacity: judges.filter(j => j.currentProjectsCount >= j.maxProjects).length,
    judgesAvailable: judges.filter(j => j.currentProjectsCount < j.maxProjects).length,
    averageProjectsPerJudge: judges.length > 0
      ? judges.reduce((sum, j) => sum + j.currentProjectsCount, 0) / judges.length
      : 0,
  };

  return stats;
}

