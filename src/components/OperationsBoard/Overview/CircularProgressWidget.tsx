
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

interface CircularProgressWidgetProps {
  title: string;
  percentage: number;
  color: string;
  className?: string;
}

export const CircularProgressWidget: React.FC<CircularProgressWidgetProps> = ({
  title,
  percentage,
  color,
  className = ''
}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col items-center justify-center text-center`}
    >
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#23272f]">{percentage}%</span>
        </div>
      </div>
      <h4 className="text-sm font-arabic font-bold text-[#23272f]">{title}</h4>
    </GenericCard>
  );
};
