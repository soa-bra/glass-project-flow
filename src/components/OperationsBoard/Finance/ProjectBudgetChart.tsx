
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemBadge } from '@/components/ui/UnifiedSystemBadge';
import { BarChart } from 'lucide-react';

interface ProjectBudget {
  id: number;
  name: string;
  budget: number;
  spent: number;
}

interface ProjectBudgetChartProps {
  projects: ProjectBudget[];
}

export const ProjectBudgetChart: React.FC<ProjectBudgetChartProps> = ({ projects }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <UnifiedSystemCard 
      title="ميزانيات المشاريع"
      icon={<BarChart />}
    >
      <div className="grid grid-cols-1 gap-4">
        {projects.sort((a, b) => (b.spent/b.budget) - (a.spent/a.budget)).map(project => {
          const spentPercentage = Math.round((project.spent / project.budget) * 100);
          const badgeVariant = spentPercentage > 90 ? 'error' : spentPercentage > 75 ? 'warning' : 'success';
          const barColor = spentPercentage > 90 ? 'bg-red-500' : spentPercentage > 75 ? 'bg-orange-400' : 'bg-green-500';
          
          return (
            <div key={project.id} className="p-4 border border-black/5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <UnifiedSystemBadge variant={badgeVariant}>
                  {spentPercentage}%
                </UnifiedSystemBadge>
                <div className="text-right">
                  <h3 className="font-medium font-arabic">{project.name}</h3>
                </div>
              </div>
              
              <div className="flex mb-2">
                <div className="flex-1">
                  <Progress 
                    value={spentPercentage} 
                    className="h-5 bg-gray-200"
                    indicatorClassName={barColor}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-black/70 font-arabic">
                <div>{formatCurrency(project.spent)}</div>
                <div>{formatCurrency(project.budget)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </UnifiedSystemCard>
  );
};
