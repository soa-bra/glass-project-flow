# Step 04 Artifact — Source of Truth Matrix

- التاريخ: 2026-05-01
- الحالة: Approved
- المالك: Lead Architect + FE/BE Leads
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 4)

## Source of Truth Matrix

| Domain | الجدول/الخدمة/الهوك/الواجهة المعتمدة | Active Path | Legacy Path | Mock Path | ملاحظات حوكمة |
|---|---|---|---|---|---|
| Auth | Supabase Auth + `ProtectedRoute` | `src/integrations/supabase/client.ts` → `src/components/auth/ProtectedRoute.tsx` | أي auth بديل خارج Supabase | غير معتمد في المسار النشط | أي bypass للحماية = رفض فوري |
| Projects | `projects.service` + hooks المشاريع | `src/services/central/projects.service.ts` + `src/hooks/useProjectsTimeline.ts` | مسارات legacy غير موصولة بالنطاق النشط | ممنوع بالإنتاج | CRUD يجب أن يمر عبر service مركزي |
| Tasks | `tasks.service` + hooks المهام | `src/services/central/tasks.service.ts` + `src/hooks/useProjectTasks.ts`/`src/hooks/useUnifiedTasks.ts` | أي task path موازٍ غير مركزي | mock task data ممنوع في active path | يمنع local state كمصدر حقيقة |
| Invoices | `invoices.service` + invoice API/hooks | `src/services/invoices/invoices.service.ts` + `src/api/invoices/invoices.ts` + `src/hooks/useInvoices.ts` | مسار invoice legacy الموثق في ADR-001 | mock invoice data ممنوع | ADR-001 مرجع عزل legacy |
| Departments | `departments.service` | `src/services/central/departments.service.ts` | أي قراءة مباشرة متجاوزة service | غير معتمد | shell read فقط ضمن النطاق الحالي |
| Roles/Permissions | RLS + role services | `src/services/central/roles.service.ts` + سياسات RLS | منطق صلاحيات غير مرتبط بـRLS | غير معتمد | سيتم تفصيلها في الخطوة 11 |

## Policy Constraints
1. أي PR يغيّر Source of Truth لأي Domain يجب أن يحدّث هذا الملف ضمن نفس PR.
2. يمنع وجود Active Path متعدد لنفس العملية دون قرار معماري رسمي.
3. أي legacy/mock path يجب أن يبقى خارج التنفيذ النشط حتى قرار حوكمة صريح.

## Evidence Links
1. `docs/recovery/step-02-active-scope-baseline.md`
2. `docs/recovery/step-03-dod-matrix.md`
3. `docs/adr/ADR-001-active-invoice-path.md`
4. `docs/MOCK_INVENTORY.md`

## Acceptance for Step 04
1. كل Domain رئيسي لديه مصدر حقيقة محدد وواضح.
2. تم تمييز active/legacy/mock لكل Domain.
3. لا يوجد Domain بدون مسار معتمد صريح.

## Closure Record
1. أُنشئت مصفوفة Source of Truth كاملة للدومينات الأساسية.
2. أصبحت مرجعًا إلزاميًا لأي تعديل لاحق في مسارات البيانات.
3. أُغلقت الخطوة 4.
