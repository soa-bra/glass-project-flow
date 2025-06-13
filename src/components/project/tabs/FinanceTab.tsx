
import React from 'react';
import { Project } from '@/types/project';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface FinanceTabProps {
  project: Project;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ project }) => {
  const budgetPercentage = (project.budget.spent / project.budget.total) * 100;
  const remaining = project.budget.total - project.budget.spent;
  const isOverBudget = budgetPercentage > 100;

  return (
    <div className="space-y-6">
      {/* ملخص الميزانية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {project.budget.total.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">إجمالي الميزانية</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-red-600" />
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {project.budget.spent.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">المبلغ المنفق</p>
        </div>

        <div className={`
          bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20
          ${isOverBudget ? 'ring-2 ring-red-400/50' : ''}
        `}>
          <div className="flex items-center justify-between mb-4">
            <DollarSign className={`w-8 h-8 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`} />
            <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {isOverBudget ? 'تجاوز' : 'متبقي'}
            </span>
          </div>
          <div className={`text-2xl font-bold mb-2 ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
            {Math.abs(remaining).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">
            {isOverBudget ? 'زيادة في التكلفة' : 'متبقي من الميزانية'}
          </p>
        </div>
      </div>

      {/* شريط تقدم الميزانية */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">استخدام الميزانية</h3>
          <span className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
            {budgetPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-white/30 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${
              isOverBudget 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : budgetPercentage > 80
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">نسبة الإنفاق: </span>
            <span className="font-medium text-gray-800">{budgetPercentage.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-600">المتوسط المتوقع: </span>
            <span className="font-medium text-gray-800">
              {((project.progress / 100) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* توزيع المصروفات */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4">توزيع المصروفات</h3>
        <div className="space-y-3">
          {[
            { category: 'الرواتب والأجور', amount: project.budget.spent * 0.6, color: 'blue' },
            { category: 'المواد والأدوات', amount: project.budget.spent * 0.25, color: 'green' },
            { category: 'النفقات التشغيلية', amount: project.budget.spent * 0.1, color: 'yellow' },
            { category: 'أخرى', amount: project.budget.spent * 0.05, color: 'purple' }
          ].map((item) => (
            <div key={item.category} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-${item.color}-500`} />
                <span className="text-gray-700">{item.category}</span>
              </div>
              <span className="font-medium text-gray-800">
                {item.amount.toLocaleString()} ر.س
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
