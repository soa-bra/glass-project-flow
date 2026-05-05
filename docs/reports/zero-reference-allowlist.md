# Zero-reference allowlist — 2026-05-05

مراجعة `zero-reference-candidates-2026-05-05.md` مع معيار صارم: **يدخل allowlist فقط ما لديه دليل تقني مباشر على الاستخدام غير المرئي في static import graph** (مثل dynamic import/worker bootstrap/registry registration).

## Allowlist (احتفاظ مبرّر)

- `src/hooks/useFileUpload.ts` — ينشئ Web Worker عبر `new URL('../workers/fileProcessor.worker.ts', import.meta.url)`؛ هذا مسار تحميل ديناميكي وقت البناء/التشغيل لا يظهر كمرجع استهلاكي تقليدي.
- `src/workers/fileProcessor.worker.ts` — هو target مباشر لمسار worker الديناميكي القادم من `useFileUpload.ts`.
- `src/shared/events/handlers/project-handlers.ts` — يربط handlers عبر `handlerRegistry.register(...)` (registry wiring بدلاً من direct call graph).
- `src/shared/events/handlers/cultural-handlers.ts` — يحتوي `handlerRegistry.register(...)` لنمط event-name keyed registration.
- `src/shared/events/handlers/hr-handlers.ts` — تسجيل handlers يتم عبر registry (`handlerRegistry.register(...)`) وليس عبر import استدعائي مباشر.
- `src/shared/events/handlers/webhook-handlers.ts` — يعتمد wiring عبر `handlerRegistry.register(...)` لربط webhook handlers بشكل غير مباشر.

## Defer (غير مؤكّد — لا حذف)

العناصر التالية **تبقى defer** لأنها لا تملك حتى الآن دليلًا تقنيًا قاطعًا ضمن هذا المرور بأنها مرتبطة بـ dynamic import/registry wiring، وبالتالي لا تُنقل للـ allowlist ولا تُحذف:

- `src/lib/api/smart-elements.ts`
- `src/features/planning/integration/persistence/entityBindingRegistry.test.ts`
- جميع العناصر المتبقية من `docs/reports/zero-reference-candidates-2026-05-05.md` التي لم تُذكر في allowlist أعلاه.

> ملاحظة تنفيذية: لا يوجد حذف في هذه المرحلة؛ التصنيف هنا بين `allowlist` و `defer` فقط.
