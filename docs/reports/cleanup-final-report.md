# Cleanup Final Report — 2026-05-07

## Baseline النهائي

يعتمد هذا التقرير على baseline الأولي في `docs/reports/inventory-summary-2026-05-05.md`، والذي سجّل **95** مرشحًا محتملًا ضمن فحص zero-reference/import graph. الأرقام التالية هي baseline النهائي لإغلاق جولة التنظيف، وليست بديلًا عن أي إعادة فحص heuristic لاحقة قد تُظهر false positives في ملفات الاختبار أو workers أو registries.

| البند المطلوب | القيمة النهائية | ملاحظات الإغلاق |
|---|---:|---|
| initial candidates | 95 | نقطة القياس الأصلية قبل تنفيذ الدُفعات. |
| removed files | 44 | ملفات حُذفت بعد تحقق import/name/barrel/runtime حسب الدُفعة. |
| remaining candidates | 43 | الحساب النهائي: `95 - 44 removed - 8 allowlisted = 43`. |
| allowlisted files | 8 | عناصر احتفاظ مبرّر بسبب runtime worker أو registry/public API أو false-positive مثبت. |
| deferred files | 43 | العناصر المتبقية التي لا تُحذف قبل دليل إضافي أو قرار product/runtime/test-runner. |

## Removed files baseline

| المجموعة | العدد | أمثلة/نطاق الحذف |
|---|---:|---|
| OperationsBoard leaf widgets | 15 | مكونات UI فرعية داخل `OperationsBoard` لا تملك imports مباشرة بعد فحص static graph. |
| Initial performance hooks | 3 | `src/hooks/performance/useCanvasPerformance.ts`, `src/hooks/performance/useMemoizedStyles.ts`, `src/hooks/performance/usePerformanceOptimization.ts`. |
| Additional safe hook/test cleanup | 4 | `src/hooks/performance/useCanvasOptimization.ts`, `src/hooks/useAnimatedNumber.ts`, وملفا اختبار hook قديمان. |
| ProjectPanel / legacy main panels | 8 | ProjectPanel legacy content/modals ولوحات HRLite/KnowledgeBase/Surveys/kb القديمة. |
| Compatibility shims | 2 | `src/engine/canvas/math/snapEngine.ts`, `src/features/planning/elements/diagram/ShapeRenderer.tsx`. |
| Zero-reference hooks audit | 12 | Hooks تحت `src/hooks/**` بلا barrel export أو usage أو API signal. |
| **الإجمالي** | **44** | إجمالي الحذف المحسوب مقابل baseline الأولي. |

## Batch summaries

### Batch A — low-risk zero-reference cleanup

- الهدف: إزالة المرشحين منخفضي الخطورة بعد استبعاد workers وruntime loaders والاختبارات الحرجة والـ core state/engine.
- النتائج: **23** ملفًا محذوفًا، **0** مؤجلًا ضمن الدفعة، و**8** عناصر في allowlist حسب إغلاق Batch A.
- الحساب المرحلي بعد Batch A: `95 - 23 removed - 8 allowlisted = 64` مرشحًا للمراجعة/المعالجة التالية.
- أبرز النطاقات: performance hooks الأولية، OperationsBoard/UI leaves، ProjectPanel legacy modals/content، وملفات shared/types/utils low-risk من Batch A.7.

### Batch B — shims and import migration

- الهدف: تثبيت المسارات canonical بدل compatibility shims القديمة.
- أُغلق مسار Snap Engine القديم لصالح `src/engine/canvas/interaction/snapEngine.ts`.
- أُغلق مسار ShapeRenderer القديم لصالح `src/features/planning/elements/shared/ShapeRenderer.tsx` والـ shared barrel.
- نتيجة scan: لا توجد source imports متبقية للمسارات القديمة؛ المراجع المتبقية توثيقية/تاريخية فقط داخل تقارير cleanup.

### Batch C — modals consolidation / removal

- الهدف: إزالة نسخ ProjectPanel القديمة بعد تأكيد أن التدفق الحالي يستخدم modals canonical من `src/components/custom` أو board/current shell.
- حُذفت ملفات ProjectPanel legacy التالية ضمن baseline الحذف:
  - `src/components/ProjectPanel/AnalysisModal.tsx`
  - `src/components/ProjectPanel/ApprovalRequestModal.tsx`
  - `src/components/ProjectPanel/ExpenseModal.tsx`
  - `src/components/ProjectPanel/ProjectPanelContent.tsx`
- المؤجل المرتبط بهذه الدفعة: توحيد FileUpload modal بقي مؤجلًا لأن الاختلاف مرتبط بسياسات upload/errors ويحتاج قرارًا على service shell قبل الحذف.

### Batch D — hooks audit and cleanup

- الهدف: مراجعة مرشحي `src/hooks/**` عبر barrel exports والاستخدام المباشر وغير المباشر وإشارات public API/runtime.
- حُذفت **12** hooks مؤكدة بلا usage/API signal:
  - `src/hooks/canvas/useOptimizedCanvas.ts`
  - `src/hooks/use-mobile.tsx`
  - `src/hooks/useAIAnalysis.ts`
  - `src/hooks/useApprovals.ts`
  - `src/hooks/useAudit.ts`
  - `src/hooks/useCanvasGraph.ts`
  - `src/hooks/useCanvasHelpers.ts`
  - `src/hooks/useCanvasStyles.ts`
  - `src/hooks/useGridGuide.ts`
  - `src/hooks/useHR.ts`
  - `src/hooks/useKanban.ts`
  - `src/hooks/useTaskSelection.ts`
- احتُفظ بملفات hooks/exports لها دليل public API أو runtime/documentation signal، مثل `src/hooks/index.ts`, `src/hooks/useCanvasKeyboardNav.ts`, `src/hooks/useFileUpload.ts`, `src/hooks/usePermission.ts`, و`src/hooks/useSnapEngine.ts`.

### Batch E — quality gates and recommendations

- الهدف: تثبيت أدلة السلامة ومنع عودة shims أو حذف false positives.
- quality gates المستخدمة: `npm run -s typecheck` بعد دفعات الحذف، و`rg` scans للمسارات/الأسماء/imports قبل وبعد الحذف.
- التوصيات النهائية:
  1. إضافة CI/import rule يمنع عودة imports إلى shims القديمة بدون ADR وتاريخ انتهاء.
  2. إبقاء allowlist صريحة ومُرقّمة مع سبب الاحتفاظ.
  3. تحويل deferred candidates إلى backlog بمالك وسبب وشرط خروج.
  4. تشغيل `npm run -s typecheck` وscan imports بعد كل batch تنظيف.

## Final deferred items

> العدد النهائي المؤجل هو **43** candidate. الجدول التالي يثبت قائمة عناصر التأجيل النهائية على مستوى العناصر/المجموعات التنفيذية مع سبب التأجيل وشرط الخروج؛ لا يُحذف أي عنصر منها قبل تحقق الشرط المقابل.

| العنصر المؤجل | سبب التأجيل | شرط الخروج |
|---|---|---|
| Remaining zero-reference test files | ملفات الاختبار قد تظهر zero-reference بسبب discovery من test runner بدل imports مباشرة. | حصر نمط test runner/suite ثم حذف فقط ما لا يطابق أي مسار اختبار فعّال. |
| `src/features/planning/integration/persistence/entityBindingRegistry.test.ts` | قد يكون false positive بسبب test discovery، ولا يوجد دليل كافٍ لإخراجه من strategy الاختبار. | ربطه بسكربت test أو حذفه بعد إثبات أنه خارج أي suite. |
| `src/lib/api/smart-elements.ts` | يحتاج تأكيد هل هو API public/runtime entry أم بقايا legacy. | إثبات consumer/runtime route/API أو حذفه بعد scan شامل. |
| Source entry/barrel files مثل `src/index.ts`, `src/main.tsx`, `src/features/index.ts`, `src/shared/index.ts`, `src/types/index.ts`, و`src/utils/index.ts` | قد تكون public package أو app entry points، وstatic graph قد لا يلتقطها كـ imported modules. | قرار صريح حول API surface/entrypoint ثم حذف أو إبقاء موثق. |
| UI barrels مثل `src/components/ui/index.ts` و`src/components/ui/performance/index.ts` | barrel exports قد تكون public API أو import surface للمستهلكين، حتى عند غياب imports داخلية مباشرة. | فحص consumers الخارجيين/الداخليين ثم توثيق public surface أو إزالة barrel. |
| FileUpload modal duplication | يوجد تداخل بين planning overlay وcustom modal، لكن الاختلاف مرتبط بسياسات upload/errors. | توحيد upload service contract ثم اختيار shell واحد أو wrappers واضحة. |
| Worker docs-only references: `exportWorker`, `importWorker`, `snapWorker` | الملفات غير موجودة حاليًا، والمراجع المتبقية توثيقية فقط؛ لا يوجد ملف حالي للحذف ولا قرار feature لإحيائها. | تحديث docs لإزالة الأمثلة القديمة أو إنشاء workers إذا كانت feature مطلوبة. |
| Event handler/registry-style files not directly referenced | قد تُحمّل عبر registry/event-name wiring لا يظهر في static import graph. | إثبات غياب registration/runtime load قبل الحذف أو إضافتها إلى allowlist. |
| Planning canvas/controller/domain test candidates | قد تعتمد على Vitest discovery أو على suites انتقائية خارج import graph. | مراجعة config الاختبارات، ثم حذف ملفات الاختبار غير المشمولة فقط. |
| Remaining UI/domain leaf candidates | لا يكفي غياب import مباشر وحده إذا كان هناك احتمال route/config/string/runtime wiring. | فحص name/string/route/registry/barrel لكل عنصر قبل قرار delete-approved. |

## `npm run -s typecheck` result

- الأمر المنفذ: `npm run -s typecheck`.
- التاريخ: 2026-05-07.
- النتيجة: **Passed**.
- المخرجات: لا توجد مخرجات stdout/stderr؛ خرج الأمر بالكود `0`.

## Final notes

- الأرقام النهائية تقيس cleanup مقابل baseline الـ **95** فقط.
- أي حذف إضافي يجب أن يبدأ من الـ **43** مرشحًا المؤجلين، مع قاعدة ثابتة: لا حذف قبل دليل عدم وجود runtime usage أو public API أو test-runner discovery.
