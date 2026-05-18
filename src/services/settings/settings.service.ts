import { supabase } from '@/integrations/supabase/client';
import { withAuthorizationAndAudit } from '@/services/central/withAuthorizationAndAudit';

export type ManagedSettingsSection =
  | 'account'
  | 'security'
  | 'notifications'
  | 'integrations'
  | 'ai'
  | 'theme'
  | 'data-governance'
  | 'users-roles';

const PERMISSION_BY_SECTION: Record<ManagedSettingsSection, string> = {
  account: 'settings.admin',
  security: 'settings.security',
  notifications: 'settings.admin',
  integrations: 'settings.admin',
  ai: 'settings.admin',
  theme: 'settings.admin',
  'data-governance': 'settings.admin',
  'users-roles': 'settings.admin',
};

const saveSectionUnsafe = async (section: ManagedSettingsSection, payload: Record<string, unknown>) => {
  const { error } = await supabase
    .from('settings_state')
    .upsert({ section, payload, updated_at: new Date().toISOString() }, { onConflict: 'section' });
  if (error) throw error;
};

export const SettingsService = {
  saveSection: (section: ManagedSettingsSection, payload: Record<string, unknown>) =>
    withAuthorizationAndAudit(
      { permission: PERMISSION_BY_SECTION[section], resource_type: 'settings', action: `settings.${section}.save` },
      async () => saveSectionUnsafe(section, payload),
      { resolveResourceId: () => section, resolveMetadata: () => ({ section }) },
    )(),
};
