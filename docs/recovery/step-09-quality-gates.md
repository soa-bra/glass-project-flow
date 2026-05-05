# Step 09 Artifact — Quality Gates (Permanent)

- التاريخ: 2026-05-02
- الحالة: Done
- المالك: Platform/DevOps
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 9)

## Implemented Gates
1. Typecheck gate في CI (`npm run typecheck`).
2. Lint gate في CI (`npm run lint`).
3. Test gate في CI (`npm run test`).
4. Recovery smoke gate للمسارات الأساسية (`node scripts/recovery/smoke-gate.mjs`).
5. PR merge blocking عبر GitHub checks (job: `Quality Gate (npm)`).

## Core Recovery Smoke Coverage
1. auth: `src/components/auth/ProtectedRoute.tsx`
2. project: `src/services/central/projects.service.ts`
3. task: `src/services/central/tasks.service.ts`
4. invoice: `src/services/invoices/invoices.service.ts`
5. department shell: `src/services/central/departments.service.ts`

## Acceptance for Step 09
1. CI يفشل عند فشل lint/typecheck/test/smoke.
2. وجود smoke gate صريح للمسارات الخمسة الحرجة.
3. لا merge عند فشل أي check إلزامي.

## Closure Record
تم تفعيل Quality Gates الدائمة وإغلاق الخطوة 9.


## Evidence Governance Addendum (2026-05-04)
1. راجع سياسة أدلة الاختبارات: `docs/recovery/step-09-testing-evidence-policy.md`.
2. لا يُسمح بأي claim نجاح بدون evidence قابل للتدقيق.
