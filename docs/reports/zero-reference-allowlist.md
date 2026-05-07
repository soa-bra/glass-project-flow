# Zero-reference allowlist — 2026-05-05

مراجعة `zero-reference-candidates-2026-05-05.md` مع معيار صارم: **يدخل allowlist فقط ما لديه دليل تقني مباشر على الاستخدام غير المرئي في static import graph** (مثل dynamic import/worker bootstrap/registry registration).

## Allowlist (احتفاظ مبرّر)

> معيار الإضافة: كل إدخال أدناه يملك سببًا تقنيًا مباشرًا يفسّر لماذا قد يظهر كـ zero-reference في أدوات static graph رغم أنه مستخدم فعليًا أو مرتبط عبر wiring غير مباشر. لا تُقبل عبارات عامة مثل "قد يكون مستخدمًا" بدون نمط تحميل/تسجيل محدد.

| الملف | نوع الاستخدام غير المرئي | السبب التقني للإبقاء | بوابة التحقق المقترنة |
| --- | --- | --- | --- |
| `src/hooks/useFileUpload.ts` | Runtime worker bootstrap | هذا hook هو نقطة إنشاء الـ Web Worker عبر `new Worker(new URL('../workers/fileProcessor.worker.ts', import.meta.url), { type: 'module' })`. بعض أدوات unused-file قد ترى أن علاقته بالـ worker ليست importًا تقليديًا، لكن Vite يحول هذا النمط إلى asset/chunk محمل وقت التشغيل. | `rg -n "new Worker|fileProcessor\.worker\.ts" src/hooks src/workers` ثم مراجعة نتائج `npx knip --production --reporter compact`. |
| `src/workers/fileProcessor.worker.ts` | Runtime-loaded worker module | لا يُستورد هذا الملف بـ `import` مباشر لأنه entrypoint مستقل للـ Worker. يُحمّل من `src/hooks/useFileUpload.ts`، ويعالج رسائل `PROCESS_FILE` و`CHUNK_FILE` و`ANALYZE_IMAGE` و`EXTRACT_TEXT` خارج الخيط الرئيسي؛ لذلك يجب اعتباره dependency وقت تشغيل لا dead file. آخر تحقق في 2026-05-07 أكد أنه ملف الـ worker الوحيد الموجود تحت `src/workers/`. | `find src/workers -maxdepth 1 -type f -print | sort` و`rg -n "PROCESS_FILE|CHUNK_FILE|ANALYZE_IMAGE|EXTRACT_TEXT" src/hooks src/workers`. |
| `src/shared/events/handlers/project-handlers.ts` | Registry registration | يربط project handlers عبر `handlerRegistry.register(...)`، أي إن الاستدعاء يحدث عبر event-name keyed registry وليس عبر direct call graph؛ أدوات unused exports قد لا تربط التسجيل بالاستهلاك. | `rg -n "handlerRegistry\.register" src/shared/events/handlers src/shared/events`. |
| `src/shared/events/handlers/cultural-handlers.ts` | Registry registration | يحتوي cultural event handlers مسجلة بمفاتيح event داخل `handlerRegistry.register(...)`. هذا نمط plugin/registry wiring لا يظهر دائمًا كاستدعاء مباشر للـ exports. | `rg -n "handlerRegistry\.register" src/shared/events/handlers src/shared/events`. |
| `src/shared/events/handlers/hr-handlers.ts` | Registry registration | يسجل HR handlers داخل registry مركزي، ثم يتم حلها حسب نوع الحدث وقت التشغيل؛ لذلك قد تظهر exports كغير مستخدمة إذا اعتمدت الأداة على static import/call graph فقط. | `rg -n "handlerRegistry\.register" src/shared/events/handlers src/shared/events`. |
| `src/shared/events/handlers/webhook-handlers.ts` | Registry registration | webhook handlers مرتبطة عبر `handlerRegistry.register(...)` لمعالجة أحداث webhook بالاسم/النوع، وليس عبر import يستدعي function مباشرة؛ الإبقاء مشروط ببقاء التسجيل الفعلي. | `rg -n "handlerRegistry\.register" src/shared/events/handlers src/shared/events`. |

### Runtime-loaded files

الملفات المحملة runtime لا تُحذف لمجرد غياب direct import؛ يجب إثبات غياب bootstrap/URL/string reference أولًا. القائمة الحالية:

- `src/workers/fileProcessor.worker.ts` — Worker module محمّل عبر `new URL('../workers/fileProcessor.worker.ts', import.meta.url)` من `src/hooks/useFileUpload.ts` لمعالجة الملفات والتقطيع وإنشاء thumbnails خارج main thread.

## Worker audit — export/import/snap/file-processing

تم تحديث هذا التدقيق في 2026-05-07، وفُحصت المسارات التالية بحثًا عن `new Worker` و`new URL` وأسماء ملفات workers كسلاسل نصية، مع مراجعة استخدامات import/export/snap ورفع/معالجة الملفات. أوامر التدقيق المستخدمة في هذا المرور:

- `find src/workers -maxdepth 1 -type f -print | sort` للتحقق من ملفات workers الموجودة فعليًا؛ النتيجة الحالية تحتوي `src/workers/fileProcessor.worker.ts` فقط.
- `rg --files src/workers docs` للتحقق من وجود ملفات workers ومراجعها التوثيقية.
- `rg -n "new Worker|new URL" src docs` لحصر bootstrap runtime أو أمثلة التوثيق.
- `rg -n "fileProcessor\.worker\.ts|exportWorker\.ts|exportWorker\.js|importWorker\.ts|importWorker\.js|snapWorker\.ts|snapWorker\.js" src docs` لحصر أسماء الملفات كسلاسل نصية.
- `rg -n "export|import|snap|Snap|تصدير|استيراد|محاذاة" docs src/features src/hooks src/workers src/engine` لمراجعة references داخل docs أو flows الخاصة بـ export/import/snap.

| Worker | أدلة البحث (`new Worker` / `new URL` / string / flow) | التصنيف |
| --- | --- | --- |
| `src/workers/fileProcessor.worker.ts` | الملف موجود. يتم تحميله runtime من `src/hooks/useFileUpload.ts` عبر `new Worker(new URL('../workers/fileProcessor.worker.ts', import.meta.url), { type: 'module' })`، واسم الملف يظهر كسلسلة نصية في نفس bootstrap. flow رفع/معالجة الملفات يستدعيه برسائل `PROCESS_FILE` و`CHUNK_FILE`، والworker نفسه يعرّف أيضًا `ANALYZE_IMAGE` و`EXTRACT_TEXT`. | `allowlist-runtime` |
| `src/workers/exportWorker.ts` | الملف غير موجود في الشجرة الحالية. لا يوجد تحميل runtime من `src`. ظهرت references توثيقية فقط: مثال `new Worker(new URL('../workers/exportWorker.ts', import.meta.url))` في `docs/PERFORMANCE_GUIDE.md`، ومثال قديم `new Worker('/workers/exportWorker.js')` في `docs/EXPORT_IMPORT.md`، وذكر عام في `docs/CURRENT_SYSTEM_SPECIFICATION.md`. لذلك لا يوجد ملف حالي لحذفه، ولا يُثبت البحث اعتماد flow runtime. | `defer-docs-only-reference` |
| `src/workers/importWorker.ts` | الملف غير موجود في الشجرة الحالية. لا يوجد `new Worker` أو `new URL` أو string reference داخل `src` لهذا الاسم، ولا توجد أدلة على تحميله في import flow؛ الذكر المتبقي عام في `docs/CURRENT_SYSTEM_SPECIFICATION.md`. | `defer-docs-only-reference` |
| `src/workers/snapWorker.ts` | الملف غير موجود في الشجرة الحالية. لا يوجد `new Worker` أو `new URL` أو string reference داخل `src` لهذا الاسم، ولا توجد أدلة على تحميله في snap flow؛ الذكر المتبقي عام في `docs/CURRENT_SYSTEM_SPECIFICATION.md`. | `defer-docs-only-reference` |

### نتيجة التصنيف التنفيذية

- `allowlist-runtime`: `src/workers/fileProcessor.worker.ts` فقط.
- `delete-approved`: لا شيء في هذا المرور؛ لم يتم تأكيد أي worker موجود بلا تحميل runtime أو اعتماد وظيفي موثق.
- `defer-docs-only-reference`: `src/workers/exportWorker.ts`، و`src/workers/importWorker.ts`، و`src/workers/snapWorker.ts` بسبب غياب الملفات الحالية أو اقتصار الأدلة على مراجع docs فقط.

> قاعدة الحذف لهذا المرور: لا حذف لأي worker قبل ثبوت عدم وجود تحميل runtime أو اعتماد وظيفي موثق.

## Defer (غير مؤكّد — لا حذف)

العناصر التالية **تبقى defer** لأنها لا تملك حتى الآن دليلًا تقنيًا قاطعًا ضمن هذا المرور بأنها مرتبطة بـ dynamic import/registry wiring، وبالتالي لا تُنقل للـ allowlist ولا تُحذف:

- `src/lib/api/smart-elements.ts`
- `src/features/planning/integration/persistence/entityBindingRegistry.test.ts`
- جميع العناصر المتبقية من `docs/reports/zero-reference-candidates-2026-05-05.md` التي لم تُذكر في allowlist أعلاه.

> ملاحظة تنفيذية: لا يوجد حذف في هذه المرحلة؛ التصنيف هنا بين `allowlist` و`defer` فقط.

## 2026-05-07 zero-reference triage additions

أضيفت هذه الإدخالات من `docs/reports/zero-reference-triage-2026-05-07.md` فقط عندما كان سبب الاستبعاد runtime/dynamic/registry مباشرًا وليس مجرد public API أو test/tooling.

| الملف | نوع الاستخدام غير المرئي | سبب الإبقاء | بوابة التحقق المقترنة |
| --- | --- | --- | --- |
| `src/hooks/useFileUpload.ts` | Worker bootstrap owner | ينشئ Web Worker عبر `new Worker(new URL('../workers/fileProcessor.worker.ts', import.meta.url), { type: 'module' })`، لذلك يبقى جزءًا من wiring runtime حتى إن لم يظهر كـ consumer عادي في static graph. | `rg -n "new Worker|fileProcessor\.worker\.ts" src/hooks src/workers` |
| `src/workers/fileProcessor.worker.ts` | Runtime-loaded worker module | entrypoint مستقل للـ Worker ومحمل باسم الملف كسلسلة داخل `src/hooks/useFileUpload.ts`; لا يُتوقع أن يظهر كـ direct static import. | `rg -n "new Worker|new URL|fileProcessor\.worker\.ts" src/hooks src/workers` |
| `src/shared/events/handlers/project-handlers.ts` | Registry side-effect | يسجل handlers عبر `handlerRegistry.register(...)` داخل module body؛ الاستهلاك يحدث عبر registry keyed events. | `rg -n "handlerRegistry\.register" src/shared/events/handlers src/shared/events` |
| `src/shared/events/handlers/cultural-handlers.ts` | Registry side-effect | يسجل cultural handlers عبر `handlerRegistry.register(...)`، وهو wiring runtime/registry لا direct call. | `rg -n "handlerRegistry\.register" src/shared/events/handlers src/shared/events` |
| `src/shared/events/handlers/hr-handlers.ts` | Registry side-effect | يسجل HR handlers في registry مركزي؛ يحلها runtime حسب نوع الحدث. | `rg -n "handlerRegistry\.register" src/shared/events/handlers src/shared/events` |
| `src/shared/events/handlers/webhook-handlers.ts` | Registry side-effect | يسجل webhook handlers في registry مركزي بدل direct import/call graph. | `rg -n "handlerRegistry\.register" src/shared/events/handlers src/shared/events` |
