/**
 * KMPA — Research Pipeline tab (data-bound).
 * @specRef KMPADashboard.research-pipeline
 */
import React from 'react';
import { DataBoundSpecTab } from '../shared/DataBoundSpecTab';

export const ResearchPipelineTab: React.FC = () => (
  <DataBoundSpecTab
    departmentCode="KMPA"
    tabKey="research-pipeline"
    intro={{ title: 'مسار الأبحاث', description: 'إدارة أفكار الأبحاث ومراحلها واعتمادها ومخرجاتها', accent: '#a4e2f6' }}
    kpis={[
      { title: 'أبحاث نشطة', value: 22, unit: 'بحث' },
      { title: 'في مرحلة التصميم', value: 8, unit: 'بحث' },
      { title: 'بانتظار الاعتماد', value: 4, unit: 'بحث' },
    ]}
    detailFields={[
      { key: 'stage', label: 'الحالة' },
      { key: 'type', label: 'النوع' },
      { key: 'owner', label: 'المالك' },
      { key: 'deadline', label: 'المهلة' },
      { key: 'expected_output', label: 'مخرج متوقع', kind: 'textarea' },
    ]}
    filterPlaceholder="ابحث في مسار الأبحاث…"
  />
);
