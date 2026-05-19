/**
 * Settings Service — central CRUD for `public.user_settings`.
 * One row per (user, category) with a JSONB payload.
 *
 * @specRef Section 8 (Settings Workspace) — 13 categories
 */
import { supabase } from '@/integrations/supabase/client';
import { audit } from '@/services/audit';
import { z } from 'zod';

export const settingsCategorySchema = z.enum([
  'account',
  'security',
  'notifications',
  'integrations',
  'ai',
  'theme',
  'data-governance',
  'users-roles',
  'audit',
  'engine-jobs',
  'dependency-graph',
  'tools-marketplace',
  'admin-roles',
]);
export type SettingsCategory = z.infer<typeof settingsCategorySchema>;

export interface UserSettingsRow {
  id: string;
  user_id: string;
  category: string;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export const settingsService = {
  async get(category: SettingsCategory): Promise<UserSettingsRow | null> {
    const uid = await currentUserId();
    if (!uid) return null;
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', uid)
      .eq('category', category)
      .maybeSingle();
    if (error) throw error;
    return (data as UserSettingsRow) ?? null;
  },

  async upsert(
    category: SettingsCategory,
    payload: Record<string, unknown>,
  ): Promise<UserSettingsRow> {
    const uid = await currentUserId();
    if (!uid) throw new Error('Not signed in');
    settingsCategorySchema.parse(category);

    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        [{ user_id: uid, category, payload }],
        { onConflict: 'user_id,category' },
      )
      .select('*')
      .single();
    if (error) {
      await audit({
        resource_type: 'user_settings',
        action: 'settings.upsert',
        resource_id: category,
        decision: 'error',
        metadata: { error: error.message },
      });
      throw error;
    }
    await audit({
      resource_type: 'user_settings',
      action: 'settings.upsert',
      resource_id: category,
      decision: 'allowed',
    });
    return data as UserSettingsRow;
  },
};
