
import React from 'react';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemBadge } from '@/components/ui/UnifiedSystemBadge';
import { AlertTriangle } from 'lucide-react';

interface OverBudgetProject {
  id: number;
  name: string;
  percentage: number;
}

interface OverBudgetAlertProps {
  overBudget: OverBudgetProject[];
}

export const OverBudgetAlert: React.FC<OverBudgetAlertProps> = ({ overBudget }) => {
  return (
    <div className="mt-8">
      <UnifiedSystemCard 
        title="المشاريع التي تجاوزت 80% من الميزانية"
        icon={<AlertTriangle />}
      >
        {overBudget.length > 0 ? (
          <div className="space-y-3">
            {overBudget.map(project => (
              <div key={project.id} className="flex justify-between items-center p-3 border border-black/5 rounded-2xl">
                <UnifiedSystemBadge variant="error">
                  {project.percentage}%
                </UnifiedSystemBadge>
                <h4 className="text-right font-arabic">{project.name}</h4>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-black/50 font-arabic">لا توجد مشاريع تجاوزت 80% من الميزانية</p>
        )}
      </UnifiedSystemCard>
    </div>
  );
};
