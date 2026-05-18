/**
 * SpecDrivenDepartmentDashboard
 * Thin wrapper that renders any department dashboard directly from APP_SPEC
 * using TabRenderer. Used for BCM, Partnerships, Knowledge until full feature
 * implementations land.
 *
 * @specRef Section 6 (Departments) — driven by dashboardKey lookup
 */
import React, { useMemo, useState } from 'react';
import { APP_SPEC } from '@/config/app-spec';
import { TabRenderer } from '@/components/box-kit';

interface Props {
  dashboardKey: string;
}

export const SpecDrivenDepartmentDashboard: React.FC<Props> = ({ dashboardKey }) => {
  const dashboard = useMemo(
    () =>
      APP_SPEC.workspaces
        .flatMap((w) => w.dashboards)
        .find((d) => d.key === dashboardKey),
    [dashboardKey],
  );

  const [activeCode, setActiveCode] = useState<string | undefined>(
    dashboard?.tabs[0]?.code,
  );

  if (!dashboard) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        لا توجد مواصفة للوحة: {dashboardKey}
      </div>
    );
  }

  const tab = dashboard.tabs.find((t) => t.code === activeCode) ?? dashboard.tabs[0];

  return (
    <div className="flex flex-col h-full overflow-hidden" dir="rtl">
      <header className="px-6 py-4 border-b border-border bg-card">
        <h1 className="text-xl font-semibold text-foreground">{dashboard.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">{dashboard.tabs.length} تبويب</p>
      </header>
      <nav className="flex gap-1 overflow-x-auto px-4 py-2 border-b border-border bg-muted/30">
        {dashboard.tabs.map((t) => (
          <button
            key={t.code}
            onClick={() => setActiveCode(t.code)}
            className={
              'rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors ' +
              (t.code === tab.code
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground')
            }
          >
            {t.name}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-auto p-4">
        <TabRenderer tab={tab} />
      </div>
    </div>
  );
};

export default SpecDrivenDepartmentDashboard;
