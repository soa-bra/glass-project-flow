
import React from 'react';
import { cn } from '@/lib/utils';
import { TimelineWidgetProps, TimelineEvent } from './Timeline/types';
import { TimelineNavigation } from './Timeline/TimelineNavigation';
import { TimelineScrollContainer } from './Timeline/TimelineScrollContainer';
import { useTimelineScroll } from './Timeline/useTimelineScroll';

export const TimelineWidget: React.FC<TimelineWidgetProps> = React.memo(({
  timeline,
  className = ''
}) => {
  const {
    canScrollLeft,
    canScrollRight,
    scroll
  } = useTimelineScroll();

  const openEvent = React.useCallback((event: TimelineEvent) => {
    // يمكن إضافة modal أو popover هنا
  }, []);

  const handleScrollLeft = React.useCallback(() => scroll(-200), [scroll]);
  const handleScrollRight = React.useCallback(() => scroll(200), [scroll]);

  return (
    <div 
      className={cn(
        className,
        'theme-glass-light rounded-3xl p-6',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        'flex flex-col font-arabic overflow-hidden min-h-[320px]'
      )}
      role="region"
      aria-label="الأحداث القادمة"
    >
      <header className="flex items-center justify-between mb-5">
        <h3 
          className="text-xl font-arabic font-bold text-high-contrast"
          id="timeline-heading"
        >
          الأحداث القادمة
        </h3>
        
        <TimelineNavigation 
          canScrollLeft={canScrollLeft} 
          canScrollRight={canScrollRight} 
          onScrollLeft={handleScrollLeft} 
          onScrollRight={handleScrollRight} 
        />
      </header>

      <div 
        className="flex-1 relative min-h-0 py-[35px]"
        aria-labelledby="timeline-heading"
      >
        <TimelineScrollContainer 
          timeline={timeline} 
          onEventClick={openEvent} 
        />
      </div>
    </div>
  );
});

TimelineWidget.displayName = 'TimelineWidget';
