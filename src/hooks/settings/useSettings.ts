/**
 * React Query bindings for user_settings.
 * @specRef Section 8 (Settings Workspace)
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  settingsService,
  type SettingsCategory,
} from '@/services/settings/settingsService';

export const settingsKeys = {
  category: (c: SettingsCategory) => ['settings', c] as const,
};

export function useSettings(category: SettingsCategory) {
  return useQuery({
    queryKey: settingsKeys.category(category),
    queryFn: () => settingsService.get(category),
  });
}

export function useUpsertSettings(category: SettingsCategory) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      settingsService.upsert(category, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.category(category) }),
  });
}
