/**
 * Training — Development Paths tab (data-bound).
 * @specRef TrainingDashboard.development-paths
 */
import React from 'react';
import { DataBoundSpecTab } from '../shared/DataBoundSpecTab';

export const DevelopmentPathsTab: React.FC = () => (
  <DataBoundSpecTab
    departmentCode="Training"
    tabKey="development-paths"
    intro={{ title: 'مسارات التطوير', description: 'تصميم ومتابعة مسارات تطوير الأفراد والفرق', accent: '#d9d2fd' }}
    kpis={[
      { title: 'مسارات نشطة', value: 14, unit: 'مسار' },
      { title: 'المنخرطون', value: 312, unit: 'موظف' },
      { title: 'نسبة الإكمال', value: '68%' },
    ]}
    detailFields={[
      { key: 'level', label: 'المستوى' },
      { key: 'duration', label: 'المدة' },
      { key: 'competencies', label: 'الكفايات المستهدفة' },
      { key: 'mentor', label: 'المرشد الرئيسي' },
      { key: 'notes', label: 'ملاحظات', kind: 'textarea' },
    ]}
    filterPlaceholder="ابحث عن مسار تطوير…"
  />
);
