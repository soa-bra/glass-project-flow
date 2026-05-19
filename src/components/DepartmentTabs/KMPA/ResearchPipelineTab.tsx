/**
 * KMPA — Research Pipeline tab.
 * @specRef KMPADashboard.research-pipeline (boxes 1–4)
 */
import React from 'react';
import { SpecTabScaffold } from '../shared/SpecTabScaffold';
import { FlaskConical, Plus, GitBranch } from 'lucide-react';

export const ResearchPipelineTab: React.FC = () => (
  <SpecTabScaffold
    intro={{
      title: 'مسار الأبحاث',
      description: 'إدارة أفكار الأبحاث ومراحلها واعتمادها ومخرجاتها',
      accent: '#a4e2f6',
    }}
    kpis={[
      { title: 'أبحاث نشطة', value: 22, unit: 'بحث' },
      { title: 'في مرحلة التصميم', value: 8, unit: 'بحث' },
      { title: 'بانتظار الاعتماد', value: 4, unit: 'بحث' },
    ]}
    items={[
      { id: 'rp1', title: 'دراسة تأثير العلامة على الولاء', subtitle: 'كمي + كيفي', status: 'تنفيذ', meta: 'الباحث: د. سالم' },
      { id: 'rp2', title: 'مسح اتجاهات المستهلك 2026', subtitle: 'مسح وطني', status: 'تصميم', meta: 'الباحث: د. ريم' },
      { id: 'rp3', title: 'تحليل خطاب العلامة في وسائل التواصل', subtitle: 'تحليل لغوي', status: 'مراجعة', meta: 'بانتظار اعتماد' },
      { id: 'rp4', title: 'نموذج قياس صحة العلامة', subtitle: 'نموذج مفاهيمي', status: 'فكرة', meta: 'مقترح جديد' },
    ]}
    detailFields={[
      { label: 'الحالة', value: 'تنفيذ' },
      { label: 'النوع', value: 'كمي/كيفي مختلط' },
      { label: 'المالك', value: 'فريق البحث العلمي' },
      { label: 'المهلة', value: '30-09-2026' },
      { label: 'مخرج متوقع', value: 'ورقة محكّمة + ملخص تنفيذي' },
    ]}
    actions={[
      { label: 'فكرة بحث', icon: <Plus className="h-4 w-4" /> },
      { label: 'تحريك مرحلة', icon: <GitBranch className="h-4 w-4" /> },
      { label: 'فتح مختبر البيانات', icon: <FlaskConical className="h-4 w-4" /> },
    ]}
    filterPlaceholder="ابحث في مسار الأبحاث…"
  />
);
