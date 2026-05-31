# Batch B Closure — 2026-05-07

## Batch B.1 — ShapeRenderer canonical import confirmation

استجابةً لفحص مسار `ShapeRenderer` القديم، تمت إعادة مراجعة مستهلكي canvas المطلوبين والتأكد من أن الاستيراد يستخدم barrel المشترك canonical بدل مسار `diagram` القديم.

### Scope

| الملف | الحالة بعد الفحص |
|---|---|
| `src/features/planning/canvas/layers/CanvasElement.tsx` | يستورد `ShapeRenderer` من `@/features/planning/elements/shared`. |
| `src/features/planning/canvas/viewport/DrawingPreview.tsx` | يستورد `ShapeRenderer` من `@/features/planning/elements/shared`. |
| `src/features/planning/elements/diagram/ShapeRenderer.tsx` | غير موجود بالفعل في الشجرة الحالية، لذلك لم يلزم حذف إضافي. |

### Reference scan

- لا توجد مراجع مصدرية متبقية إلى `@/features/planning/elements/diagram/ShapeRenderer` أو `features/planning/elements/diagram/ShapeRenderer`.
- المراجع المتبقية لـ `ShapeRenderer` داخل `src` محصورة في barrel المشترك، التنفيذ canonical، ومستهلكي canvas الذين يستوردون من `@/features/planning/elements/shared`.

### Commands

- `rg -n "features/planning/elements/diagram/ShapeRenderer|@/features/planning/elements/diagram/ShapeRenderer|ShapeRenderer" src docs/reports`
- `test -f src/features/planning/elements/diagram/ShapeRenderer.tsx && echo exists || echo missing`
- `npm run -s typecheck`

### Result

Batch B.1 مغلق بدون حذف ملفات إضافية: مسار shim القديم absent، والاستيرادات المطلوبة تشير إلى canonical shared barrel، وفحص النوع نجح بعد التحقق.
