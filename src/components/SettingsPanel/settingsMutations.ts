import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { emitSettingsAudit } from './auditTrail';
import { SETTINGS_POLICY, SENSITIVE_TABS } from './policies';

export const useSettingsMutation = (category: string, canWrite: boolean) => {
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const policy = SETTINGS_POLICY[category as keyof typeof SETTINGS_POLICY];
      if (!policy) throw new Error('Unknown settings category');
      if (!canWrite) throw new Error('Forbidden mutation by policy');
      const { error } = await supabase.from('workspace_settings').upsert({
        category,
        payload,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'category' });
      if (error) throw error;
      return payload;
    },
    onSuccess: () => {
      if (SENSITIVE_TABS.has(category)) emitSettingsAudit(category, 'mutation.commit', { sensitive: true });
    },
  });
};
