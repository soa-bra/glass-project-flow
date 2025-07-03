import React from 'react';
import { Card } from '@/components/ui/card';
import { Link2, Settings } from 'lucide-react';

interface IntegrationPanelProps {
  selectedPlanId: string | null;
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = () => {
  return (
    <div className="h-full flex flex-col bg-background p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link2 className="w-6 h-6" />
        <h1 className="text-2xl font-bold">التكاملات</h1>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" />
          <span className="font-medium">إعدادات التكامل</span>
        </div>
        <p className="text-muted-foreground">إدارة التكاملات مع الأنظمة الخارجية</p>
      </Card>
    </div>
  );
};