/**
 * KMPA — Publications tab.
 * @specRef KMPADashboard.publications (boxes 1–4)
 */
import React from 'react';
import { SpecTabScaffold } from '../shared/SpecTabScaffold';
import { BookOpen, Plus, Upload } from 'lucide-react';

export const PublicationsTab: React.FC = () => (
  <SpecTabScaffold
    intro={{
      title: 'النشر',
      description: 'إدارة المنشورات، قنوات النشر، الحالات، والروابط المرجعية',
      accent: '#bdeed3',
    }}
    kpis={[
      { title: 'منشورات هذا العام', value: 17, unit: 'منشور' },
      { title: 'مجلات محكّمة', value: 6, unit: 'مجلة' },
      { title: 'متوسط التحميلات', value: '1,240', unit: 'تحميل' },
    ]}
    items={[
      { id: 'pu1', title: 'سيميائية العلامة العربية', subtitle: 'مجلة دراسات سيميائية', status: 'منشور', meta: 'DOI: 10.xxxx/xx' },
      { id: 'pu2', title: 'نموذج صحة العلامة', subtitle: 'ورقة مؤتمر دولي', status: 'تحت المراجعة', meta: 'المؤتمر: BrandSci 2026' },
      { id: 'pu3', title: 'تقرير سنوي عن اتجاهات السوق', subtitle: 'تقرير مؤسسي', status: 'تحرير', meta: 'إصدار: ديسمبر 2026' },
      { id: 'pu4', title: 'كتاب: علم اجتماع العلامة', subtitle: 'كتاب أكاديمي', status: 'تجهيز', meta: 'الجزء الأول' },
    ]}
    detailFields={[
      { label: 'النوع', value: 'ورقة محكّمة' },
      { label: 'المؤلفون', value: '3 مؤلفين' },
      { label: 'القناة', value: 'مجلة دراسات سيميائية' },
      { label: 'تاريخ النشر', value: '15-03-2026' },
      { label: 'الترخيص', value: 'CC BY 4.0' },
    ]}
    actions={[
      { label: 'منشور جديد', icon: <Plus className="h-4 w-4" /> },
      { label: 'رفع PDF', icon: <Upload className="h-4 w-4" /> },
      { label: 'كتالوج المنشورات', icon: <BookOpen className="h-4 w-4" /> },
    ]}
    filterPlaceholder="ابحث عن منشور أو قناة نشر…"
  />
);
