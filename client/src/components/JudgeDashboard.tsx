import { useState, useEffect } from 'react';
import { ClipboardList, Star, MessageSquare, Github, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, scoresAPI, assignmentsAPI, rubricAPI } from '../services/api';
import { Project } from '../types';

type RubricCriterion = {
  name: string;
  weight: number;
  maxScore: number;
  key: string;
};

type ProjectScores = {
  [projectId: string]: {
    [criterion: string]: number;
  };
};

type ProjectComments = {
  [projectId: string]: string;
};

export default function JudgeDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'scoring' | 'comments'>('projects');
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scores, setScores] = useState<ProjectScores>({});
  const [comments, setComments] = useState<ProjectComments>({});
  const [currentComment, setCurrentComment] = useState('');
  const [selectedProjectForComment, setSelectedProjectForComment] = useState<string | null>(null);
  const [submittingScores, setSubmittingScores] = useState<Set<string>>(new Set());
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([]);

  useEffect(() => {
    // Wait for auth to finish loading before fetching projects
    if (!authLoading && user && (user._id || user.id)) {
      fetchRubric();
      fetchAssignedProjects();
    } else if (!authLoading && !user) {
      // Auth finished loading but no user found
      setError('Please log in to access the judge dashboard.');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?._id, user?.id]);

  const fetchRubric = async () => {
    try {
      const rubricConfig = await rubricAPI.getRubric();
      const globalRubric = rubricConfig.globalRubric || {};
      
      // Map backend rubric structure to frontend format
      const criteria: RubricCriterion[] = [];
      
      // Map backend rubric to frontend display - use the exact names from backend
      if (globalRubric.inspiration) {
        criteria.push({
          name: globalRubric.inspiration.name || 'Inspiration',
          weight: (globalRubric.inspiration.weight || 0.2) * 100,
          maxScore: 10,
          key: 'inspiration'
        });
      }
      if (globalRubric.techStack) {
        criteria.push({
          name: globalRubric.techStack.name || 'Tech Stack',
          weight: (globalRubric.techStack.weight || 0.2) * 100,
          maxScore: 10,
          key: 'techStack'
        });
      }
      if (globalRubric.design) {
        criteria.push({
          name: globalRubric.design.name || 'Design',
          weight: (globalRubric.design.weight || 0.2) * 100,
          maxScore: 10,
          key: 'design'
        });
      }
      if (globalRubric.growthPotential) {
        criteria.push({
          name: globalRubric.growthPotential.name || 'Growth Potential',
          weight: (globalRubric.growthPotential.weight || 0.2) * 100,
          maxScore: 10,
          key: 'growthPotential'
        });
      }
      if (globalRubric.presentation) {
        criteria.push({
          name: globalRubric.presentation.name || 'Presentation',
          weight: (globalRubric.presentation.weight || 0.2) * 100,
          maxScore: 10,
          key: 'presentation'
        });
      }
      
      // If no criteria found, use defaults matching backend structure
      if (criteria.length === 0) {
        criteria.push(
          { name: 'Inspiration', weight: 20, maxScore: 10, key: 'inspiration' },
          { name: 'Tech Stack', weight: 20, maxScore: 10, key: 'techStack' },
          { name: 'Design', weight: 20, maxScore: 10, key: 'design' },
          { name: 'Growth Potential', weight: 20, maxScore: 10, key: 'growthPotential' },
          { name: 'Presentation', weight: 20, maxScore: 10, key: 'presentation' }
        );
      }
      
      setRubricCriteria(criteria);
    } catch (err) {
      console.error('Error fetching rubric:', err);
      // Use defaults if fetch fails
      setRubricCriteria([
        { name: 'Innovation', weight: 30, maxScore: 10, key: 'inspiration' },
        { name: 'Technical Implementation', weight: 30, maxScore: 10, key: 'techStack' },
        { name: 'Design & UX', weight: 20, maxScore: 10, key: 'design' },
        { name: 'Social Impact', weight: 20, maxScore: 10, key: 'growthPotential' }
      ]);
    }
  };

  const fetchAssignedProjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Wait for user to be loaded
      if (authLoading) {
        return;
      }
      
      const judgeId = user?._id || user?.id;
      
      if (!judgeId) {
        setError('Judge information not found. Please make sure you are logged in as a judge.');
        setLoading(false);
        return;
      }
      
      // Verify user is a judge
      if (user?.role !== 'judge') {
        setError('Access denied. This page is only for judges.');
        setLoading(false);
        return;
      }

      // Auto-assign judges to any unassigned projects when judge logs in
      try {
        await assignmentsAPI.autoAssign();
      } catch (assignError) {
        console.error('Error auto-assigning projects:', assignError);
        // Continue even if auto-assignment fails
      }

      // Get projects assigned to this judge
      const allProjects = await projectsAPI.getAll();
      const assigned = allProjects.filter(project => {
        if (!project.assignedJudges || project.assignedJudges.length === 0) return false;
        return project.assignedJudges.some(judge => {
          const judgeIdStr = typeof judge === 'string' ? judge : (judge as any)._id;
          return judgeIdStr === judgeId;
        });
      });

      setAssignedProjects(assigned);
      
      // Fetch existing scores for these projects
      try {
        const myScores = await scoresAPI.getMyScores();
        const scoresMap: ProjectScores = {};
        const commentsMap: ProjectComments = {};
        
        myScores.forEach((score: any) => {
          const projectId = typeof score.projectId === 'string' ? score.projectId : score.projectId._id;
          if (score.rubricScores && rubricCriteria.length > 0) {
            // Map backend rubric scores to frontend format using rubric criteria
            const mappedScores: Record<string, number> = {};
            rubricCriteria.forEach(criterion => {
              const backendScore = score.rubricScores[criterion.key];
              mappedScores[criterion.name] = backendScore?.score || 0;
            });
            scoresMap[projectId] = mappedScores;
          }
          if (score.feedback) {
            commentsMap[projectId] = score.feedback;
          }
        });
        
        setScores(scoresMap);
        setComments(commentsMap);
      } catch (scoreErr) {
        console.error('Error fetching scores:', scoreErr);
        // Continue without scores
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load assigned projects. Please try again.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (projectId: string, criterion: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || {}),
        [criterion]: value
      }
    }));
  };

  const handleSubmitScores = async (projectId: string) => {
    try {
      setSubmittingScores(prev => new Set(prev).add(projectId));
      setError('');
      
      const projectScores = scores[projectId];
      if (!projectScores) {
        setError('Please enter scores for all criteria');
        return;
      }

      // Convert scores to the format expected by the backend
      // Map frontend criteria to backend rubric structure using the key
      const rubricScores: Record<string, { score: number }> = {};
      rubricCriteria.forEach(criterion => {
        const score = projectScores[criterion.name] || 0;
        rubricScores[criterion.key] = { score };
      });
      
      // Ensure all required backend fields are present
      if (!rubricScores.presentation) {
        rubricScores.presentation = { score: 0 };
      }

      await scoresAPI.submitScore(projectId, rubricScores, comments[projectId] || '');
      
      // Refresh to get updated scores
      await fetchAssignedProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit scores. Please try again.');
      console.error('Error submitting scores:', err);
    } finally {
      setSubmittingScores(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const handleSubmitComment = async (projectId: string) => {
    if (currentComment.trim()) {
      try {
        // Submit comment as feedback with scores (or update existing score)
        const projectScores = scores[projectId] || {};
        const rubricScores: Record<string, { score: number }> = {};
        rubricCriteria.forEach(criterion => {
          const score = projectScores[criterion.name] || 0;
          rubricScores[criterion.key] = { score };
        });
        
        // Ensure all required backend fields are present
        if (!rubricScores.presentation) {
          rubricScores.presentation = { score: 0 };
        }
        
        await scoresAPI.submitScore(projectId, rubricScores, currentComment);
        
        setComments(prev => ({
          ...prev,
          [projectId]: currentComment
        }));
        setCurrentComment('');
        setSelectedProjectForComment(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to submit comment. Please try again.');
        console.error('Error submitting comment:', err);
      }
    }
  };

  const calculateProjectScore = (projectId: string) => {
    const projectScores = scores[projectId];
    if (!projectScores || rubricCriteria.length === 0) return '0.00';

    const totalScore = rubricCriteria.reduce((sum, criterion) => {
      const score = projectScores[criterion.name] || 0;
      return sum + (score * (criterion.weight / 100));
    }, 0);

    return totalScore.toFixed(2);
  };

  const isProjectScored = (projectId: string) => {
    const projectScores = scores[projectId];
    if (!projectScores || rubricCriteria.length === 0) return false;
    return rubricCriteria.every(criterion => (projectScores[criterion.name] || 0) > 0);
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getJudgeName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.name || 'Judge';
  };

  const getCreatorName = (project: Project): string => {
    if (!project.createdBy) return 'Unknown';
    if (typeof project.createdBy === 'string') return 'Unknown';
    const creator = project.createdBy as any;
    if (creator.firstName && creator.lastName) {
      return `${creator.firstName} ${creator.lastName}`;
    }
    return creator.name || 'Unknown';
  };

  // Show loading while auth is loading or while fetching projects
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
        <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
          <p style={{ fontFamily: 'Georgia, serif', color: '#333' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && assignedProjects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
        <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
          <p style={{ fontFamily: 'Georgia, serif', color: '#dc2626' }}>{error}</p>
          <button
            onClick={fetchAssignedProjects}
            className="mt-4 px-6 py-2 rounded-md transition hover:opacity-90"
            style={{
              backgroundColor: '#c89999',
              color: '#fff',
              border: '2px solid #000',
              fontFamily: 'Georgia, serif',
              fontWeight: '600'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#d4a5a5' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-white mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2.5rem', lineHeight: '1' }}>
          innovate
        </h1>
        <h2 className="text-white mb-4" style={{ fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: '1.75rem', lineHeight: '1', letterSpacing: '0.05em' }}>
          {'</HER>'}
        </h2>
        <p className="text-white" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          Judge Dashboard - {getJudgeName()}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
            <p style={{ fontFamily: 'Georgia, serif', color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('projects')}
            className="px-6 py-3 rounded-md transition hover:opacity-90"
            style={{
              backgroundColor: activeTab === 'projects' ? '#c89999' : 'white',
              color: activeTab === 'projects' ? 'white' : '#333',
              border: '2px solid #000',
              fontFamily: 'Georgia, serif',
              fontWeight: '600'
            }}
          >
            <ClipboardList className="inline w-5 h-5 mr-2" />
            My Projects ({assignedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('scoring')}
            className="px-6 py-3 rounded-md transition hover:opacity-90"
            style={{
              backgroundColor: activeTab === 'scoring' ? '#c89999' : 'white',
              color: activeTab === 'scoring' ? 'white' : '#333',
              border: '2px solid #000',
              fontFamily: 'Georgia, serif',
              fontWeight: '600'
            }}
          >
            <Star className="inline w-5 h-5 mr-2" />
            Scoring
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className="px-6 py-3 rounded-md transition hover:opacity-90"
            style={{
              backgroundColor: activeTab === 'comments' ? '#c89999' : 'white',
              color: activeTab === 'comments' ? 'white' : '#333',
              border: '2px solid #000',
              fontFamily: 'Georgia, serif',
              fontWeight: '600'
            }}
          >
            <MessageSquare className="inline w-5 h-5 mr-2" />
            Comments
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {assignedProjects.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
                <p style={{ fontFamily: 'Georgia, serif', color: '#666' }}>No projects assigned yet.</p>
              </div>
            ) : (
              assignedProjects.map(project => (
                <div key={project._id} className="bg-white rounded-lg p-6 relative" style={{ border: '3px solid #000' }}>
                  {/* Decorative corner elements */}
                  <div className="absolute top-4 left-4 w-4 h-4 rounded" style={{ backgroundColor: '#c8999980' }}></div>
                  <div className="absolute top-4 right-4 w-4 h-4 rounded" style={{ backgroundColor: '#c8999980' }}></div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                        {project.name}
                      </h3>
                      <span 
                        className="inline-block px-3 py-1 rounded"
                        style={{ backgroundColor: '#c89999', color: 'white', fontFamily: 'Georgia, serif', fontSize: '0.875rem' }}
                      >
                        {project.category}
                      </span>
                    </div>
                    {isProjectScored(project._id) && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-md" style={{ backgroundColor: '#d1fae5', border: '2px solid #10b981' }}>
                        <Star className="w-5 h-5" style={{ color: '#10b981' }} />
                        <span style={{ fontFamily: 'Georgia, serif', color: '#10b981', fontWeight: '600' }}>
                          Scored
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="mb-2" style={{ fontFamily: 'Georgia, serif', color: '#666', fontWeight: '600' }}>
                      Project Description
                    </p>
                    <p style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                      {project.description}
                    </p>
                  </div>
                  {project.githubUrl && (
                    <div className="mb-4">
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 transition hover:opacity-70"
                        style={{ color: '#c89999', fontFamily: 'Georgia, serif' }}
                      >
                        <Github className="w-4 h-4" />
                        View Repository
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="mb-3" style={{ fontFamily: 'Georgia, serif', color: '#666', fontWeight: '600' }}>
                      Created By
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: '#c89999', fontFamily: 'Georgia, serif', fontWeight: '600', fontSize: '0.75rem' }}
                      >
                        {getInitials(getCreatorName(project))}
                      </div>
                      <span style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                        {getCreatorName(project)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Scoring Tab */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            {/* Rubric Info */}
            <div className="bg-white rounded-lg p-6" style={{ border: '3px solid #000' }}>
              <h3 className="mb-4" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                Scoring Rubric
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {rubricCriteria.map((criterion, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-md"
                    style={{ backgroundColor: '#f9f9f9', border: '2px solid #e5e5e5' }}
                  >
                    <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                      {criterion.name}
                    </p>
                    <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                      Weight: {criterion.weight}% | Max Score: {criterion.maxScore}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Projects */}
            {assignedProjects.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
                <p style={{ fontFamily: 'Georgia, serif', color: '#666' }}>No projects assigned yet.</p>
              </div>
            ) : (
              assignedProjects.map(project => (
                <div key={project._id} className="bg-white rounded-lg p-6 relative" style={{ border: '3px solid #000' }}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                        {project.name}
                      </h3>
                      <span 
                        className="inline-block px-3 py-1 rounded"
                        style={{ backgroundColor: '#f0f0f0', fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}
                      >
                        {project.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                        Weighted Score
                      </p>
                      <p style={{ fontFamily: 'Georgia, serif', color: '#c89999', fontSize: '2rem', fontWeight: '700' }}>
                        {calculateProjectScore(project._id)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {rubricCriteria.map(criterion => (
                      <div key={criterion.name}>
                        <label className="block mb-3" style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                          {criterion.name} <span style={{ color: '#666', fontWeight: 'normal' }}>({criterion.weight}%)</span>
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max={criterion.maxScore}
                            value={scores[project._id]?.[criterion.name] || 0}
                            onChange={(e) => handleScoreChange(project._id, criterion.name, parseInt(e.target.value))}
                            className="flex-1"
                            style={{ accentColor: '#c89999' }}
                          />
                          <div className="flex gap-2">
                            {[...Array(criterion.maxScore + 1)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => handleScoreChange(project._id, criterion.name, i)}
                                className="w-10 h-10 rounded-md transition hover:opacity-80"
                                style={{
                                  backgroundColor: (scores[project._id]?.[criterion.name] || 0) === i ? '#c89999' : 'white',
                                  color: (scores[project._id]?.[criterion.name] || 0) === i ? 'white' : '#333',
                                  border: '2px solid #000',
                                  fontFamily: 'Georgia, serif',
                                  fontWeight: '600'
                                }}
                              >
                                {i}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6" style={{ borderTop: '2px solid #e5e5e5' }}>
                    <button
                      onClick={() => handleSubmitScores(project._id)}
                      disabled={!isProjectScored(project._id) || submittingScores.has(project._id)}
                      className="w-full py-3 rounded-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isProjectScored(project._id) ? '#10b981' : '#c89999',
                        color: '#fff',
                        border: '2px solid #000',
                        fontFamily: 'Georgia, serif',
                        fontWeight: '600',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {submittingScores.has(project._id) ? 'SUBMITTING...' : (isProjectScored(project._id) ? '✓ SCORES SUBMITTED' : 'SUBMIT SCORES')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {assignedProjects.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
                <p style={{ fontFamily: 'Georgia, serif', color: '#666' }}>No projects assigned yet.</p>
              </div>
            ) : (
              assignedProjects.map(project => (
                <div key={project._id} className="bg-white rounded-lg p-6 relative" style={{ border: '3px solid #000' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                        {project.name}
                      </h3>
                      <span 
                        className="inline-block px-3 py-1 rounded"
                        style={{ backgroundColor: '#f0f0f0', fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>
                  {/* Existing Comment */}
                  {comments[project._id] && (
                    <div 
                      className="mb-4 p-4 rounded-md"
                      style={{ backgroundColor: '#f9f9f9', border: '2px solid #c89999' }}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{ backgroundColor: '#c89999', fontFamily: 'Georgia, serif', fontWeight: '600', fontSize: '0.75rem' }}
                        >
                          {getInitials(getJudgeName())}
                        </div>
                        <div>
                          <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                            {getJudgeName()}
                          </p>
                          <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                            Judge
                          </p>
                        </div>
                      </div>
                      <p style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                        {comments[project._id]}
                      </p>
                    </div>
                  )}
                  {/* Add/Edit Comment */}
                  {selectedProjectForComment === project._id ? (
                    <div>
                      <textarea
                        value={currentComment}
                        onChange={(e) => setCurrentComment(e.target.value)}
                        placeholder="Write your feedback..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-md focus:outline-none resize-none mb-3"
                        style={{ 
                          border: '2px solid #000',
                          fontFamily: 'Georgia, serif'
                        }}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSubmitComment(project._id)}
                          className="flex-1 py-3 rounded-md transition hover:opacity-90"
                          style={{
                            backgroundColor: '#c89999',
                            color: '#fff',
                            border: '2px solid #000',
                            fontFamily: 'Georgia, serif',
                            fontWeight: '600'
                          }}
                        >
                          <Send className="inline w-4 h-4 mr-2" />
                          Submit Comment
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProjectForComment(null);
                            setCurrentComment('');
                          }}
                          className="px-6 py-3 rounded-md transition hover:opacity-90"
                          style={{
                            backgroundColor: 'white',
                            color: '#333',
                            border: '2px solid #000',
                            fontFamily: 'Georgia, serif',
                            fontWeight: '600'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedProjectForComment(project._id)}
                      className="w-full py-3 rounded-md transition hover:opacity-90"
                      style={{
                        backgroundColor: comments[project._id] ? 'white' : '#c89999',
                        color: comments[project._id] ? '#333' : '#fff',
                        border: '2px solid #000',
                        fontFamily: 'Georgia, serif',
                        fontWeight: '600'
                      }}
                    >
                      <MessageSquare className="inline w-4 h-4 mr-2" />
                      {comments[project._id] ? 'Edit Comment' : 'Add Comment'}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
