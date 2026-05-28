/**
 * CSR — Beneficiaries tab (data-bound).
 * @specRef CSRDashboard.beneficiaries
 */
import React from 'react';
import { DataBoundSpecTab } from '../shared/DataBoundSpecTab';

export const BeneficiariesTab: React.FC = () => (
  <DataBoundSpecTab
    departmentCode="CSR"
    tabKey="beneficiaries"
    intro={{ title: 'المستفيدون', description: 'تعريف شرائح المستفيدين وارتباطها بالمبادرات والأثر', accent: '#a4e2f6' }}
    kpis={[
      { title: 'إجمالي شرائح المستفيدين', value: 18, unit: 'شريحة' },
      { title: 'مستفيدون نشطون', value: '9,820', unit: 'مستفيد' },
      { title: 'نسبة الإناث', value: '54%' },
    ]}
    detailFields={[
      { key: 'age_group', label: 'الفئة العمرية' },
      { key: 'region', label: 'المنطقة' },
      { key: 'initiatives', label: 'المبادرات المرتبطة' },
      { key: 'owner', label: 'المالك' },
      { key: 'notes', label: 'ملاحظات', kind: 'textarea' },
    ]}
    filterPlaceholder="ابحث عن شريحة مستفيدين…"
  />
);
