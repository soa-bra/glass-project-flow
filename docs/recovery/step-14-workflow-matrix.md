# Step 14 Workflow Matrix

- التاريخ: 2026-05-05
- الحالة: Done
- المرجع: الحزمة التنفيذية لاستعادة الانضباط الهندسي — الخطوة 14

## Workflow Matrix
| Workflow | Start | Components Involved | Source of Truth | Failure Points | Completion State |
|---|---|---|---|---|---|
| Login | User submits auth credentials | Auth UI, Supabase Auth, ProtectedRoute | Supabase Auth + `src/components/auth/ProtectedRoute.tsx` | invalid credentials, expired session, route guard failure | Done / Step 8 Pass |
| Project create/read | User creates project then reads it from active UI | Project UI, hooks, `src/services/central/projects.service.ts`, Supabase tables | Step 4 SoT + projects service | service error, RLS deny, stale read path | Done / Step 8 Pass |
| Task create/read/update | User creates task, reads it, updates state | Task UI, hooks, `src/services/central/tasks.service.ts`, Supabase tables | Step 4 SoT + tasks service | status mismatch, invalid relation, RLS deny | Done / Step 8 Pass |
| Invoice create/read/update | User creates invoice, reads it, updates it | Invoice UI/API, `src/services/invoices/invoices.service.ts`, `src/api/invoices/invoices.ts` | Active invoice path from Step 4/6 | legacy invoice path usage, RLS deny, item/payment mismatch | Done / Step 8 Pass |
| Department shell read | User opens department shell | Department UI shell, `src/services/central/departments.service.ts`, permissions/RLS | Department service + Step 11 permissions | missing role, RLS deny, inactive service import | Done / Step 8 Pass |

## Workflow Governance Rules
1. كل workflow يجب أن يملك Source of Truth واحدًا فقط.
2. يمنع إدخال mock/local-state كمصدر حقيقة في أي workflow نشط.
3. أي failure جديد يجب أن يسجل في Step 15 backlog قبل توسيع النطاق.
4. أي workflow جديد يجب أن يلتزم بـ UI → hook → service → Supabase.

## Acceptance Check
1. كل workflow رئيسي لديه بداية ومكونات ومصدر حقيقة ونقاط فشل وحالة اكتمال.
2. المصفوفة مرتبطة بأدلة Step 8 وStep 11 وStep 15.
3. لا يوجد workflow رئيسي بدون owner تشغيلي ضمن المسار النشط.

## Closure Record
تم إغلاق الخطوة 14 بإصدار Workflow Matrix رسمية للمسارات الأساسية الخمسة.
