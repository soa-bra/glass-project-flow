import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getUser: vi.fn(async () => ({ data: { user: { id: 'u1' } } })) },
    rpc: vi.fn(async () => ({ data: true, error: null })),
    from: vi.fn(() => ({ insert: vi.fn(async () => ({ error: null })) })),
  },
}));

describe('integration workflows', () => {
  beforeEach(() => localStorage.clear());

  it('task lifecycle path', async () => {
    const svc = await import('@/services/central/tasks.service');
    expect(typeof svc.listTasksByProject).toBe('function');
    expect(typeof svc.createTask).toBe('function');
    expect(typeof svc.updateTask).toBe('function');
    expect(typeof svc.deleteTask).toBe('function');
  });

  it('file permissions path', async () => {
    const { projectFilesService } = await import('@/services/projectFilesService');
    await projectFilesService.addFiles([{ name: 'a', type: 'document', size: '1 MB', uploadDate: '2026-01-01', classification: 'Low', version: 'v1', uploadedBy: 'u1', tags: [], projectId: 'p1' }]);
    const file = projectFilesService.getProjectFiles('p1')[0];
    await projectFilesService.setUserPermissions('u2', file.id, ['view', 'edit']);
    expect(projectFilesService.getUserPermissions('u2', file.id)).toContain('edit');
  });

  it('team assignment path via unified tasks mapping', async () => {
    const { mapFromTaskData } = await import('@/types/task');
    const mapped = mapFromTaskData({ id: 't1', title: 'x', assigned_to: 'member-1', linked_project_id: 'p1', created_at: '2026-01-01', updated_at: '2026-01-01', status: 'todo', priority: 'low' } as any);
    expect(mapped.assignee).toBe('member-1');
  });
});
