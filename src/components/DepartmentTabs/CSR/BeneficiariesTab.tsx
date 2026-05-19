/**
 * CSR — Beneficiaries tab.
 * @specRef CSRDashboard.beneficiaries (boxes 1–4)
 */
import React from 'react';
import { SpecTabScaffold } from '../shared/SpecTabScaffold';
import { Users, Plus, Eye } from 'lucide-react';

export const BeneficiariesTab: React.FC = () => (
  <SpecTabScaffold
    intro={{
      title: 'المستفيدون',
      description: 'تعريف شرائح المستفيدين وارتباطها بالمبادرات والأثر',
      accent: '#a4e2f6',
    }}
    kpis={[
      { title: 'إجمالي شرائح المستفيدين', value: 18, unit: 'شريحة' },
      { title: 'مستفيدون نشطون', value: '9,820', unit: 'مستفيد' },
      { title: 'نسبة الإناث', value: '54%', description: 'من إجمالي المستفيدين' },
    ]}
    items={[
      { id: 'b1', title: 'الشباب 18-25', subtitle: 'برامج التمكين والتوظيف', status: 'نشطة', meta: '3,210 مستفيد' },
      { id: 'b2', title: 'سيدات الأعمال الناشئات', subtitle: 'حاضنة المشاريع الصغيرة', status: 'نشطة', meta: '420 مستفيدة' },
      { id: 'b3', title: 'ذوو الإعاقة', subtitle: 'برامج الدمج المجتمعي', status: 'نشطة', meta: '760 مستفيد' },
      { id: 'b4', title: 'كبار السن', subtitle: 'مبادرات الرعاية والصحة', status: 'قيد التخطيط', meta: 'انطلاق: Q3 2026' },
    ]}
    detailFields={[
      { label: 'الفئة العمرية', value: '18-25' },
      { label: 'المنطقة', value: 'الرياض، جدة، الدمام' },
      { label: 'المبادرات المرتبطة', value: '5 مبادرات' },
      { label: 'المالك', value: 'منسق المستفيدين' },
      { label: 'حالة البيانات', value: 'مُحدّثة' },
    ]}
    actions={[
      { label: 'شريحة جديدة', icon: <Plus className="h-4 w-4" /> },
      { label: 'عرض المبادرات', icon: <Eye className="h-4 w-4" /> },
      { label: 'تصدير الشرائح', icon: <Users className="h-4 w-4" /> },
    ]}
    filterPlaceholder="ابحث عن شريحة مستفيدين…"
  />
);
