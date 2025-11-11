import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Project, Judge } from '../types';
import { DraggableJudgeCard } from './DraggableJudgeCard';

interface ProjectCardProps {
  project: Project;
  onJudgeClick?: (judge: Judge) => void;
  onRemoveJudge?: (projectId: string, judgeId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onJudgeClick, onRemoveJudge }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: project._id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white rounded-lg p-6 border border-gray-200 shadow-sm transition-colors
        ${isOver ? 'bg-blue-50 border-blue-300' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
          <span className="inline-block text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
            {project.category}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-sm font-medium">
            {project.assignedJudges.length} {project.assignedJudges.length === 1 ? 'Judge' : 'Judges'}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{project.description}</p>
      
      {project.assignedJudges.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Assigned Judges</div>
          <div className="space-y-2">
            {project.assignedJudges.map((judge) => (
              <div
                key={judge._id}
                className="flex items-center gap-2 group"
              >
                <div className="flex-1">
                  <DraggableJudgeCard
                    judge={judge}
                    onClick={() => onJudgeClick?.(judge)}
                  />
                </div>
                {onRemoveJudge && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveJudge(project._id, judge._id);
                    }}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Remove judge"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

