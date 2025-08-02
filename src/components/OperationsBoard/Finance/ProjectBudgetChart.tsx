
import React from 'react';
import { Progress } from '@/components/ui/progress';

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
    <div className="grid grid-cols-1 gap-4">
      {projects.sort((a, b) => (b.spent/b.budget) - (a.spent/a.budget)).map(project => {
        const spentPercentage = Math.round((project.spent / project.budget) * 100);
        const barColor = spentPercentage > 90 ? 'bg-red-500' : spentPercentage > 75 ? 'bg-orange-400' : 'bg-green-500';
        
        return (
          <div key={project.id} className="glass-enhanced rounded-[40px] p-4 transition-all duration-200 ease-in-out hover:bg-white/50">
            <div className="flex justify-between items-center mb-2">
              <div className="text-left text-sm">
                <span className="font-medium">{spentPercentage}%</span>
              </div>
              <div className="text-right">
                <h3 className="font-medium">{project.name}</h3>
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
            
            <div className="flex justify-between text-sm text-gray-600">
              <div>{formatCurrency(project.spent)}</div>
              <div>{formatCurrency(project.budget)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
