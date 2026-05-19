/**
 * CSR — Impact & Measurement tab.
 * @specRef CSRDashboard.impact (boxes 1–4)
 */
import React from 'react';
import { SpecTabScaffold } from '../shared/SpecTabScaffold';
import { TrendingUp, Plus, FileBarChart } from 'lucide-react';

export const ImpactTab: React.FC = () => (
  <SpecTabScaffold
    intro={{
      title: 'الأثر والقياس',
      description: 'قياس الأثر الاجتماعي والتسويقي ومؤشرات النتائج والمخرجات',
      accent: '#bdeed3',
    }}
    kpis={[
      { title: 'مؤشر الأثر الاجتماعي', value: '7.8', unit: 'نقطة', description: 'من 10 نقاط' },
      { title: 'مستفيدون مباشرون', value: '12,540', unit: 'مستفيد', description: 'منذ بداية العام' },
      { title: 'مؤشرات النتائج', value: 24, unit: 'مؤشر', description: '18 ضمن المستهدف' },
    ]}
    items={[
      { id: 'i1', title: 'مؤشر التمكين الرقمي', subtitle: 'برنامج محو الأمية الرقمية', status: 'ضمن المستهدف', meta: 'آخر تحديث: 12-05-2026' },
      { id: 'i2', title: 'مؤشر الوصول للخدمة', subtitle: 'مبادرة الرعاية الصحية', status: 'تجاوز المستهدف', meta: 'آخر تحديث: 03-05-2026' },
      { id: 'i3', title: 'مؤشر الرضا المجتمعي', subtitle: 'استبيان نصف سنوي', status: 'قيد الجمع', meta: 'الموعد: 30-06-2026' },
      { id: 'i4', title: 'مؤشر العائد الاجتماعي SROI', subtitle: 'تحليل مالي/اجتماعي', status: 'مكتمل', meta: '3.4:1' },
    ]}
    detailFields={[
      { label: 'الفترة', value: 'Q1–Q2 2026' },
      { label: 'القيمة الحالية', value: '7.8' },
      { label: 'القيمة المستهدفة', value: '8.0' },
      { label: 'المالك', value: 'فريق قياس الأثر' },
      { label: 'مصدر البيانات', value: 'استبيانات + بيانات تشغيلية' },
    ]}
    actions={[
      { label: 'مؤشر جديد', icon: <Plus className="h-4 w-4" /> },
      { label: 'تقرير الأثر', icon: <FileBarChart className="h-4 w-4" /> },
      { label: 'تحليل الاتجاهات', icon: <TrendingUp className="h-4 w-4" /> },
    ]}
    filterPlaceholder="ابحث عن مؤشر أو نتيجة…"
  />
);
