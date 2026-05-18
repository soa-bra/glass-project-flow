import React, { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PlaceholderPanel: React.FC<{ title: string }> = ({ title }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">مكوّن مرحلي لإدارة قاعدة المعرفة حتى اكتمال التطوير.</p>
    </CardContent>
  </Card>
);

export const KnowledgeBaseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'repository', label: 'المستودع' },
    { value: 'taxonomy', label: 'التصنيف' },
    { value: 'access', label: 'الصلاحيات' },
    { value: 'templates', label: 'النماذج' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <DashboardLayout title="إدارة قاعدة المعرفة" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {tabs.map((tab) => (
        <BaseTabContent key={tab.value} value={tab.value}>
          <PlaceholderPanel title={tab.label} />
        </BaseTabContent>
      ))}
    </DashboardLayout>
  );
};
