
import React from 'react';
import { ProjectData } from './types';
import { DataGrid } from './DataGrid';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, PieChart } from 'lucide-react';

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

  // بيانات وهمية للمصروفات التفصيلية
  const expenseData = [
    { category: 'الرواتب والأجور', amount: 8500, percentage: 56.7, date: '2025-06-01' },
    { category: 'الأدوات والبرمجيات', amount: 2300, percentage: 15.3, date: '2025-06-05' },
    { category: 'التسويق والإعلان', amount: 1200, percentage: 8.0, date: '2025-06-10' },
    { category: 'الاستشارات الخارجية', amount: 1500, percentage: 10.0, date: '2025-06-08' },
    { category: 'المصاريف الإدارية', amount: 1500, percentage: 10.0, date: '2025-06-12' }
  ];

  const expenseColumns = [
    { key: 'category', label: 'الفئة', sortable: true, align: 'right' as const },
    { key: 'amount', label: 'المبلغ ($)', sortable: true, align: 'center' as const },
    { key: 'percentage', label: 'النسبة (%)', sortable: true, align: 'center' as const },
    { key: 'date', label: 'التاريخ', sortable: true, align: 'center' as const }
  ];

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

      {/* الرسم البياني للمصروفات */}
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 font-arabic">توزيع المصروفات</h3>
          <PieChart className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* الرسم البياني */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="2" />
                {expenseData.map((item, index) => {
                  const offset = expenseData.slice(0, index).reduce((sum, prev) => sum + prev.percentage, 0);
                  const circumference = 2 * Math.PI * 16;
                  const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((offset / 100) * circumference);
                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                  
                  return (
                    <circle
                      key={index}
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={colors[index]}
                      strokeWidth="2"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          
          {/* الأسطورة */}
          <div className="space-y-2">
            {expenseData.map((item, index) => {
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
              return (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-800 mr-auto">
                    {item.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* جدول المصروفات التفصيلي */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">تفاصيل المصروفات</h3>
        <DataGrid 
          columns={expenseColumns}
          data={expenseData}
          searchable={true}
          exportable={true}
        />
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
              <p className="font-bol text-red-600">+8%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
