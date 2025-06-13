
import React from 'react';
import { cn } from '@/lib/utils';
import { TimelineWidgetProps, TimelineEvent } from './Timeline/types';
import { TimelineNavigation } from './Timeline/TimelineNavigation';
import { TimelineContainer } from './Timeline/TimelineContainer';
import { useTimelineScroll } from './Timeline/useTimelineScroll';
import { useMemoizedCallback } from '@/utils/memoization';

export const TimelineWidget: React.FC<TimelineWidgetProps> = React.memo(({
  timeline,
  className = ''
}) => {
  const {
    canScrollLeft,
    canScrollRight,
    scroll
  } = useTimelineScroll();

  const openEvent = useMemoizedCallback((event: TimelineEvent) => {
    // يمكن إضافة modal أو popover هنا
    console.log('فتح الحدث:', event);
  }, []);

  const handleScrollLeft = useMemoizedCallback(() => scroll(-200), [scroll]);
  const handleScrollRight = useMemoizedCallback(() => scroll(200), [scroll]);

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
        <TimelineContainer 
          timeline={timeline} 
          onEventClick={openEvent} 
        />
      </div>
    </div>
  );
});

TimelineWidget.displayName = 'TimelineWidget';
