## P3.b — ربط كامل لتبويبات الأقسام بالـ Central

### الهدف
استبدال كل بيانات الـ design-mock في `src/components/DepartmentTabs/**` بقراءات/كتابات حقيقية من Supabase، عبر إنشاء جداول الدومين الناقصة + RLS + خدمات + hooks + ربط كل تبويب.

### الجداول الجديدة (migration واحد شامل)

```text
hr_employees           (department_id, name, role, email, phone, hire_date, status, salary, metadata)
hr_attendance          (employee_id, date, check_in, check_out, status)
hr_training_courses    (name, provider, duration_hours, start_date, status, metadata)
hr_training_enrollments(course_id, employee_id, status, completion_date)
hr_performance_reviews (employee_id, reviewer_id, period, score, notes)
hr_partners            (name, type, contact_email, status)

crm_customers          (name, email, phone, company, segment, status, owner_id)
crm_opportunities      (customer_id, name, value, probability, stage, expected_close, owner_id)
crm_activities         (customer_id, type, subject, due_date, status, owner_id)
crm_service_tickets    (customer_id, subject, priority, status, assignee_id)

financial_budgets      (project_id?, department_id?, name, period, planned_amount, spent_amount, currency)
financial_transactions (budget_id?, project_id?, kind income|expense, amount, date, vendor, notes)

legal_cases            (title, type, status, client_name, opened_at, closed_at, owner_id)
legal_contracts        (case_id?, project_id?, name, party, signed_at, expires_at, status, file_url)

brand_assets           (name, category, file_url, status, tags[], owner_id)
brand_guidelines       (title, body_md, version, status)

marketing_campaigns    (name, channel, status, start_date, end_date, budget, spent, owner_id)
marketing_leads        (campaign_id, name, email, source, status, score)

csr_initiatives        (name, type, status, start_date, end_date, budget, beneficiaries_count, owner_id)
csr_tickets            (initiative_id?, requester_name, subject, priority, status, assignee_id)

kmpa_documents         (title, category, version, status, content_md, owner_id)

template_items         (kind, name, description, body_md, category, owner_id)
```

كل جدول: `id uuid pk`, `owner_id uuid`, `created_at`, `updated_at`, RLS = owners manage own + `is_owner()` bypass. كل جدول مرتبط بقسم يحوي `department_id uuid` (لا FK مباشر — على غرار جداول central الحالية).

### الخدمات والـ hooks

`src/services/departments/*.service.ts` — خدمة لكل دومين بدوال: `list(deptId?)`, `get(id)`, `create(input)`, `update(id, patch)`, `remove(id)`، باستخدام نفس نمط `withAuthorizationAndAudit`.

`src/hooks/departments/*.ts` — React Query hooks: `useHrEmployees(deptId)`, `useCrmCustomers()`, إلخ. مع `queryKeys` موحَّدة و invalidation.

Zod schemas في `src/types/departments/*.ts` لكل كيان.

### ربط التبويبات

كل تبويب يستبدل `data.ts` المحلي بـ hook حقيقي. مثال نموذجي (HR/EmployeesTab):

```text
- before: const [rows] = useState(employeesData)
- after:  const { data: rows = [], isLoading } = useHrEmployees(deptId)
          GenericFormModal.onSubmit → useCreateHrEmployee().mutate
```

ينطبق على ~50+ تبويب. التبويبات التجميعية (Overview, Analytics, Reports) تحسب من نفس الـ hooks محلياً عبر `useMemo`.

### KPIs و Overview
`OverviewTab` لكل قسم يستخدم counts و aggregates من الـ hooks (مثلاً عدد الموظفين النشطين، إجمالي قيمة الفرص، الميزانية المصروفة). لا حاجة لـ RPCs في هذه المرحلة.

### Mock removal
- إزالة `data.ts` من كل مجلد قسم.
- تحديث `docs/MOCK_INVENTORY.md` لشطب الصفوف 5-14.
- إضافة سطر إغلاق P3.b في `.lovable/plan.md`.

### الترتيب الزمني (سأنفّذها بالتسلسل في هذه الجلسة)

1. **Migration واحد كبير**: كل الجداول + RLS + indexes.
2. **Services**: 7 ملفات خدمة (hr, crm, financial, legal, brand, marketing, csr, kmpa, templates).
3. **Hooks + Zod**: hooks لكل خدمة.
4. **ربط التبويبات قسماً قسماً**: HR → CRM → Financial → Legal → Brand → Marketing → CSR → KMPA → Templates → Training.
5. **تنظيف**: حذف `data.ts`، تحديث المستندات.

### تحفّظات
- لا يوجد Seed تجريبي — التبويبات ستبدأ فارغة وتمتلئ بالـ CRUD من الواجهة.
- التبويبات الفرعية المعقدة جداً (مثل Brand/Templates التي تحوي معاينة ملفات) ستربط على مستوى البيانات فقط؛ معاينة الملفات تبقى placeholder حتى يتم تفعيل Storage upload.
- لن أُضيف `useMockHr` flags — الـ design-mock يُحذف نهائياً وفق رغبتك.

### حجم العمل المتوقع
- 1 migration (~700 سطر SQL)
- ~9 خدمات (~1500 سطر)
- ~9 ملفات hooks (~600 سطر)
- ~50+ تبويب يُعدَّل (تبديل مصدر البيانات + ربط الـ mutations)

### المخاطر
- قد لا يكتمل ربط جميع التبويبات الـ50+ في جلسة واحدة بدون regressions. سأنفّذ على دفعات وأبلّغك بعد كل قسم. إذا أردت إيقاف بعد قسم معيّن لمراجعة، أخبرني.

هل أبدأ بالـ migration؟
---

## P3.b — حالة الإغلاق (دفعة أولى)

✅ **منجَز في هذه الجلسة:**
- Migration كامل: 22 جدول دومين (HR/CRM/Financial/Legal/Brand/Marketing/CSR/KMPA/Templates) + RLS (owners manage own + is_owner bypass) + indexes + update triggers
- `src/types/departments/index.ts` — Zod schemas + TS types لكل الجداول
- `src/services/departments/_factory.ts` + `index.ts` — Generic CRUD factory + 22 خدمة جاهزة
- `src/hooks/departments/index.ts` — React Query hooks (useList/useOne/useCreate/useUpdate/useRemove) لكل دومين
- **تبويب نموذجي مربوط بالكامل**: `HR/EmployeesTab` (قراءة/إضافة/تعديل/حذف من `hr_employees`، الحقول الغنية في `metadata` jsonb)

🟡 **متبقّي (للجلسات التالية):**
- ربط باقي تبويبات HR: Attendance, Training, Performance, Partners, Recruitment
- ربط تبويبات CRM: Customers, Opportunities, Activities, Service
- ربط تبويبات Financial: Budgets, Transactions, Analysis (Invoices مربوطة سلفًا)
- ربط Legal/Brand/Marketing/CSR/KMPA/Templates
- تبويبات Overview/Analytics/Reports تُحسب من نفس الـ hooks
- حذف ملفات `data.ts` بعد اكتمال ربط كل قسم
- تحديث `MOCK_INVENTORY.md`

البنية التحتية جاهزة بالكامل — كل تبويب باقٍ هو تطبيق نفس النمط على `HrEmployees`/`CrmCustomers`/إلخ.

## P3.b — Operations Board (دفعة ثانية)

✅ **منجَز:**
- إعادة كتابة `src/components/OperationsBoard/useTabData.ts` ليُجمِّع كل تبويب من جداول central + departments حقيقيةً:
  - `overview`: projects/tasks/crm_customers/crm_service_tickets
  - `finance`: financial_budgets + financial_transactions + invoices (monthlyBudget, cashFlow, KPIs)
  - `projects`: projects (تصنيف delayed/at-risk/on-track + progress من metadata)
  - `marketing`: marketing_campaigns + marketing_leads (ROAS per channel)
  - `hr`: hr_employees + hr_attendance + hr_performance_reviews
  - `clients`: crm_customers + crm_opportunities + crm_service_tickets + legal_contracts (funnel + portfolioHealth)
  - `reports`: kmpa_documents + counts (projects, invoices) + popularCategories
- حذف `src/components/OperationsBoard/mockData.ts` نهائيًا — لا توجد بيانات تجريبية في لوحة Operations.
