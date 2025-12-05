import { useState, useEffect } from 'react';
import { Users, ClipboardList, Award, BarChart3, Plus, X, Github, Edit2, Check, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, judgesAPI, assignmentsAPI, scoresAPI, rubricAPI } from '../services/api';
import { Project, User } from '../types';

type RubricCriterion = {
  name: string;
  weight: number;
  maxScore: number;
};


type ProjectScore = {
  _id: string;
  projectId: string | Project;
  judgeId: string | User;
  rubricScores: {
    techStack?: { score: number; weight: number };
    design?: { score: number; weight: number };
    growthPotential?: { score: number; weight: number };
    presentation?: { score: number; weight: number };
    inspiration?: { score: number; weight: number };
  };
  totalScore: number;
  feedback?: string;
  sentimentScore?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'judges' | 'rubric' | 'scores' | 'comments'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [judges, setJudges] = useState<User[]>([]);
  const [projectScores, setProjectScores] = useState<Record<string, ProjectScore[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [selectedJudges, setSelectedJudges] = useState<Set<string>>(new Set());
  const [savingAssignment, setSavingAssignment] = useState(false);
  
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([]);
  const [rubricConfig, setRubricConfig] = useState<any>(null);
  const [newCriterion, setNewCriterion] = useState({ name: '', weight: 0, maxScore: 10 });

  useEffect(() => {
    fetchData();
    fetchRubric();
  }, []);

  const fetchRubric = async () => {
    try {
      const config = await rubricAPI.getRubric();
      setRubricConfig(config);
      const globalRubric = config.globalRubric || {};
      
      // Map backend rubric structure to frontend format
      const criteria: RubricCriterion[] = [];
      
      if (globalRubric.inspiration) {
        criteria.push({
          name: globalRubric.inspiration.name || 'Inspiration',
          weight: (globalRubric.inspiration.weight || 0.2) * 100,
          maxScore: 10
        });
      }
      if (globalRubric.techStack) {
        criteria.push({
          name: globalRubric.techStack.name || 'Tech Stack',
          weight: (globalRubric.techStack.weight || 0.2) * 100,
          maxScore: 10
        });
      }
      if (globalRubric.design) {
        criteria.push({
          name: globalRubric.design.name || 'Design',
          weight: (globalRubric.design.weight || 0.2) * 100,
          maxScore: 10
        });
      }
      if (globalRubric.growthPotential) {
        criteria.push({
          name: globalRubric.growthPotential.name || 'Growth Potential',
          weight: (globalRubric.growthPotential.weight || 0.2) * 100,
          maxScore: 10
        });
      }
      if (globalRubric.presentation) {
        criteria.push({
          name: globalRubric.presentation.name || 'Presentation',
          weight: (globalRubric.presentation.weight || 0.2) * 100,
          maxScore: 10
        });
      }
      
      // If no criteria found, use defaults
      if (criteria.length === 0) {
        criteria.push(
          { name: 'Inspiration', weight: 20, maxScore: 10 },
          { name: 'Tech Stack', weight: 20, maxScore: 10 },
          { name: 'Design', weight: 20, maxScore: 10 },
          { name: 'Growth Potential', weight: 20, maxScore: 10 },
          { name: 'Presentation', weight: 20, maxScore: 10 }
        );
      }
      
      setRubricCriteria(criteria);
    } catch (err) {
      console.error('Error fetching rubric:', err);
      // Use defaults if fetch fails
      setRubricCriteria([
        { name: 'Inspiration', weight: 20, maxScore: 10 },
        { name: 'Tech Stack', weight: 20, maxScore: 10 },
        { name: 'Design', weight: 20, maxScore: 10 },
        { name: 'Growth Potential', weight: 20, maxScore: 10 },
        { name: 'Presentation', weight: 20, maxScore: 10 }
      ]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [projectsData, judgesData] = await Promise.all([
        projectsAPI.getAll(),
        judgesAPI.getAll(),
      ]);
      setProjects(projectsData);
      setJudges(judgesData as User[]);
      
      // Fetch scores for all projects
      const scoresMap: Record<string, ProjectScore[]> = {};
      for (const project of projectsData) {
        try {
          const scores = await scoresAPI.getProjectScores(project._id);
          if (scores && scores.length > 0) {
            scoresMap[project._id] = scores;
          }
        } catch (scoreErr) {
          console.error(`Error fetching scores for project ${project._id}:`, scoreErr);
        }
      }
      setProjectScores(scoresMap);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
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

  const getJudgeName = (judge: any): string => {
    if (typeof judge === 'string') return judge;
    if (judge.firstName && judge.lastName) {
      return `${judge.firstName} ${judge.lastName}`;
    }
    if (judge.name) return judge.name;
    return 'Unknown Judge';
  };

  const getAssignedJudges = (project: Project): any[] => {
    if (!project.assignedJudges || project.assignedJudges.length === 0) return [];
    return project.assignedJudges;
  };

  const getUnassignedJudges = (): User[] => {
    const assignedJudgeIds = new Set<string>();
    projects.forEach(project => {
      if (project.assignedJudges) {
        project.assignedJudges.forEach(judge => {
          const judgeId = typeof judge === 'string' ? judge : (judge as any)._id || (judge as any).id;
          if (judgeId) assignedJudgeIds.add(judgeId);
        });
      }
    });
    
    return judges.filter(judge => {
      const judgeId = judge._id || judge.id;
      return judgeId ? !assignedJudgeIds.has(judgeId) : false;
    });
  };

  const handleAddCriterion = () => {
    if (newCriterion.name && newCriterion.weight > 0) {
      setRubricCriteria([...rubricCriteria, newCriterion]);
      setNewCriterion({ name: '', weight: 0, maxScore: 10 });
    }
  };

  const handleRemoveCriterion = (index: number) => {
    setRubricCriteria(rubricCriteria.filter((_, i) => i !== index));
  };

  const handleSaveRubric = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Convert frontend rubric criteria to backend format
      // The backend expects: inspiration, techStack, design, growthPotential, presentation
      const globalRubric: any = {
        inspiration: { name: 'Inspiration', weight: 0.2, enabled: true },
        techStack: { name: 'Tech Stack', weight: 0.2, enabled: true },
        design: { name: 'Design', weight: 0.2, enabled: true },
        growthPotential: { name: 'Growth Potential', weight: 0.2, enabled: true },
        presentation: { name: 'Presentation', weight: 0.2, enabled: true },
      };
      
      // Map frontend criteria to backend keys based on name matching
      rubricCriteria.forEach(criterion => {
        const nameLower = criterion.name.toLowerCase();
        const weight = criterion.weight / 100; // Convert percentage to decimal
        
        if (nameLower.includes('inspiration') || nameLower.includes('innovation')) {
          globalRubric.inspiration = {
            name: criterion.name,
            weight: weight,
            enabled: true
          };
        } else if (nameLower.includes('tech') || nameLower.includes('technical')) {
          globalRubric.techStack = {
            name: criterion.name,
            weight: weight,
            enabled: true
          };
        } else if (nameLower.includes('design')) {
          globalRubric.design = {
            name: criterion.name,
            weight: weight,
            enabled: true
          };
        } else if (nameLower.includes('growth') || nameLower.includes('social') || nameLower.includes('impact')) {
          globalRubric.growthPotential = {
            name: criterion.name,
            weight: weight,
            enabled: true
          };
        } else if (nameLower.includes('presentation')) {
          globalRubric.presentation = {
            name: criterion.name,
            weight: weight,
            enabled: true
          };
        }
      });
      
      // Normalize weights to sum to 1.0
      const totalWeight = Object.values(globalRubric).reduce((sum: number, r: any) => sum + (r.weight || 0), 0);
      if (totalWeight > 0) {
        Object.keys(globalRubric).forEach(key => {
          globalRubric[key].weight = globalRubric[key].weight / totalWeight;
        });
      }
      
      await rubricAPI.updateGlobalRubric(globalRubric);
      await fetchRubric(); // Refresh to show updated rubric
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save rubric. Please try again.');
      console.error('Error saving rubric:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = rubricCriteria.reduce((sum, c) => sum + c.weight, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
        <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
          <p style={{ fontFamily: 'Georgia, serif', color: '#333' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !projects.length && !judges.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#d4a5a5' }}>
        <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
          <p style={{ fontFamily: 'Georgia, serif', color: '#dc2626' }}>{error}</p>
          <button
            onClick={fetchData}
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
          Admin Dashboard
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
            Projects
          </button>
          <button
            onClick={() => setActiveTab('judges')}
            className="px-6 py-3 rounded-md transition hover:opacity-90"
            style={{
              backgroundColor: activeTab === 'judges' ? '#c89999' : 'white',
              color: activeTab === 'judges' ? 'white' : '#333',
              border: '2px solid #000',
              fontFamily: 'Georgia, serif',
              fontWeight: '600'
            }}
          >
            <Users className="inline w-5 h-5 mr-2" />
            Judges
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className="px-6 py-3 rounded-md transition hover:opacity-90"
            style={{
              backgroundColor: activeTab === 'rubric' ? '#c89999' : 'white',
              color: activeTab === 'rubric' ? 'white' : '#333',
              border: '2px solid #000',
              fontFamily: 'Georgia, serif',
              fontWeight: '600'
            }}
          >
            <Award className="inline w-5 h-5 mr-2" />
            Rubric
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className="px-6 py-3 rounded-md transition hover:opacity-90"
            style={{
              backgroundColor: activeTab === 'scores' ? '#c89999' : 'white',
              color: activeTab === 'scores' ? 'white' : '#333',
              border: '2px solid #000',
              fontFamily: 'Georgia, serif',
              fontWeight: '600'
            }}
          >
            <BarChart3 className="inline w-5 h-5 mr-2" />
            Scores
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
            {projects.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
                <p style={{ fontFamily: 'Georgia, serif', color: '#666' }}>No projects found.</p>
              </div>
            ) : (
              projects.map(project => {
                const assignedJudges = getAssignedJudges(project);
                return (
                  <div key={project._id} className="bg-white rounded-lg p-6 relative" style={{ border: '3px solid #000' }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="mb-1" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                          {project.name}
                        </h3>
                        <span 
                          className="inline-block px-3 py-1 rounded text-sm"
                          style={{ backgroundColor: '#f0f0f0', fontFamily: 'Georgia, serif', color: '#666' }}
                        >
                          {project.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: '#666' }}>
                        <Users className="w-5 h-5" />
                        <span style={{ fontFamily: 'Georgia, serif' }}>{assignedJudges.length} Judge{assignedJudges.length !== 1 ? 's' : ''}</span>
                      </div>
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
                      <div className="flex justify-between items-center mb-3">
                        <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontWeight: '600' }}>
                          Assigned Judges
                        </p>
                        {editingProject !== project._id ? (
                          <button
                            onClick={() => {
                              setEditingProject(project._id);
                              const currentJudgeIds = new Set(
                                assignedJudges.map(j => {
                                  const judgeId = typeof j === 'string' ? j : (j as any)._id;
                                  return judgeId;
                                })
                              );
                              setSelectedJudges(currentJudgeIds);
                            }}
                            className="flex items-center gap-1 px-3 py-1 rounded-md transition hover:opacity-90"
                            style={{
                              backgroundColor: '#c89999',
                              color: 'white',
                              border: '2px solid #000',
                              fontFamily: 'Georgia, serif',
                              fontSize: '0.875rem',
                              fontWeight: '600'
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit Judges
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  setSavingAssignment(true);
                                  const judgeIds = Array.from(selectedJudges);
                                  await projectsAPI.update(project._id, { assignedJudges: judgeIds as unknown as any });
                                  await fetchData();
                                  setEditingProject(null);
                                  setSelectedJudges(new Set());
                                } catch (err: any) {
                                  setError(err.response?.data?.message || 'Failed to update judge assignments');
                                } finally {
                                  setSavingAssignment(false);
                                }
                              }}
                              disabled={savingAssignment}
                              className="flex items-center gap-1 px-3 py-1 rounded-md transition hover:opacity-90 disabled:opacity-50"
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: '2px solid #000',
                                fontFamily: 'Georgia, serif',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                              }}
                            >
                              <Check className="w-4 h-4" />
                              {savingAssignment ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => {
                                setEditingProject(null);
                                setSelectedJudges(new Set());
                              }}
                              className="px-3 py-1 rounded-md transition hover:opacity-90"
                              style={{
                                backgroundColor: 'white',
                                color: '#333',
                                border: '2px solid #000',
                                fontFamily: 'Georgia, serif',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      {editingProject === project._id ? (
                        <div className="space-y-2">
                          <p className="text-sm mb-2" style={{ fontFamily: 'Georgia, serif', color: '#666' }}>
                            Select judges to assign to this project:
                          </p>
                          <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-md" style={{ backgroundColor: '#f9f9f9', border: '2px solid #e5e5e5' }}>
                            {judges.map(judge => {
                              const judgeId = judge._id || judge.id;
                              if (!judgeId) return null;
                              const isSelected = selectedJudges.has(judgeId);
                              const judgeName = `${judge.firstName || ''} ${judge.lastName || ''}`.trim() || judge.email;
                              return (
                                <label
                                  key={judgeId}
                                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer transition hover:bg-white"
                                  style={{ border: isSelected ? '2px solid #c89999' : '2px solid #e5e5e5' }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const newSelected = new Set(selectedJudges);
                                      if (e.target.checked) {
                                        newSelected.add(judgeId);
                                      } else {
                                        newSelected.delete(judgeId);
                                      }
                                      setSelectedJudges(newSelected);
                                    }}
                                    className="w-5 h-5"
                                    style={{ accentColor: '#c89999' }}
                                  />
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                                    style={{ backgroundColor: '#c89999', fontFamily: 'Georgia, serif', fontWeight: '600' }}
                                  >
                                    {getInitials(judgeName)}
                                  </div>
                                  <div>
                                    <span style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                      {judgeName}
                                    </span>
                                    {judge.specialty && (
                                      <p className="text-xs" style={{ fontFamily: 'Georgia, serif', color: '#666' }}>
                                        {judge.specialty}
                                      </p>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        assignedJudges.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {assignedJudges.map((judge, idx) => {
                              const judgeName = getJudgeName(judge);
                              return (
                                <div key={idx} className="flex items-center gap-2">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                    style={{ backgroundColor: '#c89999', fontFamily: 'Georgia, serif', fontWeight: '600' }}
                                  >
                                    {getInitials(judgeName)}
                                  </div>
                                  <span style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                                    {judgeName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontStyle: 'italic' }}>
                            No judges assigned yet
                          </p>
                        )
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {/* Auto-assign button */}
            <div className="mt-4">
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    await assignmentsAPI.autoAssign();
                    await fetchData();
                    setError('');
                  } catch (err: any) {
                    setError(err.response?.data?.message || 'Failed to auto-assign judges');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-3 rounded-md transition hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: '#c89999',
                  color: 'white',
                  border: '2px solid #000',
                  fontFamily: 'Georgia, serif',
                  fontWeight: '600'
                }}
              >
                Auto-Assign Judges to Unassigned Projects
              </button>
            </div>
          </div>
        )}

        {/* Judges Tab */}
        {activeTab === 'judges' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Assigned Judges */}
            <div className="bg-white rounded-lg p-6" style={{ border: '3px solid #000' }}>
              <h3 className="mb-4" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                Assigned Judges
              </h3>
              <div className="space-y-3">
                {judges.filter(j => {
                  return projects.some(p => {
                    const assigned = getAssignedJudges(p);
                    return assigned.some(a => {
                      const judgeId = typeof a === 'string' ? a : a._id;
                      return judgeId === j._id;
                    });
                  });
                }).map(judge => (
                  <div 
                    key={judge._id}
                    className="flex items-center gap-3 p-3 rounded-md"
                    style={{ backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5' }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: '#c89999', fontFamily: 'Georgia, serif', fontWeight: '600' }}
                    >
                      {judge.initials || getInitials(`${judge.firstName || ''} ${judge.lastName || ''}`)}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                        {judge.firstName && judge.lastName ? `${judge.firstName} ${judge.lastName}` : 'Unknown Judge'}
                      </p>
                      <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                        {judge.specialty || 'No specialty'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unassigned Judges */}
            <div className="bg-white rounded-lg p-6" style={{ border: '3px solid #000' }}>
              <h3 className="mb-4" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                Unassigned Judges
                <span className="ml-2" style={{ color: '#666', fontSize: '0.875rem' }}>
                  ({getUnassignedJudges().length} available)
                </span>
              </h3>
              <div className="space-y-3">
                {getUnassignedJudges().length === 0 ? (
                  <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontStyle: 'italic' }}>
                    All judges are assigned
                  </p>
                ) : (
                  getUnassignedJudges().map(judge => (
                    <div 
                      key={judge._id}
                      className="flex items-center gap-3 p-3 rounded-md"
                      style={{ backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5' }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: '#999', fontFamily: 'Georgia, serif', fontWeight: '600' }}
                      >
                        {judge.initials || getInitials(`${judge.firstName || ''} ${judge.lastName || ''}`)}
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                          {judge.firstName && judge.lastName ? `${judge.firstName} ${judge.lastName}` : 'Unknown Judge'}
                        </p>
                        <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                          {judge.specialty || 'No specialty'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rubric Tab */}
        {activeTab === 'rubric' && (
          <div className="bg-white rounded-lg p-8 relative" style={{ border: '3px solid #000' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                Scoring Rubric
              </h3>
              <button
                onClick={handleSaveRubric}
                disabled={loading || totalWeight !== 100}
                className="px-6 py-2 rounded-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: totalWeight === 100 ? '#10b981' : '#999',
                  color: 'white',
                  border: '2px solid #000',
                  fontFamily: 'Georgia, serif',
                  fontWeight: '600'
                }}
              >
                Save Rubric
              </button>
            </div>
            
            <p className="mb-4 text-sm" style={{ fontFamily: 'Georgia, serif', color: '#666', fontStyle: 'italic' }}>
              This is the rubric that judges use when scoring projects. Changes will apply to all future scoring.
            </p>

            {/* Current Criteria */}
            <div className="space-y-4 mb-6">
              {rubricCriteria.map((criterion, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-md"
                  style={{ backgroundColor: '#f9f9f9', border: '2px solid #e5e5e5' }}
                >
                  <div className="flex-1">
                    <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                      {criterion.name}
                    </p>
                    <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                      Weight: {criterion.weight}% | Max Score: {criterion.maxScore}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveCriterion(idx)}
                    className="p-2 rounded-md transition hover:opacity-70"
                    style={{ color: '#dc2626' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Weight Indicator */}
            <div className="mb-6 p-4 rounded-md" style={{ backgroundColor: totalWeight === 100 ? '#d1fae5' : '#fee2e2', border: '2px solid #000' }}>
              <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                Total Weight: {totalWeight}%
              </p>
              {totalWeight !== 100 && (
                <p style={{ fontFamily: 'Georgia, serif', color: '#dc2626', fontSize: '0.875rem' }}>
                  Total weight must equal 100%
                </p>
              )}
            </div>

            {/* Add New Criterion */}
            <div className="p-6 rounded-md mb-6" style={{ backgroundColor: '#f9f9f9', border: '2px solid #000' }}>
              <h4 className="mb-4" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                Add New Criterion
              </h4>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333', fontSize: '0.875rem' }}>
                    Criterion Name
                  </label>
                  <input
                    type="text"
                    value={newCriterion.name}
                    onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
                    placeholder="e.g., Innovation"
                    className="w-full px-3 py-2 rounded-md focus:outline-none"
                    style={{ border: '2px solid #000', fontFamily: 'Georgia, serif' }}
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333', fontSize: '0.875rem' }}>
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    value={newCriterion.weight || ''}
                    onChange={(e) => setNewCriterion({ ...newCriterion, weight: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 rounded-md focus:outline-none"
                    style={{ border: '2px solid #000', fontFamily: 'Georgia, serif' }}
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ fontFamily: 'Georgia, serif', color: '#333', fontSize: '0.875rem' }}>
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={newCriterion.maxScore}
                    onChange={(e) => setNewCriterion({ ...newCriterion, maxScore: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                    min="1"
                    className="w-full px-3 py-2 rounded-md focus:outline-none"
                    style={{ border: '2px solid #000', fontFamily: 'Georgia, serif' }}
                  />
                </div>
              </div>
              <button
                onClick={handleAddCriterion}
                disabled={!newCriterion.name || newCriterion.weight <= 0}
                className="w-full py-3 rounded-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#c89999',
                  color: '#fff',
                  border: '2px solid #000',
                  fontFamily: 'Georgia, serif',
                  fontWeight: '600'
                }}
              >
                <Plus className="inline w-5 h-5 mr-2" />
                Add Criterion
              </button>
            </div>
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
                <p style={{ fontFamily: 'Georgia, serif', color: '#666' }}>No projects found.</p>
              </div>
            ) : (
              projects.map(project => {
                const scores = projectScores[project._id] || [];
                const averageScore = scores.length > 0 
                  ? (scores.reduce((sum, s) => sum + (s.totalScore || 0), 0) / scores.length).toFixed(2)
                  : 'N/A';

                return (
                  <div key={project._id} className="bg-white rounded-lg p-6 relative" style={{ border: '3px solid #000' }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="mb-1" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                          {project.name}
                        </h3>
                        <span 
                          className="inline-block px-3 py-1 rounded text-sm"
                          style={{ backgroundColor: '#f0f0f0', fontFamily: 'Georgia, serif', color: '#666' }}
                        >
                          {project.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                          Average Score
                        </p>
                        <p style={{ fontFamily: 'Georgia, serif', color: '#c89999', fontSize: '2rem', fontWeight: '700' }}>
                          {averageScore}
                        </p>
                        <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>
                          {scores.length} judge{scores.length !== 1 ? 's' : ''} scored
                        </p>
                      </div>
                    </div>

                    {scores.length > 0 ? (
                      <div className="space-y-4">
                        {scores.map((score) => {
                          const judge = typeof score.judgeId === 'object' ? score.judgeId : 
                            judges.find(j => (j._id || j.id) === score.judgeId);
                          const judgeName = judge 
                            ? `${judge.firstName || ''} ${judge.lastName || ''}`.trim() || judge.email
                            : 'Unknown Judge';
                          const rubricScores = score.rubricScores || {};
                          
                          return (
                            <div 
                              key={score._id}
                              className="p-4 rounded-md"
                              style={{ backgroundColor: '#f9f9f9', border: '2px solid #e5e5e5' }}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                  style={{ backgroundColor: '#c89999', fontFamily: 'Georgia, serif', fontWeight: '600' }}
                                >
                                  {getInitials(judgeName)}
                                </div>
                                <div>
                                  <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                    {judgeName}
                                  </p>
                                  <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                                    Total: {score.totalScore?.toFixed(2) || '0.00'}/10
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {rubricScores.techStack && (
                                  <div>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>
                                      Tech Stack
                                    </p>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                      {rubricScores.techStack.score}/10
                                    </p>
                                  </div>
                                )}
                                {rubricScores.design && (
                                  <div>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>
                                      Design
                                    </p>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                      {rubricScores.design.score}/10
                                    </p>
                                  </div>
                                )}
                                {rubricScores.growthPotential && (
                                  <div>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>
                                      Growth Potential
                                    </p>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                      {rubricScores.growthPotential.score}/10
                                    </p>
                                  </div>
                                )}
                                {rubricScores.presentation && (
                                  <div>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>
                                      Presentation
                                    </p>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                      {rubricScores.presentation.score}/10
                                    </p>
                                  </div>
                                )}
                                {rubricScores.inspiration && (
                                  <div>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>
                                      Inspiration
                                    </p>
                                    <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                      {rubricScores.inspiration.score}/10
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontStyle: 'italic' }}>
                        No scores submitted yet
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center" style={{ border: '3px solid #000' }}>
                <p style={{ fontFamily: 'Georgia, serif', color: '#666' }}>No projects found.</p>
              </div>
            ) : (
              projects.map(project => {
                const scores = projectScores[project._id] || [];
                const comments = scores.filter(s => s.feedback && s.feedback.trim().length > 0);

                return (
                  <div key={project._id} className="bg-white rounded-lg p-6 relative" style={{ border: '3px solid #000' }}>
                    <div className="mb-4">
                      <h3 className="mb-1" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
                        {project.name}
                      </h3>
                      <span 
                        className="inline-block px-3 py-1 rounded text-sm"
                        style={{ backgroundColor: '#f0f0f0', fontFamily: 'Georgia, serif', color: '#666' }}
                      >
                        {project.category}
                      </span>
                    </div>

                    {comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((score) => {
                          const judge = typeof score.judgeId === 'object' ? score.judgeId : 
                            judges.find(j => (j._id || j.id) === score.judgeId);
                          const judgeName = judge 
                            ? `${judge.firstName || ''} ${judge.lastName || ''}`.trim() || judge.email
                            : 'Unknown Judge';
                          
                          return (
                            <div 
                              key={score._id}
                              className="p-4 rounded-md"
                              style={{ backgroundColor: '#f9f9f9', border: '2px solid #c89999' }}
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                  style={{ backgroundColor: '#c89999', fontFamily: 'Georgia, serif', fontWeight: '600' }}
                                >
                                  {getInitials(judgeName)}
                                </div>
                                <div className="flex-1">
                                  <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                    {judgeName}
                                  </p>
                                  <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.875rem' }}>
                                    Judge
                                  </p>
                                </div>
                                {score.createdAt && (
                                  <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem' }}>
                                    {new Date(score.createdAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <p style={{ fontFamily: 'Georgia, serif', color: '#333', whiteSpace: 'pre-wrap' }}>
                                {score.feedback}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontStyle: 'italic' }}>
                        No comments submitted yet
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
