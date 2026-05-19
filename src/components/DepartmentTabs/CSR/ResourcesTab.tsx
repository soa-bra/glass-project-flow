/**
 * CSR — Resources tab.
 * @specRef CSRDashboard.resources (boxes 1–4)
 */
import React from 'react';
import { SpecTabScaffold } from '../shared/SpecTabScaffold';
import { Wallet, Plus, FileText } from 'lucide-react';

export const ResourcesTab: React.FC = () => (
  <SpecTabScaffold
    intro={{
      title: 'الموارد',
      description: 'إدارة الموارد والميزانيات والأصول المرتبطة بالمبادرات',
      accent: '#fbe2aa',
    }}
    kpis={[
      { title: 'إجمالي الميزانية', value: '4,250,000', unit: 'ر.س' },
      { title: 'الميزانية المنصرفة', value: '62%', description: 'من المخصص' },
      { title: 'الأصول المرتبطة', value: 38, unit: 'أصل' },
    ]}
    items={[
      { id: 'r1', title: 'ميزانية برنامج التمكين الرقمي', subtitle: 'تشغيل + تدريب', status: 'مفتوحة', meta: '850,000 ر.س' },
      { id: 'r2', title: 'دعم حاضنة المشاريع', subtitle: 'منح صغيرة', status: 'مفتوحة', meta: '1,200,000 ر.س' },
      { id: 'r3', title: 'موارد لوجستية - فعاليات', subtitle: 'قاعات، نقل، تموين', status: 'محجوزة', meta: '180,000 ر.س' },
      { id: 'r4', title: 'موارد إعلامية', subtitle: 'إنتاج محتوى وقصص أثر', status: 'مفتوحة', meta: '95,000 ر.س' },
    ]}
    detailFields={[
      { label: 'النوع', value: 'ميزانية تشغيلية' },
      { label: 'مصدر التمويل', value: 'ذاتي + شراكات' },
      { label: 'المسؤول', value: 'مدير العمليات المجتمعية' },
      { label: 'تاريخ المراجعة', value: '30-06-2026' },
      { label: 'الموافقات', value: 'مكتملة' },
    ]}
    actions={[
      { label: 'تخصيص جديد', icon: <Plus className="h-4 w-4" /> },
      { label: 'كشف الصرف', icon: <FileText className="h-4 w-4" /> },
      { label: 'مراجعة الميزانية', icon: <Wallet className="h-4 w-4" /> },
    ]}
    filterPlaceholder="ابحث عن مورد أو ميزانية…"
  />
);
