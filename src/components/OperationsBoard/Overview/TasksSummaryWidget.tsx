
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const TasksSummaryWidget = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <GenericCard adminBoardStyle className="h-full">
        <h3 className="text-xl font-bold">ملخّص المهام</h3>
        <p className="mt-4 text-sm">سيتم إضافة المحتوى لاحقاً...</p>
      </GenericCard>
    </div>
  );
};
