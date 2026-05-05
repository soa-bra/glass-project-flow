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
