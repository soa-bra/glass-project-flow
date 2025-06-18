
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

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
      <CircularIconButton 
        icon={ChevronRight}
        onClick={onScrollRight}
        disabled={!canScrollRight}
        variant={canScrollRight ? 'default' : 'subtle'}
      />
      <CircularIconButton 
        icon={ChevronLeft}
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        variant={canScrollLeft ? 'default' : 'subtle'}
      />
    </div>
  );
};
