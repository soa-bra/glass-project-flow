# Inventory Summary (Re-scan) — 2026-05-05

## Executed checks
1. `npm run -s typecheck`.
2. Python import-graph scan over `src/**/*.ts?(x)` (relative imports + `@/` alias resolution).
3. Duplicate filename scan to identify overlap hotspots.

## Quantitative results
- Total TS/TSX files scanned: **940**.
- Potential zero-reference files (candidates): **95**.
- Duplicate filename clusters: still concentrated in domain tabs/modals/renderers.

> ملاحظة: قائمة zero-reference هي **مرشحة** وليست حكمًا نهائيًا؛ قد تتضمن ملفات يتم تحميلها ديناميكيًا أو عبر أنماط غير مباشرة.

## High-priority candidate groups
- OperationsBoard leaf widgets غير مرتبطة مباشرة (عدة ملفات داخل `Clients`, `Finance`, `HR`, `Reports`).
- ProjectPanel modals/components مرشحة لتوحيد أو إزالة غير المستخدم.
- Performance hooks غير مرتبطة مباشرة من شجرة الاستيراد الحالية.
- Canvas/controller test files غير مرتبطة لأن مسار الاختبار الحالي قد لا يلتقطها تلقائيًا بنفس النمط.

## Actionable next steps from re-scan
1. إنشاء **allowlist** للملفات الديناميكية/التجريبية لمنع false positives.
2. بدء cleanup فعلي عبر batch صغير (10–15 ملف) من zero-reference المؤكّد بعد التحقق اليدوي.
3. توحيد أول حالتين عاليتي الخطورة من `duplication-matrix.md`:
   - `snapEngine` (math vs interaction)
   - `ShapeRenderer` (diagram vs shared)
4. إعادة الفحص بعد كل batch مع مقارنة عدد المرشحين قبل/بعد.

## Cleanup batch log — 2026-05-05 (Batch 1)
- Deleted files (3):
  - `src/hooks/performance/useCanvasPerformance.ts`
  - `src/hooks/performance/useMemoizedStyles.ts`
  - `src/hooks/performance/usePerformanceOptimization.ts`
- Post-delete check: `npm run -s typecheck` ✅ passed.
- Deferred files in this batch: **0**.
- Moved to allowlist in this batch: **0**.

### Batch 1 summary
- عدد الملفات المحذوفة: **3**
- عدد الملفات المؤجلة: **0**
- عدد الملفات المنقولة للـ allowlist: **0**

## Batch A Results
- Baseline zero-reference candidates: **95**.
- Batch A removed: **3**.
- Batch A deferred: **0**.
- Batch A allowlisted: **0**.
- Batch A remaining (baseline accounting): **92**.

## Re-scan after Batch A
- Re-ran Python import-graph scan on **2026-05-05** and regenerated `docs/reports/zero-reference-candidates-2026-05-05.md`.
- Total TS/TSX files scanned: **966**.
- New zero-reference candidates: **135**.

## Baseline vs new result (95 vs 135)
- Net change: **+40** candidates.
- Improvement rate: **-42.11%** (regression relative to baseline).
- Formula: `((95 - 135) / 95) * 100 = -42.11%`.

