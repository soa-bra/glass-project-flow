
import React from 'react';
import { ProjectData } from './types';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface FinanceTabProps {
  projectData: ProjectData;
  loading: boolean;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ projectData, loading }) => {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-[10px] rounded-[20px] p-4 animate-pulse">
            <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-white/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const budgetPercentage = (projectData.budget.spent / projectData.budget.total) * 100;
  const isOverBudget = budgetPercentage > 100;

  return (
    <div className="p-6 space-y-6">
      {/* ملخص الميزانية */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 font-arabic">ملخص الميزانية</h3>
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">الميزانية الإجمالية</p>
            <p className="text-2xl font-bold text-gray-800">
              ${projectData.budget.total.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">المبلغ المنفق</p>
            <p className="text-2xl font-bold text-blue-600">
              ${projectData.budget.spent.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">المتبقي</p>
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(projectData.budget.remaining).toLocaleString()}
            </p>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-red-500' : budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{budgetPercentage.toFixed(1)}% مستخدم</span>
          {isOverBudget && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertTriangle size={16} />
              <span>تجاوز الميزانية</span>
            </div>
          )}
        </div>
      </div>

      {/* تفاصيل المصروفات */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">تفاصيل المصروفات</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">الرواتب والأجور</span>
            </div>
            <span className="font-bold">$8,500</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">الأدوات والبرمجيات</span>
            </div>
            <span className="font-bold">$2,300</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">التسويق والإعلان</span>
            </div>
            <span className="font-bold">$1,200</span>
          </div>
        </div>
      </div>

      {/* الاتجاهات المالية */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">الاتجاهات المالية</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">نمو الإيرادات</p>
              <p className="font-bold text-green-600">+12%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">زيادة التكاليف</p>
              <p className="font-bold text-red-600">+8%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
