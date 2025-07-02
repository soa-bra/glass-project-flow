
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { mockSkillGapAlerts } from '../data';

export const SkillGapAlertsCard: React.FC = () => {
  const alerts = mockSkillGapAlerts;

  return (
    <BaseCard variant="operations" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-black" />
        <h3 className="text-lg font-semibold text-black font-arabic">تنبيهات فجوات المهارات</h3>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex-1">
              <h4 className="font-medium text-black font-arabic">{alert.area}</h4>
              <p className="text-sm text-black mt-1 font-arabic">{alert.businessImpact}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={
                  alert.severity === 'critical' ? 'destructive' :
                  alert.severity === 'high' ? 'destructive' :
                  alert.severity === 'medium' ? 'secondary' : 'outline'
                }>
                  {alert.severity === 'critical' ? 'حرج' :
                   alert.severity === 'high' ? 'عالي' :
                   alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                </Badge>
                <span className="text-xs text-black font-arabic">
                  {alert.affectedEmployees.length} موظف متأثر
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
