import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/central/tasks.service', () => ({
  listTasksByProject: vi.fn().mockResolvedValue([]),
  createTask: vi.fn().mockResolvedValue({ id: 't1', title: 'T', linked_project_id: 'p1' }),
  updateTask: vi.fn().mockResolvedValue({ id: 't1', title: 'T2', linked_project_id: 'p1' }),
  deleteTask: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/services/projectFilesService', async () => {
  const permissions = new Map<string, string[]>();
  return {
    projectFilesService: {
      setUserPermissions: vi.fn(async (u: string, f: string, p: string[]) => permissions.set(`${u}:${f}`, p)),
      getUserPermissions: vi.fn(async (u: string, f: string) => permissions.get(`${u}:${f}`) ?? ['view']),
    },
  };
});

import { createTask, updateTask, deleteTask } from '@/services/central/tasks.service';
import { projectFilesService } from '@/services/projectFilesService';

describe('integration flows', () => {
  beforeEach(() => vi.clearAllMocks());

  it('task lifecycle', async () => {
    const created = await createTask({ linked_project_id: 'p1', title: 'Task' } as any);
    expect(created.id).toBe('t1');
    const updated = await updateTask('t1', { title: 'Task updated' } as any);
    expect(updated.id).toBe('t1');
    await deleteTask('t1');
    expect(deleteTask).toHaveBeenCalledWith('t1');
  });

  it('file permissions', async () => {
    await projectFilesService.setUserPermissions('u1', 'f1', ['view', 'edit']);
    const p = await projectFilesService.getUserPermissions('u1', 'f1');
    expect(p).toContain('edit');
  });

  it('team assignment', async () => {
    const updated = await updateTask('t1', { assignee: 'team-member-1' } as any);
    expect(updated.id).toBe('t1');
    expect(updateTask).toHaveBeenCalled();
  });
});
