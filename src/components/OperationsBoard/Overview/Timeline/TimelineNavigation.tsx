
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';

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
    <div className="flex gap-2" role="group" aria-label="التنقل في الخط الزمني">
      <AccessibleButton
        variant="ghost"
        size="sm"
        onClick={onScrollRight}
        disabled={!canScrollRight}
        aria-label="الانتقال إلى الأحداث التالية"
        className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30"
      >
        <ChevronRight className="w-5 h-5" />
      </AccessibleButton>
      
      <AccessibleButton
        variant="ghost"
        size="sm"
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        aria-label="الانتقال إلى الأحداث السابقة"
        className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30"
      >
        <ChevronLeft className="w-5 h-5" />
      </AccessibleButton>
    </div>
  );
};
