
import React from 'react';
import { TimelineEvent } from '@/types';
import { TimelineEventItem } from './TimelineEventItem';
import { useMemoizedData, optimizeListData } from '@/utils/memoization';

interface TimelineContainerProps {
  timeline: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
}

export const TimelineContainer: React.FC<TimelineContainerProps> = React.memo(({
  timeline,
  onEventClick
}) => {
  const optimizedTimeline = useMemoizedData(
    optimizeListData(timeline),
    [timeline]
  );

  return (
    <div className="relative w-full h-full">
      {/* الخط الأفقي الرئيسي */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 transform -translate-y-1/2" />
      
      {/* الأحداث */}
      <div className="flex items-center h-full overflow-x-auto overflow-y-hidden gap-12 px-6">
        {optimizedTimeline.map((event) => (
          <TimelineEventItem
            key={event.id}
            event={event}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
});

TimelineContainer.displayName = 'TimelineContainer';
