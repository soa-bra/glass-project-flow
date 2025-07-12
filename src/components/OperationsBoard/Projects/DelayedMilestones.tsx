import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';

interface DelayedMilestone {
  id: string;
  projectName: string;
  milestone: string;
  originalDate: string;
  currentDate: string;
  delayDays: number;
  impact: 'high' | 'medium' | 'low';
}

interface DelayedMilestonesProps {
  delayedMilestones: DelayedMilestone[];
}

export const DelayedMilestones: React.FC<DelayedMilestonesProps> = ({ delayedMilestones }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'تأثير عالي';
      case 'medium':
        return 'تأثير متوسط';
      case 'low':
        return 'تأثير منخفض';
      default:
        return 'غير محدد';
    }
  };

  return (
    <Card className="glass-enhanced rounded-[40px]">
      <CardHeader>
        <CardTitle className="text-right font-arabic text-lg flex items-center justify-between">
          <span>المعالم المتأخرة</span>
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 max-h-[350px] overflow-y-auto">
          {delayedMilestones.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-arabic">
              لا توجد معالم متأخرة حالياً
            </div>
          ) : (
            delayedMilestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-right flex-1">
                    <h4 className="font-semibold text-gray-800 font-arabic mb-1">
                      {milestone.milestone}
                    </h4>
                    <p className="text-sm text-gray-600 font-arabic">
                      المشروع: {milestone.projectName}
                    </p>
                  </div>
                  <Badge className={getImpactColor(milestone.impact)}>
                    {getImpactText(milestone.impact)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Clock className="h-4 w-4" />
                    <span className="font-arabic">متأخر {milestone.delayDays} أيام</span>
                  </div>
                  <div className="text-left">
                    <div className="font-arabic">الموعد الأصلي: {milestone.originalDate}</div>
                    <div className="font-arabic">الموعد الحالي: {milestone.currentDate}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};