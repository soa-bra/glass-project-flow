/**
 * CSR — Impact & Measurement tab (data-bound).
 * @specRef CSRDashboard.impact (boxes 1–4)
 */
import React from 'react';
import { DataBoundSpecTab } from '../shared/DataBoundSpecTab';

export const ImpactTab: React.FC = () => (
  <DataBoundSpecTab
    departmentCode="CSR"
    tabKey="impact"
    intro={{
      title: 'الأثر والقياس',
      description: 'قياس الأثر الاجتماعي والتسويقي ومؤشرات النتائج والمخرجات',
      accent: '#bdeed3',
    }}
    kpis={[
      { title: 'مؤشر الأثر الاجتماعي', value: '7.8', unit: 'نقطة', description: 'من 10 نقاط' },
      { title: 'مستفيدون مباشرون', value: '12,540', unit: 'مستفيد' },
      { title: 'مؤشرات النتائج', value: 24, unit: 'مؤشر' },
    ]}
    detailFields={[
      { key: 'period', label: 'الفترة', placeholder: 'Q1–Q2 2026' },
      { key: 'current_value', label: 'القيمة الحالية' },
      { key: 'target_value', label: 'القيمة المستهدفة' },
      { key: 'owner', label: 'المالك' },
      { key: 'data_source', label: 'مصدر البيانات', kind: 'textarea' },
    ]}
    filterPlaceholder="ابحث عن مؤشر أو نتيجة…"
  />
);
