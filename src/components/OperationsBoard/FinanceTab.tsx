
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProjectBudget {
  id: number;
  name: string;
  budget: number;
  spent: number;
}

interface OverBudgetProject {
  id: number;
  name: string;
  percentage: number;
}

interface FinanceData {
  projects: ProjectBudget[];
  overBudget: OverBudgetProject[];
}

interface FinanceTabProps {
  data?: FinanceData;
  loading: boolean;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  // تنسيق الأرقام بالآلاف
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-arabic font-medium text-right">المؤشرات المالية</h2>
      
      {/* مخطط ميزانية المشاريع مقابل المصروفات */}
      <div className="grid grid-cols-1 gap-4">
        {data.projects.sort((a, b) => (b.spent/b.budget) - (a.spent/a.budget)).map(project => {
          const spentPercentage = Math.round((project.spent / project.budget) * 100);
          const barColor = spentPercentage > 90 ? 'bg-red-500' : spentPercentage > 75 ? 'bg-orange-400' : 'bg-green-500';
          
          return (
            <Card key={project.id} className="bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-all">
              <CardContent className="p-4">
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top 5 مشاريع تجاوزت 80% من الميزانية */}
      <div className="mt-8">
        <h3 className="text-xl font-arabic font-medium text-right mb-4">المشاريع التي تجاوزت 80% من الميزانية</h3>
        
        {data.overBudget.length > 0 ? (
          <Card className="bg-white/40 backdrop-blur-sm">
            <CardContent className="p-4">
              <ul className="space-y-3">
                {data.overBudget.map(project => (
                  <li key={project.id} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-red-600">{project.percentage}%</span>
                      <h4 className="text-right">{project.name}</h4>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-gray-500">لا توجد مشاريع تجاوزت 80% من الميزانية</p>
        )}
      </div>

      {/* زر تصدير تقرير مالي */}
      <div className="flex justify-center mt-6">
        <button 
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          تصدير تقرير مالي
        </button>
      </div>
    </div>
  );
};
