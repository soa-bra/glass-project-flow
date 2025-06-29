
import React, { useState } from 'react';
import { Plus, Edit, Trash2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Budget {
  id: string;
  name: string;
  type: 'project' | 'department' | 'general';
  totalBudget: number;
  spent: number;
  remaining: number;
  status: 'active' | 'completed' | 'overbudget';
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  percentage: number;
}

interface BudgetScenario {
  name: string;
  type: 'optimistic' | 'realistic' | 'pessimistic';
  projectedRevenue: number;
  projectedExpenses: number;
  profitMargin: number;
}

export const BudgetManagementTab: React.FC = () => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<string>('realistic');

  const budgets: Budget[] = [
    {
      id: '1',
      name: 'مشروع التطوير الرقمي',
      type: 'project',
      totalBudget: 500000,
      spent: 425000,
      remaining: 75000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      categories: [
        { name: 'الموارد البشرية', allocated: 300000, spent: 285000, percentage: 95 },
        { name: 'التقنية والأدوات', allocated: 150000, spent: 120000, percentage: 80 },
        { name: 'التسويق', allocated: 50000, spent: 20000, percentage: 40 }
      ]
    },
    {
      id: '2',
      name: 'إدارة الموارد البشرية',
      type: 'department',
      totalBudget: 800000,
      spent: 620000,
      remaining: 180000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      categories: [
        { name: 'الرواتب والمزايا', allocated: 600000, spent: 500000, percentage: 83 },
        { name: 'التدريب والتطوير', allocated: 120000, spent: 80000, percentage: 67 },
        { name: 'المصروفات الإدارية', allocated: 80000, spent: 40000, percentage: 50 }
      ]
    }
  ];

  const scenarios: BudgetScenario[] = [
    {
      name: 'السيناريو المتفائل',
      type: 'optimistic',
      projectedRevenue: 3200000,
      projectedExpenses: 2400000,
      profitMargin: 25
    },
    {
      name: 'السيناريو الواقعي',
      type: 'realistic',
      projectedRevenue: 2800000,
      projectedExpenses: 2240000,
      profitMargin: 20
    },
    {
      name: 'السيناريو المتشائم',
      type: 'pessimistic',
      projectedRevenue: 2400000,
      projectedExpenses: 2160000,
      profitMargin: 10
    }
  ];

  const getBudgetStatusColor = (status: string, percentage: number) => {
    if (status === 'overbudget' || percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'overbudget': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* أدوات إدارة الميزانية */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 font-arabic">إدارة الميزانيات</h2>
        <div className="flex gap-3">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إنشاء ميزانية جديدة
          </Button>
        </div>
      </div>

      {/* قائمة الميزانيات */}
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.totalBudget) * 100;
          
          return (
            <BaseCard key={budget.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                     onClick={() => setSelectedBudget(selectedBudget === budget.id ? null : budget.id)}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 font-arabic mb-2">{budget.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(budget.status)}>
                      {budget.status === 'active' ? 'نشط' : budget.status === 'completed' ? 'مكتمل' : 'تجاوز الميزانية'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {budget.type === 'project' ? 'مشروع' : budget.type === 'department' ? 'قسم' : 'عام'}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-600">المتبقي</div>
                  <div className="font-bold text-lg">{budget.remaining.toLocaleString()} ريال</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>المنفق: {budget.spent.toLocaleString()} ريال</span>
                  <span>الإجمالي: {budget.totalBudget.toLocaleString()} ريال</span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-3"
                  indicatorClassName={getBudgetStatusColor(budget.status, percentage)}
                />
                <div className="text-right text-sm text-gray-600 mt-1">{percentage.toFixed(1)}%</div>
              </div>

              {selectedBudget === budget.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-bold text-gray-800 mb-3 font-arabic">تفاصيل الفئات</h4>
                  <div className="space-y-3">
                    {budget.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium font-arabic">{category.name}</span>
                            <span className="text-sm text-gray-600">{category.percentage}%</span>
                          </div>
                          <Progress 
                            value={category.percentage} 
                            className="h-2"
                            indicatorClassName={category.percentage > 90 ? 'bg-red-500' : 'bg-blue-500'}
                          />
                        </div>
                        <div className="text-left ml-4">
                          <div className="text-sm text-gray-600">المنفق</div>
                          <div className="font-medium">{category.spent.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-red-600">
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              )}
            </BaseCard>
          );
        })}
      </div>

      {/* السيناريوهات المالية */}
      <BaseCard className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-arabic">سيناريوهات التخطيط المالي</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                activeScenario === scenario.type 
                  ? 'bg-blue-100 border-2 border-blue-500' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => setActiveScenario(scenario.type)}
            >
              <div className="flex items-center gap-2 mb-3">
                {scenario.type === 'optimistic' && <TrendingUp className="h-5 w-5 text-green-500" />}
                {scenario.type === 'realistic' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                {scenario.type === 'pessimistic' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                <h4 className="font-bold font-arabic">{scenario.name}</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>الإيرادات المتوقعة:</span>
                  <span className="font-medium">{(scenario.projectedRevenue / 1000000).toFixed(1)}م</span>
                </div>
                <div className="flex justify-between">
                  <span>المصروفات المتوقعة:</span>
                  <span className="font-medium">{(scenario.projectedExpenses / 1000000).toFixed(1)}م</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>هامش الربح:</span>
                  <span className={`${scenario.profitMargin > 20 ? 'text-green-600' : scenario.profitMargin > 15 ? 'text-orange-600' : 'text-red-600'}`}>
                    {scenario.profitMargin}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
};
