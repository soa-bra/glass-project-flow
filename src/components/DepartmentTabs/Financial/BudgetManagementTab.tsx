
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
    if (status === 'overbudget' || percentage > 90) return 'bg-[#f1b5b9]';
    if (percentage > 75) return 'bg-[#fbe2aa]';
    return 'bg-[#bdeed3]';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#bdeed3] text-black';
      case 'completed': return 'bg-[#a4e2f6] text-black';
      case 'overbudget': return 'bg-[#f1b5b9] text-black';
      default: return 'bg-[#d9d2fd] text-black';
    }
  };

  const handleBudgetClick = (budgetId: string) => {
    setSelectedBudget(selectedBudget === budgetId ? null : budgetId);
  };

  return (
    <div className="space-y-6">
      {/* أدوات إدارة الميزانية */}
      <div className="flex justify-between items-center">
        <h3 className="text-large font-semibold text-black font-arabic mx-[30px]">إدارة الميزانيات</h3>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium mx-[25px] flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إنشاء ميزانية جديدة
        </button>
      </div>

      {/* قائمة الميزانيات */}
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.totalBudget) * 100;
          
          return (
            <div key={budget.id} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 cursor-pointer hover:shadow-lg transition-shadow">
              <div onClick={() => handleBudgetClick(budget.id)}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-black font-arabic mb-2">{budget.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-normal ${getStatusBadgeColor(budget.status)}`}>
                        {budget.status === 'active' ? 'نشط' : budget.status === 'completed' ? 'مكتمل' : 'تجاوز الميزانية'}
                      </div>
                      <span className="text-sm text-gray-400">
                        {budget.type === 'project' ? 'مشروع' : budget.type === 'department' ? 'قسم' : 'عام'}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-400">المتبقي</div>
                    <div className="font-bold text-lg text-black">{budget.remaining.toLocaleString()} ريال</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-black">المنفق: {budget.spent.toLocaleString()} ريال</span>
                    <span className="text-black">الإجمالي: {budget.totalBudget.toLocaleString()} ريال</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getBudgetStatusColor(budget.status, percentage)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              </div>

              {selectedBudget === budget.id && (
                <div className="mt-4 pt-4 border-t border-black/10">
                  <h4 className="font-bold text-black mb-3 font-arabic">تفاصيل الفئات</h4>
                  <div className="space-y-3">
                    {budget.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-transparent border border-black/10 rounded-3xl">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium font-arabic text-black">{category.name}</span>
                            <span className="text-sm text-gray-400">{category.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${category.percentage > 90 ? 'bg-[#f1b5b9]' : 'bg-[#a4e2f6]'}`}
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-left ml-4">
                          <div className="text-sm text-gray-400">المنفق</div>
                          <div className="font-medium text-black">{category.spent.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-4 justify-end">
                    <button className="bg-transparent border border-black text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      تعديل
                    </button>
                    <button className="bg-transparent border border-black text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* السيناريوهات المالية */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">سيناريوهات التخطيط المالي</h3>
        </div>
        <div className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className={`p-4 rounded-3xl cursor-pointer transition-all ${
                  activeScenario === scenario.type 
                    ? 'bg-[#a4e2f6] border-2 border-black' 
                    : 'bg-transparent border border-black/10 hover:bg-gray-50'
                }`}
                onClick={() => setActiveScenario(scenario.type)}
              >
                <div className="flex items-center gap-2 mb-3">
                  {scenario.type === 'optimistic' && <TrendingUp className="h-5 w-5 text-black" />}
                  {scenario.type === 'realistic' && <CheckCircle className="h-5 w-5 text-black" />}
                  {scenario.type === 'pessimistic' && <AlertCircle className="h-5 w-5 text-black" />}
                  <h4 className="font-bold font-arabic text-black">{scenario.name}</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">الإيرادات المتوقعة:</span>
                    <span className="font-medium text-black">{(scenario.projectedRevenue / 1000000).toFixed(1)}م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">المصروفات المتوقعة:</span>
                    <span className="font-medium text-black">{(scenario.projectedExpenses / 1000000).toFixed(1)}م</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-black">هامش الربح:</span>
                    <span className="text-black">
                      {scenario.profitMargin}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
