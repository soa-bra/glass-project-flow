# Step 16 Post-Recovery Completion Rules

- التاريخ: 2026-05-05
- الحالة: Done
- المرجع: الحزمة التنفيذية لاستعادة الانضباط الهندسي — الخطوة 16

## Mandatory Completion Rules
1. أي تطوير جديد يبدأ من DoD مكتوب ومراجع في PR.
2. أي تطوير جديد يلتزم بالبنية النشطة: UI → hook → service → Supabase.
3. يمنع إنشاء Source of Truth جديد بدون قرار معماري موثق.
4. يمنع إدخال mock data إلى active path.
5. يمنع استخدام local state كمصدر حقيقة دائم.
6. يمنع إعادة فتح legacy/shadow paths أو استيرادها في المسارات النشطة.

## Required PR Evidence
1. Source of Truth reference.
2. DoD reference.
3. Active path reference.
4. Runtime/smoke impact statement.
5. Confirmation that no mock/local-truth/parallel-service was introduced.

## Enforcement Points
1. `.github/pull_request_template.md`
2. `eslint.config.js`
3. `.github/workflows/pr-checks.yml`
4. `scripts/recovery/smoke-gate.mjs`
5. `docs/recovery/step-09-testing-evidence-policy.md`

## Violation Handling
1. أي مخالفة تعتبر blocker للـ merge.
2. أي استثناء يتطلب ADR أو تحديث Source of Truth Matrix قبل الدمج.
3. أي rollback بسبب violation يجب أن ينتج backlog item في Step 15.

## Closure Record
تم إغلاق الخطوة 16 بتعريف قواعد الاستكمال بعد الإصلاح وربطها ببوابات PR/CI/lint والتوثيق الحاكم.
