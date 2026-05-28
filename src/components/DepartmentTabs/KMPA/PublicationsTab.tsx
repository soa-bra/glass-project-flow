/**
 * KMPA — Publications tab (data-bound).
 * @specRef KMPADashboard.publications
 */
import React from 'react';
import { DataBoundSpecTab } from '../shared/DataBoundSpecTab';

export const PublicationsTab: React.FC = () => (
  <DataBoundSpecTab
    departmentCode="KMPA"
    tabKey="publications"
    intro={{ title: 'النشر', description: 'إدارة المنشورات، قنوات النشر، الحالات، والروابط المرجعية', accent: '#bdeed3' }}
    kpis={[
      { title: 'منشورات هذا العام', value: 17, unit: 'منشور' },
      { title: 'مجلات محكّمة', value: 6, unit: 'مجلة' },
      { title: 'متوسط التحميلات', value: '1,240' },
    ]}
    detailFields={[
      { key: 'type', label: 'النوع' },
      { key: 'authors', label: 'المؤلفون' },
      { key: 'channel', label: 'القناة' },
      { key: 'publish_date', label: 'تاريخ النشر' },
      { key: 'license', label: 'الترخيص' },
    ]}
    filterPlaceholder="ابحث عن منشور أو قناة نشر…"
  />
);
