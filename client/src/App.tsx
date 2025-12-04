import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { LandingPage } from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ParticipantDashboard from './components/ParticipantDashboard';
import { ProjectCard } from './components/ProjectCard';
import { UnassignedJudgesPanel } from './components/UnassignedJudgesPanel';
import { QuickActionsPanel } from './components/QuickActionsPanel';
import { JudgeCard } from './components/JudgeCard';
import { AddJudgeModal } from './components/AddJudgeModal';
import { AddProjectModal } from './components/AddProjectModal';
import { Project, Judge } from './types';
import { projectsAPI, judgesAPI } from './services/api';

// Dashboard Component (existing App logic)
function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [unassignedJudges, setUnassignedJudges] = useState<Judge[]>([]);
  const [activeJudge, setActiveJudge] = useState<Judge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddJudgeModalOpen, setIsAddJudgeModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsData, judgesData] = await Promise.all([
        projectsAPI.getAll(),
        judgesAPI.getUnassigned(),
      ]);
      setProjects(projectsData);
      setUnassignedJudges(judgesData);
    } catch (err) {
      setError('Failed to load data. Please make sure the server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const judge = findJudge(active.id as string);
    if (judge) {
      setActiveJudge(judge);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJudge(null);

    if (!over) return;

    const judgeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on unassigned judges panel
    if (overId === 'unassigned-judges') {
      try {
        // Find which project the judge is assigned to
        const project = projects.find((p) =>
          p.assignedJudges.some((j) => j._id === judgeId)
        );
        if (project) {
          await removeJudgeFromProject(project._id, judgeId);
        }
      } catch (err) {
        console.error('Error removing judge:', err);
        setError('Failed to remove judge. Please try again.');
      }
      return;
    }

    // Check if dropping on a project
    const project = projects.find((p) => p._id === overId);
    if (project) {
      try {
        await assignJudgeToProject(judgeId, overId);
      } catch (err) {
        console.error('Error assigning judge:', err);
        setError('Failed to assign judge. Please try again.');
      }
    }
  };

  const findJudge = (judgeId: string): Judge | null => {
    // Check unassigned judges
    const unassigned = unassignedJudges.find((j) => j._id === judgeId);
    if (unassigned) return unassigned;

    // Check assigned judges
    for (const project of projects) {
      const judge = project.assignedJudges.find((j) => j._id === judgeId);
      if (judge) return judge;
    }

    return null;
  };

  const assignJudgeToProject = async (judgeId: string, projectId: string) => {
    try {
      setError(null);
      // Update project with assigned judge
      const updatedProject = await projectsAPI.assignJudge(projectId, judgeId);
      
      // Update local state
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );

      // Refresh unassigned judges
      const unassignedJudgesData = await judgesAPI.getUnassigned();
      setUnassignedJudges(unassignedJudgesData);
    } catch (error) {
      console.error('Error assigning judge to project:', error);
      throw error;
    }
  };

  const removeJudgeFromProject = async (projectId: string, judgeId: string) => {
    try {
      setError(null);
      // Remove judge from project via API
      const updatedProject = await projectsAPI.removeJudge(projectId, judgeId);
      
      // Update local state
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );

      // Refresh unassigned judges
      const unassignedJudgesData = await judgesAPI.getUnassigned();
      setUnassignedJudges(unassignedJudgesData);
    } catch (error) {
      console.error('Error removing judge from project:', error);
      setError('Failed to remove judge. Please try again.');
      throw error;
    }
  };

  const handleAddJudge = async (judgeData: Partial<Judge>) => {
    try {
      setError(null);
      await judgesAPI.create(judgeData);
      // Refresh unassigned judges to include the new one
      const unassignedJudgesData = await judgesAPI.getUnassigned();
      setUnassignedJudges(unassignedJudgesData);
      setIsAddJudgeModalOpen(false);
    } catch (error) {
      console.error('Error adding judge:', error);
      throw error;
    }
  };

  const handleAddProject = async (projectData: Partial<Project>) => {
    try {
      setError(null);
      const newProject = await projectsAPI.create(projectData);
      // Add new project to the list
      setProjects((prev) => [newProject, ...prev]);
      setIsAddProjectModalOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const handleJudgeClick = (judge: Judge) => {
    // Display judge profile information
    alert(`Judge Profile:\n\nName: ${judge.name}\nSpecialty: ${judge.specialty}\nInitials: ${judge.initials}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Hackathon Dashboard</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Projects */}
            <div className="lg:col-span-2 space-y-6">
              {projects.length === 0 ? (
                <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                  <p className="text-gray-500">No projects found. Create a project to get started.</p>
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onJudgeClick={handleJudgeClick}
                    onRemoveJudge={removeJudgeFromProject}
                  />
                ))
              )}
            </div>

            {/* Right Column - Judges and Quick Actions */}
            <div className="space-y-6">
              <UnassignedJudgesPanel
                judges={unassignedJudges}
                onJudgeClick={handleJudgeClick}
              />
              <QuickActionsPanel
                onAddJudge={() => setIsAddJudgeModalOpen(true)}
                onAddProject={() => setIsAddProjectModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeJudge ? (
            <div className="w-64 opacity-90">
              <JudgeCard judge={activeJudge} isDragging={true} />
            </div>
          ) : null}
        </DragOverlay>
      </div>

      {/* Modals */}
      <AddJudgeModal
        isOpen={isAddJudgeModalOpen}
        onClose={() => setIsAddJudgeModalOpen(false)}
        onAdd={handleAddJudge}
      />
      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onAdd={handleAddProject}
      />
    </DndContext>
  );
}

// Main App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/judge" element={<Dashboard />} />
        <Route path="/participant" element={<ParticipantDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
