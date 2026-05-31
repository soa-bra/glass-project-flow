# MOCK INVENTORY — جرد بيانات الـ Mock للاستبدال

> **المرجعية:** `MIGRATION_PLAN.md` Phase 4 + خطة v1.0 المرحلة P3.
> **القاعدة:** كل سطر هنا يجب أن يُستبدل بقراءة حقيقية من Supabase قبل الإطلاق. الإبقاء على mock مسموح **فقط** خلف Feature Flag (`VITE_USE_MOCK_*`).

---

## 1. Mock معروف ومرصود (Active)

| # | المسار | السطر/الرمز | المرحلة المستهدفة | Flag |
|---|---|---|---|---|
| 1 | `src/data/mockProjects.ts` | كامل الملف (مصدر بيانات) | P3.1 — Projects | `VITE_USE_MOCK_PROJECTS` |
| 2 | `src/components/ProjectWorkspace.tsx` | `useState(mockProjects)` | P3.1 — Projects | `VITE_USE_MOCK_PROJECTS` |
| 3 | `src/components/OperationsBoard/mockData.ts` | كامل الملف | P3.5 — OperationsBoard | `VITE_USE_MOCK_OPS` |
| 4 | `src/services/audit.ts` | `mockAuditEvents` array + تعليق صريح في الملف | P2 — Audit حقيقي | `VITE_USE_MOCK_AUDIT` |
| 5 | `src/components/DepartmentTabs/Brand/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 6 | `src/components/DepartmentTabs/CRM/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 7 | `src/components/DepartmentTabs/CSR/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 8 | `src/components/DepartmentTabs/Financial/**` | بيانات (عدا Invoices) | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 9 | `src/components/DepartmentTabs/HR/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 10 | `src/components/DepartmentTabs/KMPA/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 11 | `src/components/DepartmentTabs/Legal/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 12 | `src/components/DepartmentTabs/Marketing/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 13 | `src/components/DepartmentTabs/Templates/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 14 | `src/components/DepartmentTabs/Training/**` | بيانات داخلية محلية | P3.3 — Departments | `VITE_USE_MOCK_DEPARTMENTS` |
| 15 | `src/components/ArchiveWorkspace.tsx` | لا مصدر بيانات | P3.7 — Archive | — (يُبنى مباشرة على البيانات الحقيقية) |
| 16 | `src/components/SettingsWorkspace.tsx` | لا مصدر بيانات | P5 | — |

---

## 2. Mock مُتعمَّد (يبقى)

| # | المسار | السبب |
|---|---|---|
| 1 | `src/__tests__/**` | بيانات اختبار شرعية لـ Vitest |
| 2 | `src/stories/*.stories.tsx` | بيانات Storybook |
| 3 | `prisma/V2.prisma.additions.txt` | ملف نصّي مرجعي يُحوَّل إلى migration في P4 |

---

## 3. خطوات الإزالة لكل بند

### النمط القياسي (لكل صف في القسم 1)
1. P1: أُنشئت خدمة CRUD حقيقية في `src/services/central/*.service.ts`.
2. P2: تمت إضافة سياسة تفويض + audit للأمر.
3. P3: تم تبديل الاستهلاك عبر hook حقيقي خلف `if (import.meta.env.VITE_USE_MOCK_X === 'true')`.
4. P3 (نهاية الـ sprint): إزالة الفرع الـ mock + حذف ملف البيانات + رفع الـ flag من `.env.example`.
5. P5: تأكيد عدم وجود استدعاء واحد في build production عبر:
   ```
   bun run build && rg -l "mockProjects|mockData|mockAuditEvents" dist/ || echo "clean"
   ```

---

## 4. سجل التحديث

| التاريخ | التغيير | المُحدِّث |
|---|---|---|
| 2026-04-30 | إنشاء الجرد الأول (P0) | Plan execution |
