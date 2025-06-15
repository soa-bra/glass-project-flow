
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const PerformanceChartWidget = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
        <GenericCard adminBoardStyle className="h-full">
            <h3 className="text-xl font-bold">مقياس الأداء</h3>
            <p className="mt-4 text-sm">سيتم إضافة المحتوى لاحقاً...</p>
        </GenericCard>
    </div>
  );
};
