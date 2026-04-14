
import React from 'react';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

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
      <h3 className="text-xl font-arabic font-medium text-right mb-4">المشاريع التي تجاوزت 80% من الميزانية</h3>
      
      {overBudget.length > 0 ? (
        <AppCardSurface density="compact">
          <ul className="space-y-3">
            {overBudget.map(project => (
              <li key={project.id} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-red-600">{project.percentage}%</span>
                  <h4 className="text-right">{project.name}</h4>
                </div>
              </li>
            ))}
          </ul>
        </AppCardSurface>
      ) : (
        <p className="text-center text-gray-500">لا توجد مشاريع تجاوزت 80% من الميزانية</p>
      )}
    </div>
  );
};
