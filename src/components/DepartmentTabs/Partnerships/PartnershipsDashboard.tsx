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
      <p className="text-sm text-muted-foreground">مكوّن مرحلي لإدارة الشراكات حتى اكتمال التطوير.</p>
    </CardContent>
  </Card>
);

export const PartnershipsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'partners', label: 'الشركاء' },
    { value: 'opportunities', label: 'الفرص' },
    { value: 'agreements', label: 'الاتفاقيات' },
    { value: 'templates', label: 'النماذج' },
    { value: 'reports', label: 'التقارير' }
  ];

  return (
    <DashboardLayout title="إدارة الشراكات" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {tabs.map((tab) => (
        <BaseTabContent key={tab.value} value={tab.value}>
          <PlaceholderPanel title={tab.label} />
        </BaseTabContent>
      ))}
    </DashboardLayout>
  );
};
