# Batch A Final Delete List (Executed) — 2026-05-05

هذه هي قائمة Batch A النهائية التي تم اعتمادها وتنفيذها للحذف الآمن ضمن الدفعات المصغّرة #1 إلى #5. صدرت القائمة بعد فحص zero-reference والتحقق النصي/المرجعي، ثم نُفذت على دفعات مع تشغيل `npm run -s typecheck` بعد كل دفعة.

## Selection criteria
- no direct imports detected in static graph.
- leaf UI widgets (غير مركزية في kernel/state).
- ليست workers أو hooks حرجة.
- ليست ملفات core داخل `features/planning/state` أو `engine`.
- لا توجد route/config/string lookup references معروفة داخل المستودع.

## Final delete-approved files

### Mini-batch #1 — OperationsBoard shared/client widgets
1. `src/components/OperationsBoard/shared/LoadingCard.tsx`
2. `src/components/OperationsBoard/shared/ErrorCard.tsx`
3. `src/components/OperationsBoard/Clients/AddClientButton.tsx`

### Mini-batch #2 — OperationsBoard client/finance widgets
4. `src/components/OperationsBoard/Clients/ActiveClientsList.tsx`
5. `src/components/OperationsBoard/Finance/OverBudgetAlert.tsx`
6. `src/components/OperationsBoard/Finance/ProjectBudgetChart.tsx`

### Mini-batch #3 — OperationsBoard HR widgets
7. `src/components/OperationsBoard/HR/AddMemberButton.tsx`
8. `src/components/OperationsBoard/HR/ProjectDistribution.tsx`
9. `src/components/OperationsBoard/HR/SkillGapRadar.tsx`

### Mini-batch #4 — OperationsBoard HR/projects/reports widgets
10. `src/components/OperationsBoard/HR/TeamFillProgress.tsx`
11. `src/components/OperationsBoard/HR/WorkloadBalance.tsx`
12. `src/components/OperationsBoard/Projects/ProjectProgressSummary.tsx`
13. `src/components/OperationsBoard/Reports/CustomReportForm.tsx`
14. `src/components/OperationsBoard/Reports/ReportStats.tsx`
15. `src/components/OperationsBoard/Reports/TemplatesList.tsx`

### Mini-batch #5 — Custom standalone widgets
16. `src/components/custom/ChangeRequestList.tsx`
17. `src/components/custom/ClientSatisfaction.tsx`
18. `src/components/custom/SearchWithAI.tsx`
19. `src/components/custom/TemplateUploader.tsx`
20. `src/components/custom/ToolPanelContainer.tsx`
21. `src/components/custom/UtilizationGauge.tsx`
22. `src/components/custom/VersionTree.tsx`

## Execution status
- Status: `executed`.
- Files deleted: 22.
- Typecheck: passed after each mini-batch per `docs/reports/batch-a-closure.md`.
- Barrel exports: no removed file required a surviving barrel export update during these mini-batches.

## Deferred from Batch A final delete list
لم يتم إدخال بقية zero-reference candidates في هذه القائمة النهائية لأنها تحتاج مسارات مراجعة منفصلة قبل الحذف:

| Category | Examples | Follow-up |
|---|---|---|
| Route/feature entry panels | `HRLiteMainPanel`, `KnowledgeBaseMainPanel`, `SurveysMainPanel`, `KnowledgeBaseOverview` | Batch A.2 route/product decision |
| Runtime workers | `fileProcessor.worker.ts`, `exportWorker.ts`, `importWorker.ts`, `snapWorker.ts` | Batch E allowlist / worker review |
| Tests/tooling | `*.test.ts`, `*.test.tsx` | Batch T if test cleanup is requested |
| Hooks/public utilities | `src/hooks/*`, `src/types/*`, `src/utils/*` | Batch D hook/API audit |
| Refactor targets | `snapEngine`, `ShapeRenderer`, modals, `FileUploadModal` | Batch B/C |

## Notes
- هذه القائمة هي نطاق Batch A المغلق، وليست كل قائمة zero-reference الخام.
- قائمة `docs/reports/zero-reference-candidates-2026-05-05.md` تبقى baseline heuristic تاريخي، ولا تُستخدم للحذف المباشر بعد تنفيذ هذه القائمة.
