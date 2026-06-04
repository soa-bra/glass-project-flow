/**
 * @specRef docs/specs/master-spec-ar.md — طبقات الهيدر واللوحات داخل واجهة إدارة المشاريع.
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeaderBar from '@/components/HeaderBar';
import { ProjectManagementBoard } from '@/components/ProjectManagement/ProjectManagementBoard';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ProjectTasksProvider } from '@/contexts/ProjectTasksContext';
import type { Project } from '@/types/project';
import '@/index.css';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signOut: vi.fn(),
  }),
}));

const demoProject: Project = {
  id: 'visual-z-test-project',
  title: 'مشروع اختبار الطبقات',
  description: 'لوحة مفتوحة لاختبار ظهور قوائم الهيدر فوقها دائماً.',
  daysLeft: 12,
  tasksCount: 8,
  status: 'success',
  date: '2026-06-04',
  owner: 'فريق الاختبار',
  value: '250000',
  isOverBudget: false,
  hasOverdueTasks: false,
  team: [{ name: 'سارة' }, { name: 'علي' }],
  progress: 72,
};

const getTokenValue = (name: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return Number(value);
};

const expectPopoverAbovePanels = (popover: HTMLElement) => {
  const popoverZ = getTokenValue('--z-popover');
  const sidebarZ = getTokenValue('--z-sidebar');
  const projectPanelZ = getTokenValue('--z-project-panel');
  const headerZ = getTokenValue('--z-header');

  expect(Number.isFinite(popoverZ)).toBe(true);
  expect(popoverZ).toBeGreaterThan(projectPanelZ);
  expect(popoverZ).toBeGreaterThan(sidebarZ);
  expect(popoverZ).toBeGreaterThan(headerZ);
  expect(popover).toHaveClass('z-popover');
};

const renderStackingScenario = () => render(
  <NavigationProvider>
    <ProjectTasksProvider>
      <div className="fixed z-sidebar" data-testid="sidebar-layer" />
      <ProjectManagementBoard
        project={demoProject}
        isVisible
        onClose={vi.fn()}
        isSidebarCollapsed={false}
      />
      <HeaderBar />
    </ProjectTasksProvider>
  </NavigationProvider>,
);

describe('Header overlay visual z-index contract', () => {
  it('opens search, notifications, messages, and user popovers above the project board and sidebar', async () => {
    renderStackingScenario();

    const board = screen.getByTestId('project-management-board');
    const sidebar = screen.getByTestId('sidebar-layer');
    const header = screen.getByTestId('app-header');

    expect(board).toHaveClass('z-project-panel');
    expect(board.style.zIndex).toBe('');
    expect(sidebar).toHaveClass('z-sidebar');
    expect(header).toHaveClass('z-popover');

    fireEvent.click(screen.getByLabelText('بحث'));
    await waitFor(() => expectPopoverAbovePanels(screen.getByTestId('header-search-popover')));

    fireEvent.click(screen.getByLabelText('الإشعارات'));
    await waitFor(() => expectPopoverAbovePanels(screen.getByTestId('header-notifications-popover')));

    fireEvent.click(screen.getByLabelText('الرسائل'));
    await waitFor(() => expectPopoverAbovePanels(screen.getByTestId('header-messages-popover')));
    fireEvent.mouseDown(screen.getByTestId('header-messages-popover'));

    fireEvent.click(screen.getByLabelText('المستخدم'));
    await waitFor(() => expectPopoverAbovePanels(screen.getByTestId('header-user-popover')));
  });
});