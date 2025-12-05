import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ProjectCard } from './ProjectCard';
import { UnassignedJudgesPanel } from './UnassignedJudgesPanel';
import { QuickActionsPanel } from './QuickActionsPanel';
import { JudgeCard } from './JudgeCard';
import { AddJudgeModal } from './AddJudgeModal';
import { AddProjectModal } from './AddProjectModal';
import { UserManagement } from './UserManagement';
import { Project, Judge } from '../types';
import { projectsAPI, judgesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [unassignedJudges, setUnassignedJudges] = useState<Judge[]>([]);
  const [activeJudge, setActiveJudge] = useState<Judge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddJudgeModalOpen, setIsAddJudgeModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch data on component mount
  React.useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchData();
    }
  }, [activeTab]);

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

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Manage projects, judges, and users</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {activeTab === 'dashboard' ? (
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
          ) : (
            <div>
              {user ? (
                <UserManagement currentUser={user} />
              ) : (
                <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                  <p className="text-gray-500">Please log in to manage users.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <DragOverlay>
          {activeJudge ? (
            <div className="w-64 opacity-90">
              <JudgeCard judge={activeJudge} isDragging={true} />
            </div>
          ) : null}
        </DragOverlay>

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
      </div>
    </DndContext>
  );
};