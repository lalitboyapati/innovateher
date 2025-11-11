import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Judge } from '../types';
import { JudgeCard } from './JudgeCard';

interface DraggableJudgeCardProps {
  judge: Judge;
  onClick?: () => void;
}

export const DraggableJudgeCard: React.FC<DraggableJudgeCardProps> = ({ 
  judge, 
  onClick
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: judge._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <JudgeCard
        judge={judge}
        onClick={onClick}
        isDragging={isDragging}
        className="cursor-grab active:cursor-grabbing"
        style={style}
      />
    </div>
  );
};

