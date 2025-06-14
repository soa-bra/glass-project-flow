
import React from 'react';
import { TimelineWidgetProps, TimelineEvent } from './Timeline/types';
import { TimelineNavigation } from './Timeline/TimelineNavigation';
import { TimelineScrollContainer } from './Timeline/TimelineScrollContainer';
import { useTimelineScroll } from './Timeline/useTimelineScroll';

export const TimelineWidget: React.FC<TimelineWidgetProps> = ({
  timeline,
  className = ''
}) => {
  const {
    canScrollLeft,
    canScrollRight,
    scroll
  } = useTimelineScroll();

  const onEventClick = (event: TimelineEvent) => {
    // Placeholder: implement modal if needed
    console.log('فتح الحدث:', event);
  };

  // Progress indicator - percentage of events done
  const total = timeline.length;
  const doneCount = timeline.filter(e => e.color === 'bg-gray-300').length;
  const progress = total > 0 ? Math.round((doneCount/total) * 100) : 0;

  return (
    <div className={`
      ${className}
      glass-enhanced font-arabic
      shadow-xl flex flex-col overflow-hidden
      min-h-[220px] rounded-[26px] border border-white/50
      transition-all duration-300
    `}>
      {/* Header with bold font and progress */}
      <header className="flex flex-col md:flex-row items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-4 w-full md:w-auto mb-3 md:mb-0">
          <h3 className="font-arabic text-2xl md:text-xl font-bold text-gray-800 select-none whitespace-nowrap tracking-tight">
            الأحداث القادمة
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-gray-500">
              {doneCount}/{total}
            </span>
            <span className="relative flex items-center w-16 h-3 bg-gray-200/40 rounded-full overflow-hidden">
              <span
                className="absolute left-0 top-0 h-3 bg-gradient-to-l from-soabra-primary-blue/70 to-soabra-primary-blue rounded-full transition-all duration-200"
                style={{width: `${progress}%`}}
              />
            </span>
          </div>
        </div>
        <TimelineNavigation 
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scroll(-220)}
          onScrollRight={() => scroll(220)}
        />
      </header>
      {/* Content */}
      <div className="flex-1 relative min-h-0">
        <TimelineScrollContainer timeline={timeline} onEventClick={onEventClick} />
      </div>
    </div>
  );
};
