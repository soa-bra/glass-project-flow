/**
 * @specRef docs/specs/master-spec-ar.md — طبقات الهيدر واللوحات داخل واجهة إدارة المشاريع.
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import HeaderBar from '@/components/HeaderBar';
import { ProjectManagementBoard } from '@/components/ProjectManagement';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ProjectTasksProvider } from '@/contexts/ProjectTasksContext';
import type { Project } from '@/types/project';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signOut: vi.fn(),
  }),
}));

vi.mock('@/components/ProjectManagement/ProjectProgressBar', () => ({
  ProjectProgressBar: () => <div data-testid="project-progress-bar" />,
}));

vi.mock('@/components/ProjectManagement/ProjectCardGrid', () => ({
  ProjectCardGrid: () => <div data-testid="project-card-grid" />,
}));

vi.mock('@/components/ProjectsColumn/AddProjectModal', () => ({
  AddProjectModal: () => null,
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

const zIndexTokenSource = readFileSync('src/styles/z-index.css', 'utf8');

const getTokenValue = (name: string) => {
  const match = zIndexTokenSource.match(new RegExp(`${name}:\\s*(\\d+);`));
  return match ? Number(match[1]) : Number.NaN;
};

const expectPopoverAbovePanels = (popover: HTMLElement, expectedZIndex = 'var(--z-popover)') => {
  const popoverZ = getTokenValue('--z-popover');
  const modalBackdropZ = getTokenValue('--z-modal-backdrop');
  const sidebarZ = getTokenValue('--z-sidebar');
  const projectPanelZ = getTokenValue('--z-project-panel');
  const headerZ = getTokenValue('--z-header');

  expect(Number.isFinite(popoverZ)).toBe(true);
  expect(Number.isFinite(modalBackdropZ)).toBe(true);
  expect(popoverZ).toBeGreaterThan(projectPanelZ);
  expect(popoverZ).toBeGreaterThan(sidebarZ);
  expect(popoverZ).toBeGreaterThan(headerZ);
  expect(modalBackdropZ).toBeGreaterThan(popoverZ);
  expect(popover.style.zIndex).toBe(expectedZIndex);
};

const expectPortaledOutsideHeader = (header: HTMLElement, popover: HTMLElement) => {
  expect(header.contains(popover)).toBe(false);
  expect(document.body.contains(popover)).toBe(true);
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
  it('portals search, notifications, messages, and user overlays above the project board and sidebar', async () => {
    renderStackingScenario();

    const board = screen.getByTestId('project-management-board');
    const sidebar = screen.getByTestId('sidebar-layer');
    const header = screen.getByTestId('app-header');

    expect(board).toHaveClass('z-project-panel');
    expect(board.style.zIndex).toBe('');
    expect(sidebar).toHaveClass('z-sidebar');
    expect(header.style.zIndex).toBe('var(--z-header)');

    fireEvent.click(screen.getByLabelText('بحث'));
    await waitFor(() => {
      const popover = screen.getByTestId('header-search-popover');
      expectPopoverAbovePanels(popover);
      expectPortaledOutsideHeader(header, popover);
    });

    fireEvent.click(screen.getByLabelText('الإشعارات'));
    await waitFor(() => {
      const popover = screen.getByTestId('header-notifications-popover');
      expectPopoverAbovePanels(popover);
      expectPortaledOutsideHeader(header, popover);
    });

    fireEvent.click(screen.getByLabelText('الرسائل'));
    await waitFor(() => {
      const popover = screen.getByTestId('header-messages-popover');
      expectPopoverAbovePanels(popover, 'var(--z-modal-backdrop)');
      expectPortaledOutsideHeader(header, popover);
    });
    fireEvent.mouseDown(screen.getByTestId('header-messages-popover'));

    fireEvent.click(screen.getByLabelText('المستخدم'));
    await waitFor(() => {
      const popover = screen.getByTestId('header-user-popover');
      expectPopoverAbovePanels(popover);
      expectPortaledOutsideHeader(header, popover);
    });
  });
});
