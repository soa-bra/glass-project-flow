/**
 * SpecSettingsShell — thin spec-compliant wrapper for legacy/technical settings
 * panels (engine-jobs, dependency-graph, tools-marketplace, admin-roles).
 * Provides breadcrumb + RTL chrome without altering the panel's internal logic.
 *
 * @specRef Section 8 (Settings Workspace) — P6 thin wrapper rule
 */
import React from 'react';
import { WorkspaceShell } from '@/components/shared/WorkspaceShell';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SpecSettingsShell: React.FC<Props> = ({ title, subtitle, children }) => (
  <WorkspaceShell
    title={title}
    subtitle={subtitle}
    crumbs={[
      { label: 'الإعدادات' },
      { label: title },
    ]}
  >
    <div className="p-6 h-full overflow-auto">{children}</div>
  </WorkspaceShell>
);
