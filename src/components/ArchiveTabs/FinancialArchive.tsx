
import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

export const FinancialArchive: React.FC = () => {
  const kpiStats = [
    {
      title: 'السجلات المالية',
      value: 1523,
      unit: 'سجل',
      description: 'المعاملات المؤرشفة'
    },
    {
      title: 'القيمة الإجمالية',
      value: '45.8',
      unit: 'مليون ريال',
      description: 'إجمالي المعاملات'
    },
    {
      title: 'فترة الأرشفة',
      value: 7,
      unit: 'سنوات',
      description: 'البيانات المحفوظة'
    },
    {
      title: 'معدل الدقة',
      value: 99.8,
      unit: '%',
      description: 'دقة السجلات'
    }
  ];

  return (
    <div className="space-y-6">
      <KPIStatsSection stats={kpiStats} />
      <div className="text-center text-gray-600 font-arabic p-8">
        <h3 className="text-xl font-semibold mb-2">أرشيف السجلات المالية</h3>
        <p className="text-base">واجهة إدارة السجلات المالية المؤرشفة قيد التطوير</p>
      </div>
    </div>
  );
};
