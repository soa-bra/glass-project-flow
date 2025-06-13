
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface FinanceTabProps {
  project: ProjectCardProps;
}

const FinanceTab: React.FC<FinanceTabProps> = ({ project }) => {
  const budgetUsed = 75; // percentage
  const isOverBudget = budgetUsed > 80;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-6">حلقة الميزانية</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 42 42">
              <defs>
                <linearGradient id="budget-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isOverBudget ? "#ef4444" : "#22c55e"} />
                  <stop offset="100%" stopColor={isOverBudget ? "#dc2626" : "#16a34a"} />
                </linearGradient>
              </defs>
              <circle
                cx="21"
                cy="21"
                r="15.5"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <circle
                cx="21"
                cy="21"
                r="15.5"
                fill="none"
                stroke="url(#budget-gradient)"
                strokeWidth="3"
                strokeDasharray={`${budgetUsed * 0.97} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{budgetUsed}%</div>
                <div className="text-sm text-gray-600 font-arabic">مستخدم</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-4">
          <div className="text-sm font-arabic text-gray-600">إجمالي الميزانية</div>
          <div className="text-2xl font-bold text-gray-800">{project.value}</div>
        </div>
        <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-4">
          <div className="text-sm font-arabic text-gray-600">المصروف</div>
          <div className="text-2xl font-bold text-red-600">11.25K</div>
        </div>
        <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-4">
          <div className="text-sm font-arabic text-gray-600">المتبقي</div>
          <div className="text-2xl font-bold text-green-600">3.75K</div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTab;
