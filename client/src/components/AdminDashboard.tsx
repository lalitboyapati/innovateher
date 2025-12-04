import { useState, useEffect } from 'react';
import { Users, ClipboardList, Award, BarChart3, Plus, X, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, judgesAPI } from '../services/api';
import { Project, User } from '../types';

type RubricCriterion = {
  name: string;
  weight: number;
  maxScore: number;
};

type Score = {
  projectId: string;
  judgeName: string;
  scores: Record<string, number>;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'judges' | 'rubric' | 'scores'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [judges, setJudges] = useState<User[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([
    { name: 'Innovation', weight: 30, maxScore: 10 },
    { name: 'Technical Implementation', weight: 30, maxScore: 10 },
    { name: 'Design & UX', weight: 20, maxScore: 10 },
    { name: 'Social Impact', weight: 20, maxScore: 10 }
  ]);
  const [newCriterion, setNewCriterion] = useState({ name: '', weight: 0, maxScore: 10 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [projectsData, judgesData] = await Promise.all([
        projectsAPI.getAll(),
        judgesAPI.getAll(),
      ]);
      setProjects(projectsData);
      setJudges(judgesData);
      
      // Fetch scores for all projects
      // TODO: Implement scores API endpoint
      
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
          const judgeId = typeof judge === 'string' ? judge : (judge as any)._id;
          if (judgeId) assignedJudgeIds.add(judgeId);
        });
      }
    });
    
    return judges.filter(judge => !assignedJudgeIds.has(judge._id));
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

  const totalWeight = rubricCriteria.reduce((sum, c) => sum + c.weight, 0);

  const calculateProjectScore = (projectId: string) => {
    const projectScores = scores.filter(s => s.projectId === projectId);
    if (projectScores.length === 0) return '0.00';

    const avgScores = rubricCriteria.map(criterion => {
      const criterionKey = criterion.name.toLowerCase().split(' ')[0];
      const sum = projectScores.reduce((acc, s) => {
        const score = s.scores[criterionKey] || 0;
        return acc + score;
      }, 0);
      return (sum / projectScores.length) * (criterion.weight / 100);
    });

    return avgScores.reduce((sum, score) => sum + score, 0).toFixed(2);
  };

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
                      <p className="mb-3" style={{ fontFamily: 'Georgia, serif', color: '#666', fontWeight: '600' }}>
                        Assigned Judges
                      </p>
                      {assignedJudges.length > 0 ? (
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
                      )}
                    </div>
                  </div>
                );
              })
            )}
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
            <h3 className="mb-6" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
              Scoring Rubric
            </h3>

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
                const projectScores = scores.filter(s => s.projectId === project._id);
                const finalScore = calculateProjectScore(project._id);

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
                          Final Score
                        </p>
                        <p style={{ fontFamily: 'Georgia, serif', color: '#c89999', fontSize: '2rem', fontWeight: '700' }}>
                          {finalScore}
                        </p>
                      </div>
                    </div>

                    {projectScores.length > 0 ? (
                      <div className="space-y-4">
                        {projectScores.map((score, idx) => (
                          <div 
                            key={idx}
                            className="p-4 rounded-md"
                            style={{ backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5' }}
                          >
                            <p className="mb-3" style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                              {score.judgeName}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(score.scores).map(([criterion, value]) => (
                                <div key={criterion}>
                                  <p style={{ fontFamily: 'Georgia, serif', color: '#666', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                                    {criterion}
                                  </p>
                                  <p style={{ fontFamily: 'Georgia, serif', color: '#333', fontWeight: '600' }}>
                                    {value}/10
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
      </div>
    </div>
  );
}
