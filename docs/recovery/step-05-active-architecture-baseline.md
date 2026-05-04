# Step 05 Artifact — Active Architecture Baseline

- التاريخ: 2026-05-01
- الحالة: Approved
- المالك: Lead Architect
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 5)

## Baseline Architecture (Active Path)

```text
UI Surfaces
  -> Hooks Layer
    -> Services Layer
      -> Supabase Client/Auth
        -> Supabase DB (RLS)
```

## Layer Boundaries

### 1) UI Surfaces
- مسؤولة عن العرض والتفاعل فقط.
- يمنع الوصول المباشر لقاعدة البيانات من UI.
- أمثلة: مكونات الواجهة في `src/components/*`.

### 2) Hooks Layer
- تنسيق state/side-effects واستدعاء services فقط.
- أمثلة:
  - `src/hooks/useInvoices.ts`
  - `src/hooks/useProjectTasks.ts`
  - `src/hooks/central/useCentral.ts`

### 3) Services Layer
- مصدر منطق الوصول للبيانات وقواعد الاستدعاء.
- أمثلة:
  - `src/services/central/projects.service.ts`
  - `src/services/central/tasks.service.ts`
  - `src/services/invoices/invoices.service.ts`
  - `src/services/central/departments.service.ts`

### 4) Supabase/Auth/Data Layer
- المصادقة والجلسات عبر Supabase Auth.
- الوصول للبيانات عبر عميل Supabase + سياسات RLS.
- أمثلة:
  - `src/integrations/supabase/client.ts`
  - `src/integrations/supabase/types.ts`

## Allowed Flow Rules
1. UI -> Hook -> Service -> Supabase فقط.
2. يمنع UI -> Supabase مباشر.
3. يمنع Hook يتجاوز Service إلى Supabase مباشرة (إلا بتصريح معماري موثق).
4. يمنع إنشاء service موازية لنفس domain دون قرار معماري.

## Domain Path Mapping (Active)
1. Auth: `ProtectedRoute` + Supabase client.
2. Projects: hooks/projects -> `projects.service.ts`.
3. Tasks: hooks/tasks -> `tasks.service.ts`.
4. Invoices: hooks/invoices -> `invoices.service.ts` + invoice API.
5. Departments: hooks/central -> `departments.service.ts`.

## Evidence Links
1. `docs/recovery/step-02-active-scope-baseline.md`
2. `docs/recovery/step-04-source-of-truth-matrix.md`
3. `docs/adr/ADR-001-active-invoice-path.md`

## Acceptance for Step 05
1. وجود رسم baseline واضح للطبقات.
2. تحديد حدود كل طبقة وقواعد التدفق المسموح.
3. توثيق المسارات الصحيحة التي يجب اتباعها في المكونات الجديدة.

## Closure Record
1. تم اعتماد Baseline Architecture للمسار النشط.
2. أصبح مرجعًا إلزاميًا لمراجعات التصميم والتطوير.
3. أُغلقت الخطوة 5.
