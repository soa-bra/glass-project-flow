# Cleanup Final Report — 2026-05-07

## Before / After

يعتمد هذا التقرير على baseline الأولي المنشور في `docs/reports/inventory-summary-2026-05-05.md`: **95** مرشحًا محتملًا بلا مراجع مباشرة في import graph.

| Metric | Before | After | Notes |
|---|---:|---:|---|
| baseline الأولي | 95 | 95 | نقطة القياس الأصلية قبل دفعات التنظيف. |
| عدد الملفات المحذوفة | 0 | 44 | حذف مؤكد عبر دفعات OperationsBoard، hooks، ProjectPanel legacy، وcompatibility shims. |
| عدد المرشحين المتبقيين | 95 | 43 | الحساب النهائي: `95 - 44 deleted - 8 allowlist = 43`. هذه العناصر تبقى تحت مراجعة deferred/next-pass. |
| عدد العناصر المؤجلة | 0 | 43 | تشمل العناصر التي تحتاج دليل runtime/registry/test-runner أو قرار منتج قبل الحذف. |
| عدد العناصر الموضوعة في allowlist | 0 | 8 | رقم allowlist المستخدم في إغلاق Batch A؛ التقرير الحالي يوصي بتطبيع القائمة النصية بحيث تطابق هذا الرقم صراحةً. |

### Breakdown of deleted files

| Group | Deleted files | Summary |
|---|---:|---|
| OperationsBoard leaf widgets | 15 | مكونات UI فرعية غير مرتبطة مباشرة بعد فحص static graph. |
| Initial performance hooks | 3 | `useCanvasPerformance`, `useMemoizedStyles`, `usePerformanceOptimization`. |
| Additional safe hook/test cleanup | 4 | `useCanvasOptimization`, `useAnimatedNumber`, وملفا اختبار hook قديمان. |
| ProjectPanel / legacy main panels | 8 | ProjectPanel legacy content/modals وثلاث لوحات legacy للإدارات/المعرفة/الاستبيانات. |
| Compatibility shims | 2 | `snapEngine` القديم تحت `math` و`ShapeRenderer` القديم تحت `diagram`. |
| Zero-reference hooks audit | 12 | Hooks بلا barrel export أو usage أو API signal. |
| **Total** | **44** | إجمالي الحذف المحسوب مقابل baseline الأولي. |

## Batch B — Shims and import migration

### Shims المحذوفة

- `src/engine/canvas/math/snapEngine.ts` — أزيل بعد تثبيت المسار canonical في `src/engine/canvas/interaction/snapEngine.ts`.
- `src/features/planning/elements/diagram/ShapeRenderer.tsx` — أزيل بعد تثبيت renderer canonical في `src/features/planning/elements/shared/ShapeRenderer.tsx`.

### Imports المنقولة

- نُقلت imports القديمة الخاصة بـ Snap Engine إلى `src/engine/canvas/interaction/snapEngine.ts`.
- نُقلت imports القديمة الخاصة بـ ShapeRenderer إلى barrel/implementation المسار المشترك `src/features/planning/elements/shared/ShapeRenderer.tsx`.
- نتيجة الفحص النهائي: لا توجد source imports متبقية للمسارات القديمة، والمتبقي فقط مراجع توثيقية/تاريخية داخل تقارير cleanup.

## Batch C — Modals consolidation / removal

### المودالات الموحدة أو المحذوفة

- حُذف `src/components/ProjectPanel/AnalysisModal.tsx` لأن التدفق الحالي يستخدم `FinancialAnalysisModal` من `src/components/custom` بدل نسخة ProjectPanel القديمة.
- حُذف `src/components/ProjectPanel/ApprovalRequestModal.tsx` لأن `ProjectTabs` يستخدم النسخة النشطة من `src/components/custom/ApprovalRequestModal.tsx`.
- حُذف `src/components/ProjectPanel/ExpenseModal.tsx` لأن `ProjectTabs` يستخدم النسخة النشطة من `src/components/custom/ExpenseModal.tsx`.
- حُذف `src/components/ProjectPanel/ProjectPanelContent.tsx` لأن `ProjectPanel` الحالي يعرض `ProjectManagementBoard` بدل المحتوى القديم.

### Deferred modal/UI follow-up

- `src/features/planning/ui/overlays/FileUploadModal.tsx` مقابل `src/components/custom/FileUploadModal.tsx`: مؤجل لأن الاختلاف مرتبط بسياسات upload/errors ويحتاج قرارًا لتوحيد service shell قبل الحذف.
- `src/components/custom/ExpenseModal.tsx`: يبقى canonical في التدفق الحالي، لكن يوصى باستخراج shared form model إذا ظهر wrapper جديد لاحقًا.

## Batch D — Hooks audit and cleanup

### hooks المفحوصة

تم فحص 17 عنصرًا تحت `src/hooks/**` من قائمة zero-reference، مع مراجعة barrel exports، direct/non-barrel usage، إشارات documentation/API، وأي runtime wiring غير مرئي في static import graph.

### hooks المحذوفة أو المصححة

حُذفت 12 hooks مؤكدة بلا usage/API signal:

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

واحتُفظ بالـ hooks/exports التالية لأنها public API أو مرتبطة بوثائق/تشغيل runtime:

- `src/hooks/index.ts`
- `src/hooks/useCanvasKeyboardNav.ts`
- `src/hooks/useFileUpload.ts`
- `src/hooks/usePermission.ts`
- `src/hooks/useSnapEngine.ts`

تمت كذلك إعادة تأكيد أن performance hooks القديمة تحت `src/hooks/performance/*` غير موجودة، ولا توجد barrel exports لها، ولا يلزم حذف إضافي.

## Batch E — Quality gates and recommendations

### quality gates المضافة/المتبعة

- تشغيل `npm run -s typecheck` بعد دفعات الحذف الرئيسية وبعد مراجعات hooks/shims.
- إعادة تشغيل import/reference scans باستخدام `rg` قبل الحذف وبعده للتحقق من عدم وجود imports مباشرة أو string/route references نشطة.
- توثيق allowlist/defer بدل حذف الملفات ذات dynamic runtime أو registry wiring.

### توصيات منع التراجع

1. إضافة CI gate يفشل عند عودة imports إلى المسارات القديمة:
   - `src/engine/canvas/math/snapEngine.ts`
   - `src/features/planning/elements/diagram/ShapeRenderer.tsx`
2. إضافة check دوري لقائمة zero-reference مع allowlist صريحة ومُرقّمة.
3. إضافة lint/import rule يمنع compatibility shims الجديدة دون ADR أو تاريخ انتهاء.
4. تشغيل `npm run -s typecheck` وscan imports بعد كل batch تنظيف قبل الدمج.
5. تحويل العناصر deferred إلى backlog صغير بمالك وسبب وشرط خروج واضح.

## Deferred follow-up list

| Deferred item | Reason | Exit condition |
|---|---|---|
| `src/lib/api/smart-elements.ts` | يحتاج تأكيد هل هو API public/runtime entry أم بقايا legacy. | إثبات consumer/runtime route أو حذف بعد scan شامل. |
| `src/features/planning/integration/persistence/entityBindingRegistry.test.ts` | ملف test قد لا يظهر في import graph؛ لا يحذف قبل تأكيد test runner scope. | ربطه بسكربت test أو حذفه إذا لم يعد ضمن strategy الاختبارات. |
| `src/workers/exportWorker.ts` / `importWorker.ts` / `snapWorker.ts` references | الملفات غير موجودة حاليًا، لكن توجد مراجع docs-only قديمة. | تحديث docs لإزالة الأمثلة القديمة أو إنشاء workers إذا كانت feature مطلوبة. |
| Remaining zero-reference test files | false positives محتملة بسبب test discovery بدل imports. | حصر نمط test runner ثم حذف فقط ما لا يطابق أي suite. |
| FileUpload modal duplication | اختلاف policy/error handling بين planning overlay وcustom modal. | توحيد upload service contract ثم اختيار shell واحد أو wrappers واضحة. |
| Repeated DepartmentTabs patterns | تكرار أسماء tabs/cards قد يكون domain-specific. | بناء tab scaffold مشترك ثم مراجعة كل domain على حدة. |

## Final notes

- الأرقام النهائية هنا تقيس cleanup مقابل baseline الـ **95**، ولا تستخدم رقم إعادة الفحص heuristic اللاحق كبديل مباشر لأن import graph قد ينتج false positives للـ tests/workers/registries.
- أي حذف إضافي يجب أن يبدأ من الـ 43 مرشحًا المتبقيين، مع الاحتفاظ بقاعدة: لا حذف قبل وجود دليل عدم استخدام runtime أو public API.
