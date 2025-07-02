
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockEnrollments } from '../data';

export const RecentEnrollmentsCard: React.FC = () => {
  const recentEnrollments = mockEnrollments.slice(0, 5);

  return (
    <BaseCard variant="operations" className="p-6">
      <h3 className="text-lg font-semibold text-black font-arabic mb-4">التسجيلات الأخيرة</h3>
      <div className="space-y-4">
        {recentEnrollments.map((enrollment) => (
          <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium text-black font-arabic">موظف {enrollment.studentId}</h4>
                  <p className="text-sm text-black font-arabic">دورة {enrollment.courseId}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={
                enrollment.status === 'completed' ? 'default' :
                enrollment.status === 'in_progress' ? 'secondary' :
                enrollment.status === 'failed' ? 'destructive' : 'outline'
              }>
                {enrollment.status === 'completed' ? 'مكتمل' :
                 enrollment.status === 'in_progress' ? 'قيد التقدم' :
                 enrollment.status === 'failed' ? 'فاشل' :
                 enrollment.status === 'dropped' ? 'منسحب' : 'مسجل'}
              </Badge>
              <div className="text-right">
                <div className="text-sm font-medium text-black font-arabic">{enrollment.progress}%</div>
                <Progress value={enrollment.progress} className="h-1 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
