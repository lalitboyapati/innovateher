import React from 'react';
import { Judge } from '../types';

interface JudgeCardProps {
  judge: Judge;
  onClick?: () => void;
  isDragging?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const JudgeCard: React.FC<JudgeCardProps> = ({ 
  judge, 
  onClick, 
  isDragging,
  className = '',
  style
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 
        cursor-pointer hover:shadow-md transition-shadow
        ${isDragging ? 'opacity-50' : ''}
        ${className}
      `}
    >
      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold flex-shrink-0">
        {judge.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900">{judge.name}</div>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
          {judge.specialty}
        </div>
      </div>
    </div>
  );
};

