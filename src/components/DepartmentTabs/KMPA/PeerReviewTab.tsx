/**
 * KMPA — Peer Review tab.
 * @specRef KMPADashboard.peer-review (boxes 1–4)
 */
import React from 'react';
import { SpecTabScaffold } from '../shared/SpecTabScaffold';
import { ShieldCheck, Plus, MessageSquare } from 'lucide-react';

export const PeerReviewTab: React.FC = () => (
  <SpecTabScaffold
    intro={{
      title: 'التحكيم والمراجعة',
      description: 'متابعة المراجعات العلمية، الملاحظات، والاعتمادات',
      accent: '#f1b5b9',
    }}
    kpis={[
      { title: 'مراجعات نشطة', value: 11, unit: 'مراجعة' },
      { title: 'بانتظار محكِّم', value: 3, unit: 'ملف' },
      { title: 'متوسط زمن التحكيم', value: '21', unit: 'يوم' },
    ]}
    items={[
      { id: 'pr1', title: 'تحكيم: نموذج صحة العلامة', subtitle: '3 محكِّمين', status: 'جارية', meta: 'الموعد: 28-05-2026' },
      { id: 'pr2', title: 'تحكيم: مسح اتجاهات المستهلك', subtitle: 'محكِّم خارجي', status: 'بانتظار محكِّم', meta: 'مرشحون: 2' },
      { id: 'pr3', title: 'مراجعة كتاب: علم اجتماع العلامة', subtitle: 'مراجعة أكاديمية', status: 'ملاحظات مرسلة', meta: 'الجولة الثانية' },
      { id: 'pr4', title: 'تحكيم ورقة مؤتمر BrandSci', subtitle: 'مراجعة سريعة', status: 'معتمد', meta: 'بدون تعديلات' },
    ]}
    detailFields={[
      { label: 'الحالة', value: 'جارية' },
      { label: 'عدد المحكِّمين', value: '3' },
      { label: 'الجولة', value: 'الأولى' },
      { label: 'الموعد النهائي', value: '28-05-2026' },
      { label: 'المنسق', value: 'محرر القسم العلمي' },
    ]}
    actions={[
      { label: 'إسناد محكِّم', icon: <Plus className="h-4 w-4" /> },
      { label: 'إرسال ملاحظات', icon: <MessageSquare className="h-4 w-4" /> },
      { label: 'اعتماد نهائي', icon: <ShieldCheck className="h-4 w-4" /> },
    ]}
    filterPlaceholder="ابحث عن مراجعة أو محكِّم…"
  />
);
