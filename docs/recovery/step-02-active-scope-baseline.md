# Step 02 Artifact — نطاق التطبيق النشط (Baseline)

- التاريخ: 2026-05-01
- الحالة: Approved
- المالك: Engineering Manager + Tech Leads
- طريقة الاعتماد: اعتماد تنفيذي مباشر من صاحب الطلب في دورة التنفيذ الحالية.
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 2)

## Active In-Scope (تشغيلي الآن)
1. **Auth + Session**
   1. `src/integrations/supabase/client.ts`
   2. `src/components/auth/ProtectedRoute.tsx`
2. **Projects (Active service/hook path)**
   1. `src/services/central/projects.service.ts`
   2. `src/hooks/useProjectsTimeline.ts`
3. **Tasks (Active service/hook path)**
   1. `src/services/central/tasks.service.ts`
   2. `src/hooks/useProjectTasks.ts`
   3. `src/hooks/useUnifiedTasks.ts`
4. **Invoices (Active service/hook path)**
   1. `src/services/invoices/invoices.service.ts`
   2. `src/api/invoices/invoices.ts`
   3. `src/hooks/useInvoices.ts`
5. **Department shell read**
   1. `src/services/central/departments.service.ts`
6. **Supabase-backed hooks/services المستخدمة في المسارات النشطة**
   1. `src/services/central/*.ts`
   2. `src/hooks/central/*.ts`

## Out of Scope (خارج DoD التشغيلي الحالي)
1. Legacy invoice path المصنف رسميًا كـ dead legacy:
   1. `docs/adr/ADR-001-active-invoice-path.md` (مرجع العزل)
2. أي Mock-only path في الإنتاج:
   1. `docs/MOCK_INVENTORY.md` (مرجع تدقيق الموك)
3. Dead panels / export-only modules غير الداخلة في التشغيل الأساسي.
4. أي Feature جديدة غير مرتبطة بخطة الاستعادة.

## Scope Classification Rules (إلزامية)
1. كل عمل جديد يجب أن يحدد بوضوح:
   1. `in-scope-active`
   2. `out-of-scope-recovery`
2. أي عنصر خارج النطاق لا يدخل Sprint recovery التنفيذي.
3. أي تغيير في الحدود يتطلب موافقة حوكمة قبل التنفيذ.

## Operational DoD Inclusion Rule
1. يدخل ضمن DoD التشغيلي فقط ما يحقق:
   1. Active path واضح.
   2. Source of Truth قابل للتوثيق.
   3. قابلية تحقق runtime ضمن الخطوة 8.

## Scope Evidence (Repository-backed)
1. `docs/CURRENT_SYSTEM_SPECIFICATION.md` — توصيف الحالة الحالية للمكونات.
2. `docs/adr/ADR-001-active-invoice-path.md` — فصل مسار الفواتير النشط عن legacy.
3. `docs/MOCK_INVENTORY.md` — جرد مصادر mock.
4. `.github/workflows/pr-checks.yml` — بوابة جودة عامة داعمة للانضباط.

## Acceptance for Step 02
1. وجود قائمة in-scope/out-of-scope موحدة داخل artifact واحد.
2. ربط كل عنصر in-scope بدليل ملف/مسار فعلي.
3. منع إدخال عناصر غير مصنفة في برنامج recovery.

## Closure Record
1. تم إنشاء baseline نطاق نشط مستقل وقابل للتدقيق داخل المستودع.
2. تم ربطه بأدلة ملفات تشغيلية فعلية.
3. تم اعتماد الخطوة 2 تنفيذيًا في هذه الدورة.
