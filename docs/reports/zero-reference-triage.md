# Zero-reference triage — 2026-05-07

المصدر: `docs/reports/zero-reference-candidates-2026-05-05.md`.

## منهجية الفحص

تم استخدام `rg` لفحص اسم الملف، واسم المكوّن/الدالة المصدّرة، والمسار النسبي، وأي إشارات داخل `docs`/config/registry أو مداخل runtime. الأوامر الأساسية:

```bash
sed -n '1,160p' docs/reports/zero-reference-candidates-2026-05-05.md
rg -n --pcre2 -f /tmp/zero-ref-rg-patterns.txt --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!docs/reports/**' .
rg -n --glob '!node_modules' --glob '!dist' --glob '!build' "InvoicesDashboard|withAuthorizationAndAudit|useCanvasKeyboardNav|useFileUpload|usePermission|useSnapEngine|fileProcessor\.worker|ArchivePanel|DepartmentPanel" docs components.json package.json eslint.config.js src/App.tsx src/pages src/components src/hooks src/workers
npm run -s typecheck
```

## ملخص الحالات

- `delete-approved`: **57**
- `allowlist-runtime`: **39**
- `defer-route-entry`: **3**
- `defer-public-api`: **25**
- `needs-owner-decision`: **0**
- الإجمالي: **124**

## ملفات حُذفت في هذه الدفعة

- `src/components/Financial/InvoicesDashboard.tsx` — `delete-approved`.

## جدول triage

| الملف | الحالة | وجود الملف بعد الدفعة | الاسم/المسار المفحوص | export مفحوص | ملاحظات rg/القرار |
|---|---|---|---|---|---|
| `src/__tests__/SmartElements.test.tsx` | `allowlist-runtime` | موجود | `SmartElements.test.tsx` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/integration/canvas-acceptance.test.tsx` | `delete-approved` | غير موجود | `canvas-acceptance.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/canvas-kernel.test.tsx` | `delete-approved` | غير موجود | `canvas-kernel.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/canvas-rendering.test.tsx` | `delete-approved` | غير موجود | `canvas-rendering.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/canvas-workflow.test.tsx` | `delete-approved` | غير موجود | `canvas-workflow.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/clipboard-behavior.test.tsx` | `delete-approved` | غير موجود | `clipboard-behavior.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/drag-drop-behavior.test.tsx` | `delete-approved` | غير موجود | `drag-drop-behavior.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/element-creation.test.tsx` | `delete-approved` | غير موجود | `element-creation.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/export-import-integration.test.ts` | `delete-approved` | غير موجود | `export-import-integration.test.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/history-operations-integration.test.ts` | `delete-approved` | غير موجود | `history-operations-integration.test.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/selection-behavior.test.tsx` | `delete-approved` | غير موجود | `selection-behavior.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/smart-elements-integration.test.ts` | `allowlist-runtime` | موجود | `smart-elements-integration.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/integration/store-integration.test.ts` | `delete-approved` | غير موجود | `store-integration.test.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/undo-redo-behavior.test.tsx` | `delete-approved` | غير موجود | `undo-redo-behavior.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/__tests__/integration/viewport-elements-integration.test.ts` | `allowlist-runtime` | موجود | `viewport-elements-integration.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/integration/zoom-pan-behavior.test.tsx` | `allowlist-runtime` | موجود | `zoom-pan-behavior.test.tsx` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/performance/drag-benchmark.test.ts` | `allowlist-runtime` | موجود | `drag-benchmark.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/performance/export-benchmark.test.ts` | `allowlist-runtime` | موجود | `export-benchmark.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/performance/peak-collaboration-load.test.ts` | `allowlist-runtime` | موجود | `peak-collaboration-load.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/performance/render-benchmark.test.ts` | `allowlist-runtime` | موجود | `render-benchmark.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/setup.ts` | `allowlist-runtime` | موجود | `setup.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/stores/canvasStore.performance.test.ts` | `allowlist-runtime` | موجود | `canvasStore.performance.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/stores/canvasStore.test.ts` | `allowlist-runtime` | موجود | `canvasStore.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/stores/elementsSlice.test.ts` | `allowlist-runtime` | موجود | `elementsSlice.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/stores/historySlice.test.ts` | `allowlist-runtime` | موجود | `historySlice.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/stores/selectionSlice.test.ts` | `allowlist-runtime` | موجود | `selectionSlice.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/__tests__/stores/viewportSlice.test.ts` | `allowlist-runtime` | موجود | `viewportSlice.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/components/ArchivePanel/index.ts` | `defer-route-entry` | موجود | `index.ts` + relative path | barrel exports | مدخل route/workspace أو barrel قريب لمسار UI نشط؛ يؤجل لحسم route ownership. |
| `src/components/DepartmentPanel/index.ts` | `defer-route-entry` | موجود | `index.ts` + relative path | barrel exports | مدخل route/workspace أو barrel قريب لمسار UI نشط؛ يؤجل لحسم route ownership. |
| `src/components/Financial/InvoicesDashboard.tsx` | `delete-approved` | غير موجود | `InvoicesDashboard.tsx` + relative path | لا export ظاهر/اختبار | حُذف في هذه الدفعة: legacy dead path ومحظور في ESLint/ADR ولا توجد مراجع source مباشرة. |
| `src/components/HRLite/HRLiteMainPanel.tsx` | `delete-approved` | غير موجود | `HRLiteMainPanel.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx` | `delete-approved` | غير موجود | `KnowledgeBaseMainPanel.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/OperationsBoard/HR/SkillGapRadar.tsx` | `delete-approved` | غير موجود | `SkillGapRadar.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/OperationsBoard/HR/WorkloadBalance.tsx` | `delete-approved` | غير موجود | `WorkloadBalance.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/OperationsBoard/Reports/ReportStats.tsx` | `delete-approved` | غير موجود | `ReportStats.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/OperationsBoard/shared/ErrorCard.tsx` | `delete-approved` | غير موجود | `ErrorCard.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/OperationsBoard/shared/LoadingCard.tsx` | `delete-approved` | غير موجود | `LoadingCard.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/ProjectPanel/AnalysisModal.tsx` | `delete-approved` | غير موجود | `AnalysisModal.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/ProjectPanel/ApprovalRequestModal.tsx` | `delete-approved` | غير موجود | `ApprovalRequestModal.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/ProjectPanel/ExpenseModal.tsx` | `delete-approved` | غير موجود | `ExpenseModal.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/ProjectPanel/ProjectPanelContent.tsx` | `delete-approved` | غير موجود | `ProjectPanelContent.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/Surveys/SurveysMainPanel.tsx` | `delete-approved` | غير موجود | `SurveysMainPanel.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/TaskCard/TaskCardOverflowGuards.test.tsx` | `delete-approved` | غير موجود | `TaskCardOverflowGuards.test.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/TaskCard/index.tsx` | `defer-public-api` | موجود | `index.tsx` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/components/custom/ChangeRequestList.tsx` | `delete-approved` | غير موجود | `ChangeRequestList.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/custom/ClientSatisfaction.tsx` | `delete-approved` | غير موجود | `ClientSatisfaction.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/custom/SearchWithAI.tsx` | `delete-approved` | غير موجود | `SearchWithAI.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/custom/TemplateUploader.tsx` | `delete-approved` | غير موجود | `TemplateUploader.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/custom/ToolPanelContainer.tsx` | `delete-approved` | غير موجود | `ToolPanelContainer.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/custom/UtilizationGauge.tsx` | `delete-approved` | غير موجود | `UtilizationGauge.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/custom/VersionTree.tsx` | `delete-approved` | غير موجود | `VersionTree.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/kb/KnowledgeBaseOverview.tsx` | `delete-approved` | غير موجود | `KnowledgeBaseOverview.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/shared/ImprovementsSummary.tsx` | `delete-approved` | غير موجود | `ImprovementsSummary.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/shared/design-system/canvas-positioning.ts` | `delete-approved` | غير موجود | `canvas-positioning.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/shared/design-system/surface-tokens.ts` | `delete-approved` | غير موجود | `surface-tokens.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/components/ui/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/components/ui/performance/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/data/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/engine/canvas/collaboration/collaborationEngine.test.ts` | `allowlist-runtime` | موجود | `collaborationEngine.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/engine/canvas/io/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/engine/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/features/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/features/planning/canvas/controllers/useCanvasDropController.test.ts` | `allowlist-runtime` | موجود | `useCanvasDropController.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/canvas/controllers/useCanvasPointerTracking.test.ts` | `allowlist-runtime` | موجود | `useCanvasPointerTracking.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/canvas/controllers/useCanvasRealtimeController.test.ts` | `allowlist-runtime` | موجود | `useCanvasRealtimeController.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/canvas/controllers/useCanvasSelectionController.test.ts` | `allowlist-runtime` | موجود | `useCanvasSelectionController.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/canvas/controllers/useCanvasViewportController.test.ts` | `allowlist-runtime` | موجود | `useCanvasViewportController.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/canvas/controllers/useMindMapConnectionController.test.ts` | `allowlist-runtime` | موجود | `useMindMapConnectionController.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/canvas/viewport/InfiniteCanvas.test.tsx` | `allowlist-runtime` | موجود | `InfiniteCanvas.test.tsx` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/domain/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/features/planning/elements/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/features/planning/elements/text/FormatIndicator.tsx` | `delete-approved` | غير موجود | `FormatIndicator.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/features/planning/elements/text/utils/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/features/planning/integration/persistence/entityBindingRegistry.test.ts` | `allowlist-runtime` | موجود | `entityBindingRegistry.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/state/history/boardSnapshot.test.ts` | `allowlist-runtime` | موجود | `boardSnapshot.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/state/slices/selectionSlice.test.ts` | `allowlist-runtime` | موجود | `selectionSlice.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/state/slices/viewportSlice.test.ts` | `allowlist-runtime` | موجود | `viewportSlice.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/state/transactions/runCanvasTransaction.test.ts` | `allowlist-runtime` | موجود | `runCanvasTransaction.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/ui/PlanningCanvas.test.tsx` | `allowlist-runtime` | موجود | `PlanningCanvas.test.tsx` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/ui/toolbars/CanvasToolbar.test.tsx` | `allowlist-runtime` | موجود | `CanvasToolbar.test.tsx` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/features/planning/ui/toolbars/floating-bar/FloatingBar.test.tsx` | `allowlist-runtime` | موجود | `FloatingBar.test.tsx` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/hooks/canvas/useOptimizedCanvas.ts` | `delete-approved` | غير موجود | `useOptimizedCanvas.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/hooks/use-mobile.tsx` | `delete-approved` | غير موجود | `use-mobile.tsx` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useAIAnalysis.ts` | `delete-approved` | غير موجود | `useAIAnalysis.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useApprovals.ts` | `delete-approved` | غير موجود | `useApprovals.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useAudit.ts` | `delete-approved` | غير موجود | `useAudit.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useCanvasGraph.ts` | `delete-approved` | غير موجود | `useCanvasGraph.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useCanvasHelpers.ts` | `delete-approved` | غير موجود | `useCanvasHelpers.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useCanvasKeyboardNav.ts` | `defer-public-api` | موجود | `useCanvasKeyboardNav.ts` + relative path | useCanvasKeyboardNav | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/hooks/useCanvasStyles.ts` | `delete-approved` | غير موجود | `useCanvasStyles.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useFileUpload.ts` | `defer-public-api` | موجود | `useFileUpload.ts` + relative path | useFileUpload | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/hooks/useGridGuide.ts` | `delete-approved` | غير موجود | `useGridGuide.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useHR.ts` | `delete-approved` | غير موجود | `useHR.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/useKanban.ts` | `delete-approved` | غير موجود | `useKanban.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/hooks/usePermission.ts` | `defer-public-api` | موجود | `usePermission.ts` + relative path | PermissionResult, usePermission | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/hooks/useSnapEngine.ts` | `defer-public-api` | موجود | `useSnapEngine.ts` + relative path | useSnapEngine | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/hooks/useTaskSelection.ts` | `delete-approved` | غير موجود | `useTaskSelection.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/lib/api/smart-elements.ts` | `defer-public-api` | موجود | `smart-elements.ts` + relative path | smartElementsApi | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/main.tsx` | `defer-route-entry` | موجود | `main.tsx` + relative path | لا export ظاهر/اختبار | مدخل route/workspace أو barrel قريب لمسار UI نشط؛ يؤجل لحسم route ownership. |
| `src/services/central/withAuthorizationAndAudit.ts` | `defer-public-api` | موجود | `withAuthorizationAndAudit.ts` + relative path | createProject, CommandPolicy, CommandOptions, withAuthorizationAndAudit | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/shared/adapters/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/shared/events/handlers/cultural-handlers.ts` | `allowlist-runtime` | موجود | `cultural-handlers.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/shared/events/handlers/hr-handlers.ts` | `allowlist-runtime` | موجود | `hr-handlers.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/shared/events/handlers/project-handlers.ts` | `allowlist-runtime` | موجود | `project-handlers.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/shared/events/handlers/webhook-handlers.ts` | `allowlist-runtime` | موجود | `webhook-handlers.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/shared/events/validation.test.ts` | `allowlist-runtime` | موجود | `validation.test.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/shared/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/stories/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/test/setup.ts` | `allowlist-runtime` | موجود | `setup.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/types/canvas-component-props.ts` | `delete-approved` | غير موجود | `canvas-component-props.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/types/canvas-events.ts` | `delete-approved` | غير موجود | `canvas-events.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/types/canvas-hooks.ts` | `defer-public-api` | موجود | `canvas-hooks.ts` + relative path | لا export ظاهر/اختبار | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/types/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/utils/canvasCoordinates.ts` | `delete-approved` | غير موجود | `canvasCoordinates.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/utils/deprecation.ts` | `delete-approved` | غير موجود | `deprecation.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/utils/imageUtils.ts` | `delete-approved` | غير موجود | `imageUtils.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/utils/index.ts` | `defer-public-api` | موجود | `index.ts` + relative path | barrel exports | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/utils/mindmap-tree.ts` | `delete-approved` | غير موجود | `mindmap-tree.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/utils/performanceOptimizer.ts` | `defer-public-api` | موجود | `performanceOptimizer.ts` + relative path | CanvasIntersectionObserver, CanvasVirtualizer, CanvasElementPool, PerformanceMetrics, optimizedStyleCalculator | barrel/API/compatibility/docs signal؛ يؤجل لتغيير public surface مقصود. |
| `src/utils/taskConstants.ts` | `delete-approved` | غير موجود | `taskConstants.ts` + relative path | لا export ظاهر/اختبار | غير موجود حاليًا؛ عومل كحذف سابق/منفذ ولا يوجد حذف إضافي. |
| `src/vite-env.d.ts` | `allowlist-runtime` | موجود | `vite-env.d.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
| `src/workers/fileProcessor.worker.ts` | `allowlist-runtime` | موجود | `fileProcessor.worker.ts` + relative path | لا export ظاهر/اختبار | يُكتشف أو يُستدعى عبر runtime/test runner/dynamic worker/event registry؛ لا يُحذف بالـ import-graph فقط. |
