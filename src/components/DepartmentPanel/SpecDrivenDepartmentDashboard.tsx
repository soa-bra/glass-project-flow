/**
 * SpecDrivenDepartmentDashboard
 * Department-scoped wrapper that delegates rendering to the shared
 * SpecDrivenDashboard so departments share OperationsBoard chrome
 * (DashboardLayout + AnimatedTabs + reveal motion).
 *
 * @specRef Section 6 (Departments) — driven by dashboardKey lookup
 */
import React from 'react';
import { SpecDrivenDashboard } from '@/components/spec-driven/SpecDrivenDashboard';

interface Props {
  dashboardKey: string;
}

export const SpecDrivenDepartmentDashboard: React.FC<Props> = ({ dashboardKey }) => (
  <SpecDrivenDashboard dashboardKey={dashboardKey} />
);

export default SpecDrivenDepartmentDashboard;
