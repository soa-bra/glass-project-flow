import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { SoaIcon } from './SoaIcon';

interface ProgressTapeProps {
  totalTicks?: number;
  completedTicks?: number;
  milestones?: Array<{
    position: number; // 0-100 percentage
    icon: LucideIcon;
    label: string;
    completed: boolean;
  }>;
  className?: string;
}

export const SoaProgressTape: React.FC<ProgressTapeProps> = ({
  totalTicks = 72,
  completedTicks = 0,
  milestones = [],
  className = ''
}) => {
  const completionPercentage = Math.min((completedTicks / totalTicks) * 100, 100);
  
  return (
    <div className={cn('relative', className)}>
      {/* Progress Tape */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalTicks }).map((_, index) => {
          const isCompleted = index < completedTicks;
          return (
            <div
              key={index}
              className={cn(
                'h-1.5 w-1.5 rounded-sm transition-colors duration-200',
                isCompleted 
                  ? 'bg-soabra-accent-green/90' 
                  : 'bg-soabra-ink/10'
              )}
            />
          );
        })}
      </div>
      
      {/* Milestones */}
      {milestones.map((milestone, index) => {
        const leftPosition = `${milestone.position}%`;
        
        return (
          <div
            key={index}
            className="absolute top-4 transform -translate-x-1/2"
            style={{ left: leftPosition }}
          >
            <div className={cn(
              'w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors duration-200',
              milestone.completed
                ? 'bg-soabra-panel/95 border-soabra-accent-green'
                : 'bg-soabra-panel/95 border-soabra-border'
            )}>
              <SoaIcon 
                icon={milestone.icon} 
                size="sm"
                className={cn(
                  milestone.completed 
                    ? 'text-soabra-accent-green' 
                    : 'text-soabra-ink'
                )}
              />
            </div>
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-label text-soabra-ink-60">{milestone.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};