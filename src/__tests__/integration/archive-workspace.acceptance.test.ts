import { describe, expect, it, vi } from 'vitest';

vi.mock('@/services/central/projects.service', () => ({
  listProjects: vi.fn(async () => [
    { id: 'p1', name: 'Archived Alpha', description: 'legacy', state: 'archived' },
    { id: 'p2', name: 'Active Beta', description: 'active', state: 'active' },
  ]),
  getProject: vi.fn(async (id: string) => ({ id, name: 'Archived Alpha', description: 'legacy', state: 'archived' })),
  updateProject: vi.fn(async (id: string, payload: { name?: string; description?: string }) => ({ id, name: payload.name ?? 'Archived Alpha', description: payload.description ?? 'legacy', state: 'archived' })),
}));

import { archiveServiceContracts, archiveWorkspaceApi } from '@/api/archive';

const CATEGORIES = ['documents', 'projects', 'hr', 'financial', 'legal', 'organizational', 'knowledge', 'templates', 'policies'] as const;

describe('archive workspace acceptance', () => {
  it('defines a clear service contract for all nine categories with permission scopes', () => {
    for (const category of CATEGORIES) {
      const contract = archiveServiceContracts[category];
      expect(contract.category).toBe(category);
      expect(contract.permissions).toEqual(['archive:read', 'archive:export', 'archive:manage']);
      expect(contract.capabilities.headerActions).toEqual(['export']);
      expect(contract.capabilities.search).toBe(true);
      expect(contract.capabilities.recordsList).toBe(true);
    }

    expect(archiveServiceContracts.projects.recordSource).toBe('central-projects');
    for (const category of CATEGORIES.filter((c) => c !== 'projects')) {
      expect(archiveServiceContracts[category].recordSource).toBe('unified-archive');
    }
  });

  it('unifies header-actions/search/records-list behavior across categories', async () => {
    for (const category of CATEGORIES) {
      const api = archiveWorkspaceApi[category];
      const listed = await api.list();
      expect(Array.isArray(listed.data)).toBe(true);
      expect(typeof listed.total).toBe('number');

      const searched = await api.search({ q: 'archived' });
      expect(Array.isArray(searched.data)).toBe(true);

      const filtered = await api.filter({ filters: {} });
      expect(Array.isArray(filtered.data)).toBe(true);

      const exported = await api.export({ format: 'json' });
      expect(typeof exported).toBe('string');
    }
  });
});
