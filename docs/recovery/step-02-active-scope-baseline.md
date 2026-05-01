# Step 02 Artifact — نطاق التطبيق النشط (Baseline)

- التاريخ: 2026-05-01
- الحالة: Draft for Technical Review
- المالك المقترح: Engineering Manager + Tech Leads
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 2)

## Active In-Scope (تشغيلي الآن)
1. Authentication + Session عبر Supabase Auth.
2. Project domain (create/read الأساسية في المسار النشط).
3. Task domain (create/read/update في المسار النشط).
4. Invoice domain (create/read/update في المسار النشط).
5. Department shell read (عرض هيكل الأقسام في المسار النشط).
6. Supabase-backed services/hooks المستعملة من واجهات UI النشطة.

## Out of Scope (خارج DoD التشغيلي الحالي)
1. Legacy code paths غير المستعملة تشغيليًا.
2. Dead panels وواجهات غير موصولة بالمسار النشط.
3. Export-only modules غير الداخلة في سير التشغيل الأساسي.
4. Mock-only paths وأي data mocks داخل الإنتاج.
5. أي Feature جديدة غير مطلوبة لإغلاق برنامج الاستعادة.

## Boundary Rules
1. أي Epic/Task جديدة يجب أن تُوسم صراحة: `in-scope-active` أو `out-of-scope-recovery`.
2. أي تغيير في `out-of-scope` يحتاج موافقة حوكمة قبل التنفيذ.
3. لا يسمح بإدخال mocks في in-scope paths.

## Operational DoD Inclusion Rule
1. يدخل ضمن DoD التشغيلي فقط ما يحقق:
   1. Active path واضح.
   2. Source of Truth قابل للتوثيق.
   3. قابلية تحقق runtime ضمن الخطوة 8.

## Evidence Pointers (من المستودع)
1. `docs/recovery_execution_package.md` — تعريف مرجعي للخطوات.
2. `.github/workflows/pr-checks.yml` — بوابة جودة عامة موجودة.
3. `docs/adr/ADR-001-active-invoice-path.md` — مثال حوكمي لمسار نشط مقابل legacy.
4. `docs/CURRENT_SYSTEM_SPECIFICATION.md` — توصيف الحالة الحالية للمكونات.

## Review/Approval Required
1. مراجعة Tech Leads لتأكيد قائمة in-scope النهائية.
2. اعتماد EM/Architect للنسخة baseline.

## Closure Condition
تُعتبر الخطوة 2 مغلقة عند:
1. اعتماد هذه الوثيقة (أو نسخة منقحة منها) رسميًا.
2. عدم وجود مكوّن نشط غير مصنف in-scope/out-of-scope.
