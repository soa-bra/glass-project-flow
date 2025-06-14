
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
    <div className="flex gap-2 items-center">
      <button
        onClick={onScrollRight}
        disabled={!canScrollRight}
        className={`
          w-9 h-9 p-0 rounded-full flex items-center justify-center transition-all duration-300
          border border-white/25 bg-white/65 text-gray-600 hover:bg-white/90
          hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
          ${!canScrollRight ? 'opacity-40 cursor-not-allowed' : ''}
        `}
        aria-label="الى الأمام"
      >
        <ChevronRight size={19} />
      </button>
      <button
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        className={`
          w-9 h-9 p-0 rounded-full flex items-center justify-center transition-all duration-300
          border border-white/25 bg-white/65 text-gray-600 hover:bg-white/90
          hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
          ${!canScrollLeft ? 'opacity-40 cursor-not-allowed' : ''}
        `}
        aria-label="الى الخلف"
      >
        <ChevronLeft size={19} />
      </button>
    </div>
  );
};
