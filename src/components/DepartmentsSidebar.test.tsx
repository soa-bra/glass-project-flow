import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DepartmentsSidebar from './DepartmentsSidebar';

describe('DepartmentsSidebar', () => {
  it('renders the refined departments list with active state and collapse controls', () => {
    const onDepartmentSelect = vi.fn();
    const onToggleCollapse = vi.fn();

    render(
      <DepartmentsSidebar
        selectedDepartment="crm"
        onDepartmentSelect={onDepartmentSelect}
        isCollapsed={false}
        onToggleCollapse={onToggleCollapse}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'قائمة الإدارات' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'الإدارات' })).toBeInTheDocument();

    const crmDepartment = screen.getByRole('button', { name: /إدارة علاقات العملاء/i });
    expect(crmDepartment).toHaveAttribute('aria-current', 'page');

    fireEvent.click(screen.getByRole('button', { name: /إدارة الشراكات/i }));
    expect(onDepartmentSelect).toHaveBeenCalledWith('partnerships');

    fireEvent.click(screen.getByRole('button', { name: 'طي قائمة الإدارات' }));
    expect(onToggleCollapse).toHaveBeenCalledWith(true);
  });

  it('keeps department names available as titles when collapsed', () => {
    render(
      <DepartmentsSidebar
        selectedDepartment={null}
        onDepartmentSelect={vi.fn()}
        isCollapsed
        onToggleCollapse={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'توسيع قائمة الإدارات' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTitle('إدارة العمليات المالية')).toBeInTheDocument();
  });
});
