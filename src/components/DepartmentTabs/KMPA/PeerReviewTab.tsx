/**
 * KMPA — Peer Review tab (data-bound).
 * @specRef KMPADashboard.peer-review
 */
import React from 'react';
import { DataBoundSpecTab } from '../shared/DataBoundSpecTab';

export const PeerReviewTab: React.FC = () => (
  <DataBoundSpecTab
    departmentCode="KMPA"
    tabKey="peer-review"
    intro={{ title: 'التحكيم والمراجعة', description: 'متابعة المراجعات العلمية، الملاحظات، والاعتمادات', accent: '#f1b5b9' }}
    kpis={[
      { title: 'مراجعات نشطة', value: 11, unit: 'مراجعة' },
      { title: 'بانتظار محكِّم', value: 3, unit: 'ملف' },
      { title: 'متوسط زمن التحكيم', value: '21', unit: 'يوم' },
    ]}
    detailFields={[
      { key: 'status', label: 'الحالة' },
      { key: 'reviewers', label: 'عدد المحكِّمين' },
      { key: 'round', label: 'الجولة' },
      { key: 'deadline', label: 'الموعد النهائي' },
      { key: 'coordinator', label: 'المنسق' },
    ]}
    filterPlaceholder="ابحث عن مراجعة أو محكِّم…"
  />
);
