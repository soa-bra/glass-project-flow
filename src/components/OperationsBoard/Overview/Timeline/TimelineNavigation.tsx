
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineNavigationProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export const TimelineNavigation: React.FC<TimelineNavigationProps> = ({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight
}) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={onScrollRight}
        disabled={!canScrollRight}
        className={`
          p-2.5 rounded-lg transition-all duration-300 
          backdrop-blur-sm border border-white/20
          ${canScrollRight 
            ? 'bg-white/50 hover:bg-white/70 text-gray-700 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md' 
            : 'bg-white/20 text-gray-400 cursor-not-allowed opacity-50'
          }
        `}
      >
        <ChevronRight size={16} />
      </button>
      <button 
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        className={`
          p-2.5 rounded-lg transition-all duration-300 
          backdrop-blur-sm border border-white/20
          ${canScrollLeft 
            ? 'bg-white/50 hover:bg-white/70 text-gray-700 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md' 
            : 'bg-white/20 text-gray-400 cursor-not-allowed opacity-50'
          }
        `}
      >
        <ChevronLeft size={16} />
      </button>
    </div>
  );
};
