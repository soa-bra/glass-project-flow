# سجل إصلاح الصفحة البيضاء — مكتمل

## الحالة: ✅ منجز

## السبب الجذري
كان `src/infra/metrics.ts` يستورد `prom-client` (مكتبة Node.js)، فيُحقن `process` في حزمة المتصفح ويرفع:

```
ReferenceError: process is not defined
  at node_modules/.vite/deps/prom-client.js
```

ما يوقف React قبل أول render ⇒ صفحة بيضاء.

سلسلة الاستيراد التي كشفت المشكلة:
`PlanningCanvas → features/planning/domain/commands → commandProcessor → collaborationMetrics → infra/metrics → prom-client`.

## الحل المنفَّذ
1. استُبدل `src/infra/metrics.ts` بـ **browser-safe no-op shim** يحافظ على نفس الـ public API (`metrics.<name>.inc/observe/set`، factories `counter/histogram/gauge`، `metricsMiddleware`، `register`، …) فلا يحتاج أي مستهلك إلى تعديل.
2. أُزيل `prom-client` من `package.json` وحُدِّث `bun.lock`.
3. مُسح `node_modules/.vite` لإجبار Vite على إعادة الـ pre-bundle بدون المكتبة.

## ما لم يتغيّر (وكان مقترحاً سابقاً ولم يعد ضرورياً)
- `src/features/planning/domain/commands/index.ts`: لم يُعدَّل — الجذر عولج عند المصدر.
- `src/features/planning/integration/telemetry/collaborationMetrics.ts`: لم يُعدَّل — يعمل فوق الـ shim مباشرة.

## التحقق
- console نظيف من `process is not defined` و`prom-client/zlib`.
- الواجهة (Sidebar + Header + Workspace) تُعرض في `/`.

## الملفات المتأثرة
- `src/infra/metrics.ts` (استبدال كامل بـ shim).
- `package.json`, `bun.lock` (إزالة `prom-client`).

## الخطوة التالية
الانتقال إلى **P0** من `docs/EXECUTION_ROADMAP.md`:
- إصلاح أخطاء البناء المتبقية في `src/shared/events/emitter.ts` و`src/components/TaskCard/BaseTaskCardLayout.tsx`.
- إضافة Feature Flag `VITE_USE_MOCK_DATA` في `.env.example` + توثيقه.
- تفعيل CI صارم في `.github/workflows/pr-checks.yml` (typecheck + lint + test).
