import React from 'react';
import { BaseProjectTabLayout } from '../BaseProjectTabLayout';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Wallet, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { Project } from '@/types/project';

interface FinancialTabProps {
  data?: Project;
}

export const FinancialTab: React.FC<FinancialTabProps> = ({ data }) => {
  const financialStats = [
    {
      title: 'الميزانية الإجمالية',
      value: '250',
      unit: 'ألف ر.س',
      description: 'الميزانية المخصصة للمشروع'
    },
    {
      title: 'المبلغ المستخدم',
      value: '180',
      unit: 'ألف ر.س',
      description: 'المبلغ المصروف حتى الآن'
    },
    {
      title: 'النسبة المتبقية',
      value: '28',
      unit: '%',
      description: 'من إجمالي الميزانية'
    },
    {
      title: 'التوقع النهائي',
      value: '240',
      unit: 'ألف ر.س',
      description: 'التكلفة المتوقعة النهائية'
    }
  ];

  const expenseCategories = [
    { name: 'الموارد البشرية', amount: 120000, percentage: 67 },
    { name: 'الأدوات والبرمجيات', amount: 35000, percentage: 19 },
    { name: 'التسويق والإعلان', amount: 15000, percentage: 8 },
    { name: 'مصاريف أخرى', amount: 10000, percentage: 6 }
  ];

  return (
    <BaseProjectTabLayout
      value="finance"
      title="الإدارة المالية"
      icon={<Wallet className="w-4 h-4" />}
      kpiStats={financialStats}
    >
      {/* Budget Breakdown */}
      <BaseCard title="تفصيل الميزانية" icon={<DollarSign className="w-4 h-4" />}>
        <div className="space-y-4">
          {expenseCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="text-sm font-semibold text-gray-800">{category.name}</h4>
                <p className="text-xs text-gray-600">{category.amount.toLocaleString()} ر.س</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold text-gray-800">{category.percentage}%</div>
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* Financial Actions */}
      <BaseCard title="العمليات المالية" icon={<TrendingUp className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4">
          <BaseActionButton 
            variant="primary" 
            icon={<DollarSign className="w-4 h-4" />}
          >
            إضافة مصروف
          </BaseActionButton>
          <BaseActionButton 
            variant="outline" 
            icon={<TrendingUp className="w-4 h-4" />}
          >
            تقرير مالي
          </BaseActionButton>
          <BaseActionButton 
            variant="secondary" 
            icon={<AlertCircle className="w-4 h-4" />}
          >
            مراجعة الميزانية
          </BaseActionButton>
          <BaseActionButton 
            variant="ghost" 
            icon={<Wallet className="w-4 h-4" />}
          >
            عرض السجلات
          </BaseActionButton>
        </div>
      </BaseCard>

      {/* Recent Transactions */}
      <BaseCard title="المعاملات الأخيرة" icon={<AlertCircle className="w-4 h-4" />}>
        <div className="space-y-3">
          {[
            { date: '2024-01-25', description: 'دفع راتب المطورين', amount: -45000, type: 'expense' },
            { date: '2024-01-24', description: 'شراء ترخيص برنامج', amount: -2500, type: 'expense' },
            { date: '2024-01-23', description: 'دفعة من العميل', amount: 75000, type: 'income' },
            { date: '2024-01-22', description: 'مصاريف استضافة', amount: -800, type: 'expense' }
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
              <div className={`text-sm font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : ''}{transaction.amount.toLocaleString()} ر.س
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </BaseProjectTabLayout>
  );
};