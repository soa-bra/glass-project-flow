
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const ProjectsSummaryWidget = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <GenericCard adminBoardStyle color="info" className="h-full !bg-[#a4e2f6]">
        <h3 className="text-xl font-bold text-black">ملخص المشاريع</h3>
        <p className="mt-4 text-sm text-gray-800">سيتم إضافة المحتوى لاحقاً...</p>
      </GenericCard>
    </div>
  );
};
