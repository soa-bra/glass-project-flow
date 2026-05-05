/**
 * Sentry hook — نقطة ربط مركزية لإرسال الأخطاء إلى Sentry/أي transport.
 *
 * الحالة الافتراضية: no-op. عند إضافة `VITE_SENTRY_DSN`، يقوم
 * `WorkspaceErrorBoundary` و alle هندلرز الخطأ باستدعاء `reportError()`.
 *
 * تفعيل لاحق:
 *   1) `bun add @sentry/react`
 *   2) ضبط `VITE_SENTRY_DSN` في `.env`
 *   3) استبدال جسم `init()` و `reportError()` باستدعاءات `Sentry.init` / `Sentry.captureException`.
 */
type ErrorContext = Record<string, unknown> | undefined;

let initialized = false;

export function init(): void {
  if (initialized) return;
  initialized = true;
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) {
    // eslint-disable-next-line no-console
    console.info("[sentry] DSN غير مضبوط — تشغيل في وضع no-op.");
    return;
  }
  // TODO: استبدل بـ Sentry.init({ dsn, tracesSampleRate: 0.1 }) بعد تثبيت @sentry/react.
  // eslint-disable-next-line no-console
  console.info("[sentry] DSN موجود — جاهز للربط بـ @sentry/react.");
}

export function reportError(error: unknown, context?: ErrorContext): void {
  // Fallback آمن: log فقط حتى يُربط Sentry فعليًا.
  // eslint-disable-next-line no-console
  console.error("[reportError]", error, context ?? {});
}

export const Telemetry = { init, reportError };
