/**
 * isAuthBypassEnabled — مصدر وحيد لقرار تجاوز المصادقة في بيئة التطوير/المعاينة.
 *
 * يُفعَّل التجاوز إذا تحققت أي من الحالات التالية، شرط أن نكون في DEV:
 *  1) متغيّر البيئة VITE_DISABLE_AUTH=true.
 *  2) المضيف الحالي ضمن نطاقات معاينة Lovable (*.lovable.app / lovableproject.com / localhost).
 *
 * import.meta.env.DEV يضمن استحالة التفعيل في build إنتاجي.
 */
export function isAuthBypassEnabled(): boolean {
  if (!import.meta.env.DEV) return false;

  if (import.meta.env.VITE_DISABLE_AUTH === "true") return true;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".lovable.app") ||
      host.endsWith(".lovableproject.com")
    ) {
      return true;
    }
  }

  return false;
}
