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
  return <div className="flex gap-2 rounded-full my-0 py-0">
      <button onClick={onScrollRight} disabled={!canScrollRight} className={`
          p-3 rounded-xl transition-all duration-300 
          backdrop-blur-sm border border-white/40
          ${canScrollRight ? 'bg-white/60 hover:bg-white/80 text-gray-700 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md' : 'bg-white/25 text-gray-400 cursor-not-allowed opacity-50'}
        `}>
        <ChevronRight size={18} className="rounded-full" />
      </button>
      <button onClick={onScrollLeft} disabled={!canScrollLeft} className={`
          p-3 rounded-xl transition-all duration-300 
          backdrop-blur-sm border border-white/40
          ${canScrollLeft ? 'bg-white/60 hover:bg-white/80 text-gray-700 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md' : 'bg-white/25 text-gray-400 cursor-not-allowed opacity-50'}
        `}>
        <ChevronLeft size={18} />
      </button>
    </div>;
};