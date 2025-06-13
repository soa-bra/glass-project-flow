
import React from 'react';
import { TimelineEvent } from '@/types';
import { TimelineContainer } from './TimelineContainer';

interface TimelineScrollContainerProps {
  timeline: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
}

export const TimelineScrollContainer: React.FC<TimelineScrollContainerProps> = ({
  timeline,
  onEventClick
}) => {
  return (
    <div className="w-full h-full">
      <TimelineContainer 
        timeline={timeline} 
        onEventClick={onEventClick} 
      />
    </div>
  );
};
