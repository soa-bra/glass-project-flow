/**
 * CSR — Resources tab (data-bound).
 * @specRef CSRDashboard.resources
 */
import React from 'react';
import { DataBoundSpecTab } from '../shared/DataBoundSpecTab';

export const ResourcesTab: React.FC = () => (
  <DataBoundSpecTab
    departmentCode="CSR"
    tabKey="resources"
    intro={{ title: 'الموارد', description: 'إدارة الموارد والميزانيات والأصول المرتبطة بالمبادرات', accent: '#fbe2aa' }}
    kpis={[
      { title: 'إجمالي الميزانية', value: '4,250,000', unit: 'ر.س' },
      { title: 'الميزانية المنصرفة', value: '62%' },
      { title: 'الأصول المرتبطة', value: 38, unit: 'أصل' },
    ]}
    detailFields={[
      { key: 'type', label: 'النوع' },
      { key: 'funding_source', label: 'مصدر التمويل' },
      { key: 'responsible', label: 'المسؤول' },
      { key: 'review_date', label: 'تاريخ المراجعة' },
      { key: 'notes', label: 'ملاحظات', kind: 'textarea' },
    ]}
    filterPlaceholder="ابحث عن مورد أو ميزانية…"
  />
);
