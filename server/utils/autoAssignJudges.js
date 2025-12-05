import User from '../models/User.js';
import Project from '../models/Project.js';

/**
 * Auto-assign judges to a project based on specialty matching and even distribution
 */
export async function autoAssignJudgesToProject(projectId) {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Skip if project already has judges assigned
    if (project.assignedJudges && project.assignedJudges.length > 0) {
      return {
        success: true,
        message: 'Project already has judges assigned',
        assignedJudges: project.assignedJudges,
      };
    }

    // Get all available judges
    const allJudges = await User.find({ role: 'judge' }).select('-password');

    if (allJudges.length === 0) {
      return {
        success: false,
        message: 'No judges available for assignment',
      };
    }

    // Get all projects to calculate judge load
    const allProjects = await Project.find();
    
    // Calculate how many projects each judge is currently assigned to
    const judgeLoad = {};
    allJudges.forEach(judge => {
      judgeLoad[judge._id.toString()] = allProjects.filter(p => 
        p.assignedJudges && p.assignedJudges.some(jId => jId.toString() === judge._id.toString())
      ).length;
    });

    // Target number of judges per project (aim for 3-4, adjust based on available judges)
    const totalJudges = allJudges.length;
    const totalProjects = allProjects.length;
    const judgesPerProject = Math.max(2, Math.min(4, Math.floor(totalJudges / Math.max(1, totalProjects))));

    // Match judges by specialty to project category
    const projectCategory = (project.category || '').toLowerCase();
    
    // Score judges based on specialty match and current load
    const scoredJudges = allJudges.map(judge => {
      let score = 0;
      const judgeSpecialty = (judge.specialty || '').toLowerCase();
      
      // Specialty matching - exact match gets highest score
      if (judgeSpecialty === projectCategory) {
        score += 100;
      } else if (projectCategory.includes(judgeSpecialty) || judgeSpecialty.includes(projectCategory)) {
        score += 50;
      }
      
      // Partial keyword matching
      const categoryWords = projectCategory.split(/\s+/);
      const specialtyWords = judgeSpecialty.split(/\s+/);
      categoryWords.forEach(word => {
        if (specialtyWords.some(s => s.includes(word) || word.includes(s))) {
          score += 20;
        }
      });
      
      // Load balancing - prefer judges with fewer assignments
      const currentLoad = judgeLoad[judge._id.toString()] || 0;
      const avgLoad = totalProjects > 0 ? totalProjects / totalJudges : 0;
      if (currentLoad < avgLoad) {
        score += 30;
      } else if (currentLoad > avgLoad) {
        score -= 10;
      }
      
      // Slight randomization for fairness
      score += Math.random() * 5;
      
      return { judge, score, currentLoad };
    });

    // Sort by score and select top judges
    scoredJudges.sort((a, b) => b.score - a.score);
    
    // Select judges (prioritize specialty matches, then balance load)
    const selectedJudges = [];
    const specialtyMatches = scoredJudges.filter(j => j.score >= 50); // Judges with some specialty match
    
    // First, try to get specialty matches
    if (specialtyMatches.length > 0) {
      // Sort specialty matches by load (prefer less loaded)
      specialtyMatches.sort((a, b) => a.currentLoad - b.currentLoad);
      selectedJudges.push(...specialtyMatches.slice(0, Math.min(judgesPerProject, specialtyMatches.length)));
    }
    
    // Fill remaining slots with least loaded judges
    if (selectedJudges.length < judgesPerProject) {
      const remainingSlots = judgesPerProject - selectedJudges.length;
      const selectedIds = new Set(selectedJudges.map(j => j.judge._id.toString()));
      const availableJudges = scoredJudges.filter(j => !selectedIds.has(j.judge._id.toString()));
      availableJudges.sort((a, b) => a.currentLoad - b.currentLoad);
      selectedJudges.push(...availableJudges.slice(0, remainingSlots));
    }

    // Assign judges to project
    const judgeIds = selectedJudges.map(j => j.judge._id);
    project.assignedJudges = judgeIds;
    await project.save();

    return {
      success: true,
      message: `Assigned ${judgeIds.length} judge(s) to project`,
      assignedJudges: selectedJudges.map(j => ({
        id: j.judge._id,
        name: `${j.judge.firstName} ${j.judge.lastName}`,
        specialty: j.judge.specialty,
      })),
    };
  } catch (error) {
    console.error('Error auto-assigning judges:', error);
    throw error;
  }
}

/**
 * Auto-assign judges to all unassigned projects
 */
export async function autoAssignUnassignedProjects() {
  try {
    // Get all projects without assigned judges
    const unassignedProjects = await Project.find({
      $or: [
        { assignedJudges: { $size: 0 } },
        { assignedJudges: { $exists: false } }
      ]
    });

    if (unassignedProjects.length === 0) {
      return {
        success: true,
        message: 'All projects already have judges assigned',
        assigned: [],
      };
    }

    const results = {
      assigned: [],
      failed: [],
    };

    // Auto-assign judges to each unassigned project
    for (const project of unassignedProjects) {
      try {
        const assignmentResult = await autoAssignJudgesToProject(project._id);
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
            reason: assignmentResult.message || 'Assignment failed',
          });
        }
      } catch (error) {
        results.failed.push({
          projectId: project._id,
          projectName: project.name,
          reason: error.message,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error auto-assigning unassigned projects:', error);
    throw error;
  }
}

/**
 * Rebalance all judge assignments to ensure even distribution
 */
export async function rebalanceAllJudgeAssignments() {
  try {
    const allProjects = await Project.find({ assignedJudges: { $exists: true } });
    const allJudges = await User.find({ role: 'judge' }).select('-password');

    if (allJudges.length === 0 || allProjects.length === 0) {
      return { success: true, message: 'No judges or projects to rebalance' };
    }

    // Calculate target assignments per judge
    const totalJudges = allJudges.length;
    const totalProjects = allProjects.length;
    const targetPerJudge = Math.ceil((totalProjects * 3) / totalJudges); // Aim for ~3 judges per project

    // Clear all assignments first
    for (const project of allProjects) {
      project.assignedJudges = [];
      await project.save();
    }

    // Reassign with even distribution
    const judgeLoad = {};
    allJudges.forEach(judge => {
      judgeLoad[judge._id.toString()] = 0;
    });

    // Assign judges to each project
    for (const project of allProjects) {
      const projectCategory = (project.category || '').toLowerCase();
      
      // Score and sort judges for this project
      const scoredJudges = allJudges.map(judge => {
        let score = 0;
        const judgeSpecialty = (judge.specialty || '').toLowerCase();
        const currentLoad = judgeLoad[judge._id.toString()] || 0;
        
        // Specialty matching
        if (judgeSpecialty === projectCategory) {
          score += 100;
        } else if (projectCategory.includes(judgeSpecialty) || judgeSpecialty.includes(projectCategory)) {
          score += 50;
        }
        
        // Load balancing - heavily favor less loaded judges
        score += (targetPerJudge - currentLoad) * 10;
        
        return { judge, score, currentLoad };
      });

      scoredJudges.sort((a, b) => b.score - a.score);
      
      // Select 3-4 judges
      const judgesPerProject = Math.min(4, totalJudges);
      const selectedJudges = scoredJudges.slice(0, judgesPerProject);
      
      project.assignedJudges = selectedJudges.map(j => j.judge._id);
      await project.save();
      
      // Update load counts
      selectedJudges.forEach(j => {
        judgeLoad[j.judge._id.toString()] = (judgeLoad[j.judge._id.toString()] || 0) + 1;
      });
    }

    return {
      success: true,
      message: 'Rebalanced all judge assignments',
    };
  } catch (error) {
    console.error('Error rebalancing assignments:', error);
    throw error;
  }
}
