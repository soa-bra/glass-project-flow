export type SaveState = 'loading' | 'saving' | 'saved' | 'error';

export const SETTINGS_ACCESS: Record<string, { read: string[]; write: string[] }> = {
  account: { read: ['settings.admin', 'settings.security'], write: ['settings.admin'] },
  security: { read: ['settings.security'], write: ['settings.security'] },
  notifications: { read: ['settings.admin'], write: ['settings.admin'] },
  integrations: { read: ['settings.admin'], write: ['settings.admin'] },
  ai: { read: ['settings.admin'], write: ['settings.admin'] },
  theme: { read: ['settings.admin', 'settings.security'], write: ['settings.admin'] },
  'data-governance': { read: ['settings.admin'], write: ['settings.admin'] },
  'users-roles': { read: ['settings.admin'], write: ['settings.admin'] },
  audit: { read: ['settings.security'], write: ['settings.security'] },
  'engine-jobs': { read: ['settings.admin'], write: ['settings.admin'] },
  'dependency-graph': { read: ['settings.admin'], write: ['settings.admin'] },
  'tools-marketplace': { read: ['settings.admin'], write: ['settings.admin'] },
  'admin-roles': { read: ['settings.admin'], write: ['settings.admin'] },
};

export const SENSITIVE_TABS = new Set(['security', 'users-roles', 'admin-roles', 'integrations', 'ai']);
