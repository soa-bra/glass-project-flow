# Batch A Delete List (Low Risk) — 2026-05-05

هذه قائمة تنفيذ أولية (10–15 ملف) من المرشحين منخفضي الخطورة للحذف، مبنية على فحص zero-reference + تحقق أسماء/استيراد.

## Selection criteria
- no direct imports detected in static graph.
- leaf UI widgets (غير مركزية في kernel/state).
- ليست workers أو hooks حرجة.
- ليست ملفات core داخل `features/planning/state` أو `engine`.

## Candidates (proposed order)
1. `src/components/OperationsBoard/shared/LoadingCard.tsx`
2. `src/components/OperationsBoard/shared/ErrorCard.tsx`
3. `src/components/OperationsBoard/Clients/AddClientButton.tsx`
4. `src/components/OperationsBoard/Clients/ActiveClientsList.tsx`
5. `src/components/OperationsBoard/Finance/OverBudgetAlert.tsx`
6. `src/components/OperationsBoard/Finance/ProjectBudgetChart.tsx`
7. `src/components/OperationsBoard/HR/AddMemberButton.tsx`
8. `src/components/OperationsBoard/HR/ProjectDistribution.tsx`
9. `src/components/OperationsBoard/HR/SkillGapRadar.tsx`
10. `src/components/OperationsBoard/HR/TeamFillProgress.tsx`
11. `src/components/OperationsBoard/HR/WorkloadBalance.tsx`
12. `src/components/OperationsBoard/Projects/ProjectProgressSummary.tsx`
13. `src/components/OperationsBoard/Reports/CustomReportForm.tsx`
14. `src/components/OperationsBoard/Reports/ReportStats.tsx`
15. `src/components/OperationsBoard/Reports/TemplatesList.tsx`

## Status workflow
- لكل ملف: `pending -> delete-approved | allowlist | defer`.
- لا حذف قبل التحقق النصي النهائي باستخدام `rg` لكل عنصر.

## Execution notes
- نفّذ الحذف على mini-batches (3–5 ملفات).
- بعد كل mini-batch: `npm run -s typecheck`.
- حدّث `docs/reports/batch-a-closure.md` بالنتائج.
