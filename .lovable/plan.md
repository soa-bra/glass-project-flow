
# خطة المطابقة الشاملة مع المواصفات (Spec-Driven Alignment)

## القرارات المعتمدة من الأسئلة المفتوحة
1. **إعادة التسمية**: `social → csr`, `research → kmpa` (rename فعلي في الكود + ميغرايشن قاعدة).
2. **الإدارات الناقصة** (BCM, Partnerships, Knowledge): إنشاء **جداول حد أدنى** في Supabase الآن (DB3) للحصول على CRUD حقيقي.
3. **لوحات الإعدادات التقنية** (Engine Jobs, Dependency Graph, Tools Marketplace, Admin Roles): تبقى **كما هي مع غلاف رفيع** يجعلها spec-compliant بصرياً عبر `WorkspaceShell`.
4. **الإيقاع**: **وقفة مراجعة بعد كل مرحلة** P1→P7 قبل الانتقال للتالية.

---

## نظرة عامة
الهدف: تحويل التطبيق ليُقاد بالكامل من `src/config/app-spec.ts` (15 لوحة / 124 تبويب / 476 صندوق / 184 منبثقة) عبر `SpecDrivenDashboard` + `TabRenderer` + `BoxRenderer` + `Box-Kit` كمصدر وحيد للحقيقة (SSoT).

```text
spec(xlsx) → app-spec.ts → SpecDrivenDashboard → TabRenderer → BoxRenderer → BOX_KIT_REGISTRY
                                    ↓
                           slotProps (data hooks)
                                    ↓
                        src/services/* (Supabase central + departments)
```

---

## المراحل (7) مع وقفة مراجعة بعد كل واحدة

### P1 — إغلاق فجوات الأساس (Foundation Hardening)
**الهدف**: ضمان جاهزية البنية قبل التوسع.
- إكمال مكوّنات Box-Kit الناقصة (TextBlock, FormField, FileDrop, KpiTrend) وتسجيلها في `registry.ts`.
- توحيد `WorkspaceShell` (header + sidebar + breadcrumb + RTL) في `src/components/shared/WorkspaceShell/`.
- إضافة `slotProps` resolver في `TabRenderer` (يربط `boxId → dataHook`).
- مسار معاينة `/spec-preview/:dashboardId/:tabId` لاختبار أي تبويب من المواصفة.
- **خرج**: build أخضر + اختبار smoke لكل componentRef.
- 🛑 **وقفة مراجعة**.

### P2 — إعادة التسمية + جداول الإدارات الناقصة (DB3 Migration)
**الهدف**: مطابقة قائمة الإدارات الـ12 من المواصفة.
- Rename: `social → csr`, `research → kmpa` في:
  - `DepartmentsSidebar.tsx` (مفتاح + label)
  - `FeatureDepartmentPanel` وكل المراجع
  - مسارات `/departments/:key`
- إنشاء جداول Supabase (RLS owners-only):
  - `bcm_plans`, `bcm_risks`, `bcm_incidents`
  - `partnerships_partners`, `partnerships_agreements`, `partnerships_activities`
  - `knowledge_articles`, `knowledge_categories`, `knowledge_resources`
- إضافة Generic CRUD لكل جدول عبر `_factory.ts` الموجود.
- إضافة المفاتيح الثلاثة الجديدة لـ `DepartmentsSidebar` (BCM, Partnerships, Knowledge).
- 🛑 **وقفة مراجعة**.

### P3 — Projects Workspace (إدارة المشاريع: 8 تبويبات)
- بناء `ProjectsWorkspace` يستهلك `app-spec.dashboards.projects`.
- ربط 8 تبويبات (Overview, Phases, Tasks, Team, Budget, Risks, Documents, Reports) عبر `TabRenderer`.
- استخدام `centralProjectsService` + `centralTasksService` (موجودة).
- 29 صندوق + 18 منبثقة عبر `BoxRenderer` + `ModalShell`.
- 🛑 **وقفة مراجعة**.

### P4 — Departments Workspace (12 إدارة، دفعتان)
**الهدف**: تفعيل كل التبويبات الـ94 spec-driven.
- **دفعة A**: HR, Finance, Legal, Marketing, CRM, Brand (موجودة جزئيًا — تحويل للـ`TabRenderer`).
- **دفعة B**: CSR, KMPA, Training, BCM, Partnerships, Knowledge (الستة الجديدة/المُعاد تسميتها).
- كل إدارة: ربط slotProps بهوكاتها في `src/hooks/departments/`.
- 🛑 **وقفة مراجعة بعد كل دفعة** (A ثم B).

### P5 — Archive Workspace (9 فئات)
- جدول `archive_documents (id, owner_id, category, title, file_url, version, tags[], metadata jsonb, status)` مع RLS.
- خدمة `archiveService` مع filter حسب `category`.
- إضافة `TemplatesArchivePanel` إلى المواصفة كفئة معتمدة.
- تحويل كل الـ `CategoryPanelFactory` إلى `SpecDrivenDashboard` بفئات spec.
- 🛑 **وقفة مراجعة**.

### P6 — Settings Workspace (13 فئة)
- جدول `user_settings (user_id, category, payload jsonb)` مع RLS (`user_id = auth.uid()`).
- خدمة `settingsService` مع upsert by `(user_id, category)`.
- 9 لوحات إعدادات (Account, Security, Integrations, Notifications, AI, Theme, Data Governance, Users/Roles, Audit) → مربوطة بـ `user_settings`.
- 4 لوحات تقنية (Engine Jobs, Dependency Graph, Tools Marketplace, Admin Roles) → **غلاف رفيع** فقط: تُلَف بـ `WorkspaceShell` + breadcrumb spec بدون تعديل منطقها.
- 🛑 **وقفة مراجعة**.

### P7 — التحقق النهائي + CI Gates
- اختبار تغطية: كل `componentRef` في spec له entry في `BOX_KIT_REGISTRY`.
- اختبار: كل `tabId` في spec يُرسم بدون أخطاء عبر `TabRenderer`.
- ESLint rule: منع imports عميقة للـ Box-Kit primitives (تجبر استخدام registry).
- `pnpm test` + supabase linter أخضر.
- توثيق نهائي في `docs/specs/INDEX.md`.
- 🛑 **مراجعة نهائية + إغلاق**.

---

## التقنيات الرئيسية (Technical Section)

### قاعدة البيانات (P2 + P5 + P6)
- 9 جداول إدارات جديدة + `archive_documents` + `user_settings` = **11 ميغرايشن**.
- كل الجداول: `owner_id uuid not null` + RLS policy `owner = auth.uid() OR is_owner(auth.uid())`.
- تريغر `update_updated_at_column` موجود — يُعاد استخدامه.

### الواجهة
- `SpecDrivenDashboard({ dashboardId })` يقرأ من `APP_SPEC.dashboards[dashboardId]`.
- `TabRenderer({ tab, slotProps })` يرسم `tab.boxes` بـ `BoxRenderer`.
- `BoxRenderer({ box, slotProps[box.id] })` يحل `componentRef` من registry.

### الخدمات
- `_factory.ts` الحالي يولد CRUD + audit + Zod للجداول الجديدة دون كتابة يدوية.

---

## Out of Scope
- نقل لوحات الإعدادات التقنية إلى spec-native (يبقى غلاف رفيع).
- تعميق منطق البيانات الوهمية في `TemplatesArchivePanel` إلى backend (يُربط لـ `archive_documents` في P5 لكن دون migrate للبيانات التاريخية).

## Orphans (للنقاش لاحقاً، لا حذف الآن)
- `BaseArchivePanel` fallback (يبقى للفئات غير المعروفة).
- `GenericSettingsPanel` (يبقى للفئات غير المعرفة في spec).

## Acceptance Checklist
- ✅ 12 إدارة ظاهرة في `DepartmentsSidebar` بأسماء spec.
- ✅ 124 تبويب يُرسم عبر `TabRenderer` بدون errors.
- ✅ 476 صندوق resolvable من `BOX_KIT_REGISTRY`.
- ✅ 11 جدول جديد في Supabase مع RLS.
- ✅ CRUD حقيقي على الإدارات الـ3 الجديدة (BCM/Partnerships/Knowledge).
- ✅ `Archive` و `Settings` يقرآن/يكتبان من `archive_documents` و `user_settings`.
- ✅ اختبار `app-spec.coverage.test.ts` أخضر.

---

**التنفيذ يبدأ بعد موافقتك على P1، ثم نقف بعد كل مرحلة للمراجعة.**
