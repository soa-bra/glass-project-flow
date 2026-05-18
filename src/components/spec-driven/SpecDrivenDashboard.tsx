/**
 * SpecDrivenDashboard
 * Generic spec-driven dashboard wrapper. Renders any APP_SPEC dashboard
 * (across any of the six workspaces) using TabRenderer.
 *
 * Visual chrome mirrors OperationsBoard exactly via DashboardLayout +
 * BaseTabContent, so every department / workspace dashboard shares the
 * same header, animated tab bar, scrollable container and reveal motion.
 *
 * @specRef Master spec — dashboards keyed by `dashboardKey`
 */
import React, { useMemo, useState } from 'react';
import { APP_SPEC } from '@/config/app-spec';
import { TabRenderer } from '@/components/box-kit';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { BaseTabContent } from '@/components/shared';

interface Props {
  dashboardKey: string;
}

export const SpecDrivenDashboard: React.FC<Props> = ({ dashboardKey }) => {
  const dashboard = useMemo(() => {
    for (const w of APP_SPEC.workspaces) {
      for (const d of w.dashboards as ReadonlyArray<any>) {
        if (d.key === dashboardKey) return d as { key: string; title: string; tabs: any[] };
      }
    }
    return undefined;
  }, [dashboardKey]);

  const tabs = useMemo(
    () => (dashboard?.tabs ?? []).map((t) => ({ value: t.code, label: t.name })),
    [dashboard],
  );
  const [activeTab, setActiveTab] = useState<string>(dashboard?.tabs[0]?.code ?? '');

  if (!dashboard) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        لا توجد مواصفة للوحة: {dashboardKey}
      </div>
    );
  }

  return (
    <DashboardLayout
      title={dashboard.title}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {dashboard.tabs.map((t) => (
        <BaseTabContent key={t.code} value={t.code}>
          <TabRenderer tab={t} />
        </BaseTabContent>
      ))}
    </DashboardLayout>
  );
};

export default SpecDrivenDashboard;
