
import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

export const ContractsArchive: React.FC = () => {
  const kpiStats = [
    {
      title: 'العقود المنتهية',
      value: 89,
      unit: 'عقد',
      description: 'العقود المؤرشفة'
    },
    {
      title: 'القيمة الإجمالية',
      value: '23.4',
      unit: 'مليون ريال',
      description: 'قيمة العقود'
    },
    {
      title: 'متوسط المدة',
      value: 2.3,
      unit: 'سنة',
      description: 'متوسط مدة العقود'
    },
    {
      title: 'معدل التجديد',
      value: 73,
      unit: '%',
      description: 'العقود المجددة'
    }
  ];

  return (
    <div className="space-y-6">
      <KPIStatsSection stats={kpiStats} />
      <div className="text-center text-gray-600 font-arabic p-8">
        <h3 className="text-xl font-semibold mb-2">أرشيف العقود المنتهية</h3>
        <p className="text-base">واجهة إدارة العقود المؤرشفة قيد التطوير</p>
      </div>
    </div>
  );
};
