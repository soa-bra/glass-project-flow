# Zero-reference allowlist — 2026-05-05

مراجعة أولية لعناصر `zero-reference-candidates-2026-05-05.md` مع التركيز على: dynamic import، route lazy loading، و string-based registry.

## Allowlist (احتفاظ مبرّر)

- `src/hooks/useFileUpload.ts` — يستخدم Web Worker عبر `new URL('../workers/fileProcessor.worker.ts', import.meta.url)` (ربط ديناميكي وقت البناء/التشغيل).
- `src/workers/fileProcessor.worker.ts` — مستهدف مباشرة من dynamic worker bootstrap داخل `useFileUpload.ts`.
- `src/shared/events/handlers/project-handlers.ts` — يضيف handlers عبر `handlerRegistry.register({...})` ضمن registry-based wiring.
- `src/shared/events/handlers/cultural-handlers.ts` — يعتمد تسجيل handlers بالنمط نفسه (string/event-name keyed registration).
- `src/shared/events/handlers/hr-handlers.ts` — تسجيل handlers في global registry بدل استدعاء مرجعي مباشر.
- `src/shared/events/handlers/webhook-handlers.ts` — ربط webhook handlers يتم عبر registry registration وليس imports استهلاكية واضحة.
- `src/lib/api/smart-elements.ts` — مرتبط دومينيًا بـ smart element registry/element-type mapping المحتمل الاعتماد عليه كسجل string-based.
- `src/features/planning/integration/persistence/entityBindingRegistry.test.ts` — يغطي سلوك binding registry (string keys مثل `entity:task-*`) ويؤكد سلامة المسار غير المباشر.

## ready-for-delete-review

جميع العناصر المتبقية من تقرير المرشّحات (غير المذكورة في قسم allowlist أعلاه) لا يظهر لها — في هذه المراجعة الأولية — ارتباط واضح بـ dynamic import أو route lazy loading أو string-based registry، وتُوسم كالتالي:

- `ready-for-delete-review`: كل عنصر في `docs/reports/zero-reference-candidates-2026-05-05.md` باستثناء عناصر allowlist الثمانية أعلاه.

> ملاحظة: لا يوجد حذف في هذه المرحلة حسب الطلب؛ هذه فقط قائمة سماح أولية + وسم مراجعة للحذف.
