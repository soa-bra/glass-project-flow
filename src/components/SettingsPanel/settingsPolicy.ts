import { SETTINGS_ACCESS, SENSITIVE_TABS } from './settingsAccess';

export type SettingsTab = keyof typeof SETTINGS_ACCESS;

export const canReadSettingsTab = (tab: string, grants: Set<string>): boolean => {
  const policy = SETTINGS_ACCESS[tab];
  if (!policy) return false;
  return policy.read.some((p) => grants.has(p));
};

export const canWriteSettingsTab = (tab: string, grants: Set<string>): boolean => {
  const policy = SETTINGS_ACCESS[tab];
  if (!policy) return false;
  return policy.write.some((p) => grants.has(p));
};

export const isSensitiveSettingsTab = (tab: string): boolean => SENSITIVE_TABS.has(tab);
