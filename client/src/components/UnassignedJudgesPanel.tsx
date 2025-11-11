import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Judge } from '../types';
import { DraggableJudgeCard } from './DraggableJudgeCard';

interface UnassignedJudgesPanelProps {
  judges: Judge[];
  onJudgeClick?: (judge: Judge) => void;
}

export const UnassignedJudgesPanel: React.FC<UnassignedJudgesPanelProps> = ({
  judges,
  onJudgeClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned-judges',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white rounded-lg p-6 border border-gray-200 shadow-sm transition-colors
        ${isOver ? 'bg-green-50 border-green-300' : ''}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">Unassigned Judges</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">{judges.length} available</p>
      {isOver && (
        <div className="mb-2 text-sm text-green-600 font-medium">
          Drop here to unassign
        </div>
      )}
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {judges.map((judge) => (
          <DraggableJudgeCard
            key={judge._id}
            judge={judge}
            onClick={() => onJudgeClick?.(judge)}
          />
        ))}
        {judges.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No unassigned judges. Drag judges here to unassign them.
          </p>
        )}
      </div>
    </div>
  );
};

