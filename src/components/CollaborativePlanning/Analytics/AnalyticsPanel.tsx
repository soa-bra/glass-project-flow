import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

interface AnalyticsPanelProps {
  selectedPlanId: string | null;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = () => {
  return (
    <div className="h-full flex flex-col bg-background p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6" />
        <h1 className="text-2xl font-bold">التحليلات</h1>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="font-medium">مؤشرات الأداء</span>
        </div>
        <p className="text-muted-foreground">تحليلات ومؤشرات أداء المشاريع</p>
      </Card>
    </div>
  );
};