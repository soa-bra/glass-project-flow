/**
 * isAuthBypassEnabled — معطّل دائمًا.
 * كل الوصول للتطبيق يجب أن يمر عبر /auth وجلسة Supabase فعلية.
 */
export function isAuthBypassEnabled(): boolean {
  return false;
}
