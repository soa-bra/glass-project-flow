export const emitSettingsAudit = (tab: string, action: string, payload: Record<string, unknown> = {}) => {
  const event = new CustomEvent('settings.audit', {
    detail: {
      tab,
      action,
      payload,
      at: new Date().toISOString(),
    },
  });
  window.dispatchEvent(event);
};
