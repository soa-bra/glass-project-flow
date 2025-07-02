
import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

export const MediaArchive: React.FC = () => {
  const kpiStats = [
    {
      title: 'الصور المؤرشفة',
      value: 2847,
      unit: 'صورة',
      description: 'الوسائط المتاحة'
    },
    {
      title: 'حجم البيانات',
      value: '15.2',
      unit: 'جيجابايت',
      description: 'المساحة المستخدمة'
    },
    {
      title: 'التحميلات الشهرية',
      value: 234,
      unit: 'تحميل',
      description: 'متوسط الاستخدام'
    },
    {
      title: 'معدل الجودة',
      value: 98,
      unit: '%',
      description: 'نسبة الجودة العالية'
    }
  ];

  return (
    <div className="space-y-6">
      <KPIStatsSection stats={kpiStats} />
      <div className="text-center text-gray-600 font-arabic p-8">
        <h3 className="text-xl font-semibold mb-2">أرشيف الوسائط</h3>
        <p className="text-base">واجهة إدارة الوسائط المؤرشفة قيد التطوير</p>
      </div>
    </div>
  );
};
