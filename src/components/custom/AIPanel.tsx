import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';

interface AIPanelProps {
  selectedElementId: string | null;
  projectId: string;
  mode: string;
}

export const AIPanel: React.FC<AIPanelProps> = ({ selectedElementId, projectId, mode }) => {
  return (
    <BaseCard variant="operations" className="p-4">
      <div className="text-sm">
        <div className="font-medium mb-3">مساعد الذكاء الاصطناعي</div>
        <div className="space-y-3">
          <div className="text-gray-600">الوضع: {mode}</div>
          <div className="text-gray-600">المشروع: {projectId}</div>
          {selectedElementId && (
            <div className="text-gray-600">العنصر: {selectedElementId}</div>
          )}
          <Button size="sm" className="w-full">
            اقتراحات AI
          </Button>
        </div>
      </div>
    </BaseCard>
  );
};