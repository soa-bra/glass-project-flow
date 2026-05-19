/**
 * Training — Development Paths tab.
 * @specRef TrainingDashboard.development-paths (boxes 1–4)
 */
import React from 'react';
import { SpecTabScaffold } from '../shared/SpecTabScaffold';
import { Route, Plus, Target } from 'lucide-react';

export const DevelopmentPathsTab: React.FC = () => (
  <SpecTabScaffold
    intro={{
      title: 'مسارات التطوير',
      description: 'تصميم ومتابعة مسارات تطوير الأفراد والفرق',
      accent: '#d9d2fd',
    }}
    kpis={[
      { title: 'مسارات نشطة', value: 14, unit: 'مسار' },
      { title: 'المنخرطون', value: 312, unit: 'موظف' },
      { title: 'نسبة الإكمال', value: '68%', description: 'متوسط جميع المسارات' },
    ]}
    items={[
      { id: 'p1', title: 'مسار قادة المنتجات', subtitle: '9 وحدات تعليمية + مشاريع', status: 'نشط', meta: '24 منخرط' },
      { id: 'p2', title: 'مسار المحلل البياناتي', subtitle: 'مسار 6 أشهر', status: 'نشط', meta: '42 منخرط' },
      { id: 'p3', title: 'مسار مهندس المنصات', subtitle: 'هندسي/تقني', status: 'قيد الإطلاق', meta: 'انطلاق: 01-07-2026' },
      { id: 'p4', title: 'مسار التميز التشغيلي', subtitle: 'مسار مدراء الأقسام', status: 'مكتمل دفعة', meta: '18 خريج' },
    ]}
    detailFields={[
      { label: 'المستوى', value: 'متوسط - متقدم' },
      { label: 'المدة', value: '6 أشهر' },
      { label: 'الكفايات', value: '12 كفاية مستهدفة' },
      { label: 'المرشد الرئيسي', value: 'مدير التعلم والتطوير' },
      { label: 'حالة المراجعة', value: 'مُعتمَد' },
    ]}
    actions={[
      { label: 'مسار جديد', icon: <Plus className="h-4 w-4" /> },
      { label: 'إسناد كفايات', icon: <Target className="h-4 w-4" /> },
      { label: 'خريطة المسارات', icon: <Route className="h-4 w-4" /> },
    ]}
    filterPlaceholder="ابحث عن مسار تطوير…"
  />
);
