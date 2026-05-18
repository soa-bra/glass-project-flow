/**
 * SpecPreviewPage — wireframe preview of any tab from APP_SPEC.
 * Route: /spec-preview/:dashboardKey/:tabCode
 * Allows visual QA of spec-driven rendering across the 124 tabs without wiring data.
 *
 * @specRef Section 4.0.1 (Workspace Shell) + Section 6
 */
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { APP_SPEC } from '@/config/app-spec';
import { TabRenderer } from '@/components/box-kit';
import { WorkspaceShell } from '@/components/shared/WorkspaceShell';

export default function SpecPreviewPage() {
  const { dashboardKey, tabCode } = useParams<{ dashboardKey?: string; tabCode?: string }>();

  const allDashboards = useMemo(
    () => APP_SPEC.workspaces.flatMap((w) => w.dashboards.map((d) => ({ ...d, surface: w.surface }))),
    []
  );

  const dashboard = allDashboards.find((d) => d.key === dashboardKey);
  const tab = dashboard?.tabs.find((t) => t.code === tabCode);

  if (!dashboardKey) {
    return (
      <WorkspaceShell title="معاينة المواصفة" subtitle="اختر لوحة لاستعراض تبويباتها">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allDashboards.map((d) => (
            <Link
              key={d.key}
              to={`/spec-preview/${d.key}`}
              className="rounded-lg border border-border bg-card p-4 hover:border-foreground/30 transition-colors"
            >
              <div className="text-xs text-muted-foreground mb-1">{d.surface}</div>
              <div className="font-semibold text-foreground">{d.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{d.tabsCount} تبويب</div>
            </Link>
          ))}
        </div>
      </WorkspaceShell>
    );
  }

  if (!dashboard) {
    return (
      <WorkspaceShell title="غير موجود" crumbs={[{ label: 'معاينة المواصفة', href: '/spec-preview' }]}>
        <p className="text-sm text-muted-foreground">لم يتم العثور على لوحة بالمفتاح: {dashboardKey}</p>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell
      title={dashboard.title}
      subtitle={tab ? tab.name : `${dashboard.tabs.length} تبويب`}
      crumbs={[
        { label: 'معاينة المواصفة', href: '/spec-preview' },
        { label: dashboard.title, href: `/spec-preview/${dashboard.key}` },
        ...(tab ? [{ label: tab.name }] : []),
      ]}
      sidebar={
        <nav className="flex flex-col gap-1 p-3">
          {dashboard.tabs.map((t) => (
            <Link
              key={t.code}
              to={`/spec-preview/${dashboard.key}/${t.code}`}
              className={
                'rounded-md px-3 py-2 text-sm transition-colors ' +
                (t.code === tabCode
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground')
              }
            >
              {t.name}
              <span className="ms-1 text-[10px] opacity-60">({t.boxes.length})</span>
            </Link>
          ))}
        </nav>
      }
    >
      {tab ? (
        <TabRenderer tab={tab} />
      ) : (
        <p className="text-sm text-muted-foreground">اختر تبويباً من القائمة الجانبية.</p>
      )}
    </WorkspaceShell>
  );
}
