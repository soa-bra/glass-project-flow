# Zero-reference allowlist — 2026-05-05

مراجعة `zero-reference-candidates-2026-05-05.md` مع معيار صارم: **يدخل allowlist فقط ما لديه دليل تقني مباشر على الاستخدام غير المرئي في static import graph** (مثل dynamic import/worker bootstrap/registry registration).

## Allowlist (احتفاظ مبرّر)

- `src/hooks/useFileUpload.ts` — ينشئ Web Worker عبر `new URL('../workers/fileProcessor.worker.ts', import.meta.url)`؛ هذا مسار تحميل ديناميكي وقت البناء/التشغيل لا يظهر كمرجع استهلاكي تقليدي.
- `src/workers/fileProcessor.worker.ts` — سبب الإبقاء: مستخدم runtime داخل `src/hooks/useFileUpload.ts` عبر `new Worker(new URL('../workers/fileProcessor.worker.ts', import.meta.url))`. يتم تحميله في hook رفع الملفات، ثم يستقبل مهام `PROCESS_FILE` و`CHUNK_FILE` ضمن flow معالجة/رفع الملفات؛ لذلك لا يُعامل كملف صفري المرجع قابل للحذف.
- `src/shared/events/handlers/project-handlers.ts` — يربط handlers عبر `handlerRegistry.register(...)` (registry wiring بدلاً من direct call graph).
- `src/shared/events/handlers/cultural-handlers.ts` — يحتوي `handlerRegistry.register(...)` لنمط event-name keyed registration.
- `src/shared/events/handlers/hr-handlers.ts` — تسجيل handlers يتم عبر registry (`handlerRegistry.register(...)`) وليس عبر import استدعائي مباشر.
- `src/shared/events/handlers/webhook-handlers.ts` — يعتمد wiring عبر `handlerRegistry.register(...)` لربط webhook handlers بشكل غير مباشر.

## Worker audit — export/import/snap/file-processing

تم تحديث هذا التدقيق في 2026-05-07، وفُحصت المسارات التالية بحثًا عن `new Worker` و`new URL` وأسماء ملفات workers كسلاسل نصية، مع مراجعة استخدامات import/export/snap ورفع/معالجة الملفات. أوامر التدقيق المستخدمة في هذا المرور:

- `find src/workers -maxdepth 1 -type f -print | sort` للتحقق من ملفات workers الموجودة فعليًا؛ النتيجة الحالية تحتوي `src/workers/fileProcessor.worker.ts` فقط.
- `rg --files src/workers docs` للتحقق من وجود ملفات workers ومراجعها التوثيقية.
- `rg -n "new Worker|new URL" src docs` لحصر bootstrap runtime أو أمثلة التوثيق.
- `rg -n "fileProcessor\.worker\.ts|exportWorker\.ts|exportWorker\.js|importWorker\.ts|importWorker\.js|snapWorker\.ts|snapWorker\.js" src docs` لحصر أسماء الملفات كسلاسل نصية.
- `rg -n "export|import|snap|Snap|تصدير|استيراد|محاذاة" docs src/features src/hooks src/workers src/engine` لمراجعة references داخل docs أو flows الخاصة بـ export/import/snap.

| Worker | أدلة البحث (`new Worker` / `new URL` / string / flow) | التصنيف |
| --- | --- | --- |
| `src/workers/fileProcessor.worker.ts` | الملف موجود. يتم تحميله runtime من `src/hooks/useFileUpload.ts` عبر `new Worker(new URL('../workers/fileProcessor.worker.ts', import.meta.url), { type: 'module' })`، واسم الملف يظهر كسلسلة نصية في نفس bootstrap. flow رفع/معالجة الملفات يستدعيه برسائل `PROCESS_FILE` و`CHUNK_FILE`، والworker نفسه يعرّف أيضًا `ANALYZE_IMAGE` و`EXTRACT_TEXT`. | `allowlist-runtime-worker` |
| `src/workers/exportWorker.ts` | الملف غير موجود في الشجرة الحالية. لا يوجد تحميل runtime من `src`. ظهرت references توثيقية فقط: مثال `new Worker(new URL('../workers/exportWorker.ts', import.meta.url))` في `docs/PERFORMANCE_GUIDE.md`، ومثال قديم `new Worker('/workers/exportWorker.js')` في `docs/EXPORT_IMPORT.md`، وذكر عام في `docs/CURRENT_SYSTEM_SPECIFICATION.md`. لذلك لا يوجد ملف حالي لحذفه، ولا يُثبت البحث اعتماد flow runtime. | `defer-docs-only-reference` |
| `src/workers/importWorker.ts` | الملف غير موجود في الشجرة الحالية. لا يوجد `new Worker` أو `new URL` أو string reference داخل `src` لهذا الاسم، ولا توجد أدلة على تحميله في import flow؛ الذكر المتبقي عام في `docs/CURRENT_SYSTEM_SPECIFICATION.md`. | `defer-docs-only-reference` |
| `src/workers/snapWorker.ts` | الملف غير موجود في الشجرة الحالية. لا يوجد `new Worker` أو `new URL` أو string reference داخل `src` لهذا الاسم، ولا توجد أدلة على تحميله في snap flow؛ الذكر المتبقي عام في `docs/CURRENT_SYSTEM_SPECIFICATION.md`. | `defer-docs-only-reference` |

### نتيجة التصنيف التنفيذية

- `allowlist-runtime-worker`: `src/workers/fileProcessor.worker.ts` فقط.
- `delete-approved`: لا شيء في هذا المرور؛ لم يتم تأكيد أي worker موجود بلا تحميل runtime أو اعتماد وظيفي موثق.
- `defer-docs-only-reference`: `src/workers/exportWorker.ts`، و`src/workers/importWorker.ts`، و`src/workers/snapWorker.ts` بسبب غياب الملفات الحالية أو اقتصار الأدلة على مراجع docs فقط.

> قاعدة الحذف لهذا المرور: لا حذف لأي worker قبل ثبوت عدم وجود تحميل runtime أو اعتماد وظيفي موثق.

## Defer (غير مؤكّد — لا حذف)

العناصر التالية **تبقى defer** لأنها لا تملك حتى الآن دليلًا تقنيًا قاطعًا ضمن هذا المرور بأنها مرتبطة بـ dynamic import/registry wiring، وبالتالي لا تُنقل للـ allowlist ولا تُحذف:

- `src/lib/api/smart-elements.ts`
- `src/features/planning/integration/persistence/entityBindingRegistry.test.ts`
- جميع العناصر المتبقية من `docs/reports/zero-reference-candidates-2026-05-05.md` التي لم تُذكر في allowlist أعلاه.

> ملاحظة تنفيذية: لا يوجد حذف في هذه المرحلة؛ التصنيف هنا بين `allowlist` و`defer` فقط.
