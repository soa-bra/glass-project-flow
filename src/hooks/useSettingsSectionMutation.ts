import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsService, type ManagedSettingsSection } from '@/services/settings/settings.service';

export const useSettingsSectionMutation = (section: ManagedSettingsSection) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => SettingsService.saveSection(section, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings', section] });
    },
  });
};
