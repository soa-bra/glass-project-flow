# خطة مطابقة الكود مع الملفات الأربعة المرفقة

> **المرجع المعتمد**: 4 ملفات Markdown مرفوعة، وهي تمثيل نصّي مطابق لـ `docs/specs/*.xlsx`. هذه الملفات بدورها تُولِّد `src/config/app-spec.ts` آليًا (15 لوحة • 124 تبويب • 476 صندوق • 184 نافذة) — محروسة بـ `app-spec.coverage.test.ts`.
> **بنية جاهزة**: `BoxRenderer` + `TabRenderer` + `BOX_KIT_REGISTRY` تعمل، لكن لا توجد لوحة واحدة تستهلكها فعلًا. كل اللوحات حاليًا hand-coded.

---

## 1) خريطة الفجوات (Diff Table)

### أ) Departments Workspace
| # | المكان | الموجود الآن | المطلوب من المواصفة | نوع التغيير | المخاطر |
|---|---|---|---|---|---|
| D1 | `src/components/DepartmentsSidebar.tsx` | 9 مفاتيح: `financial, legal, marketing, hr, crm, social, training, research, brand` | 12 مفتاحًا: `financial, legal, marketing, hr, crm, csr, bcm, training, partnerships, kmpa, knowledge, brand` (مع تسميات سوبرا الرسمية) | modify | متوسط (يلامس التنقّل) |
| D2 | `src/components/DepartmentPanel/DepartmentPanel.tsx` | يستخدم `social` ضمن `specializedDepartments` | استبدال بـ `csr` + إزالة `research` (يصبح `kmpa`) + إضافة `bcm, partnerships, knowledge` | modify | متوسط |
| D3 | `src/components/DepartmentTabs/` | 9 مجلدات (Brand, CRM, CSR, Financial, HR, KMPA, Legal, Marketing, Training) | إضافة 3: `BCM/, Partnerships/, Knowledge/` كل مجلد يحوي `index.ts` يصدّر `<dept>Dashboard.tsx` | create | منخفض |
| D4 | تبويبات كل إدارة موجودة | hand-coded، لا تطابق أعداد المواصفة | كل Dashboard يصبح غلافًا فوق `<SpecDrivenDashboard dashboardKey="…"/>` يقرأ التبويبات من `APP_SPEC` | modify | متوسط |
| D5 | جميع الصناديق داخل الإدارات | hand-coded JSX | يُرسم عبر `<TabRenderer tab={…}/>` مع `slotProps` من hook إدارة-تبويب | modify | متوسط |
| D6 | `src/components/DepartmentTabs/CSR/` (الكود) | dir موجود لكن الشريط الجانبي يسميه `social` | توحيد التسمية على `csr` وإزالة الإسناد القديم | modify | منخفض |
| D7 | `src/components/DepartmentTabs/KMPA/` | dir موجود؛ الشريط الجانبي يسميه `research` | توحيد التسمية على `kmpa` | modify | منخفض |

### ب) Projects Workspace (ProjectManagementBoard)
| # | المكان | الموجود الآن | المطلوب | نوع التغيير | المخاطر |
|---|---|---|---|---|---|
| P1 | `src/components/ProjectManagement/ProjectManagementBoard.tsx` | 8 تبويبات hand-coded | تبويبات بنفس الـ codes (overview, tasks, finance, team, client, files, templates, reports) لكن تُرسم عبر `<TabRenderer>` للصناديق الـ 29 المنصوصة | modify | عالٍ (لوحة محورية) |
| P2 | صناديق ضمن كل تبويب | مكونات يدوية (ProjectCardGrid, ProjectProgressBar…) | كل صندوق يطابق ref المنصوص (`…overview.project-summary`, `…overview.phase-progress`, `…overview.cards-grid`، إلخ) ويستهلك `slotProps` من البيانات الفعلية | modify/wrap | عالٍ |
| P3 | النوافذ المنبثقة الـ 18 | غير ممنهجة | `src/components/ProjectManagement/popups/registry.ts` يربط كل `popupRef` بـ Component، ويُفتح عبر `useModal()` | create | متوسط |

### ج) Archive Workspace
| # | المكان | الموجود | المطلوب | نوع | المخاطر |
|---|---|---|---|---|---|
| A1 | `src/components/ArchiveSidebar.tsx` | الفئات الفعلية | يجب أن يحوي 9 فئات بنفس الأكواد: `documents, projects, hr, financial, legal, organizational, knowledge, templates, policies` | verify/modify | منخفض |
| A2 | `src/components/ArchivePanel/categories/` | 8 لوحات (Documents, Financial, HR, Knowledge, Legal, Organizational, Policies, Projects) | إضافة **TemplatesArchivePanel.tsx** الناقصة | create | منخفض |
| A3 | بنية كل فئة | hand-coded | كل فئة تعرض 3 صناديق المنصوصة (`…header-actions`, `…search`, `…records-list`) عبر `<TabRenderer>` | modify | متوسط |
| A4 | `archive_documents` table | غير موجود | جدول واحد + RLS + خدمة `archive.service` تستخدمه كل الفئات مع `category` discriminator | create (migration) | عالٍ (data) |

### د) Settings Workspace
| # | المكان | الموجود | المطلوب | نوع | المخاطر |
|---|---|---|---|---|---|
| S1 | `src/components/SettingsSidebar.tsx` | فئات حسب الكود | 13 فئة بأكواد: `account, security, notifications, integrations, ai, theme, data-governance, users-roles, audit, engine-jobs, dependency-graph, tools-marketplace, admin-roles` | verify/modify | منخفض |
| S2 | `src/components/SettingsPanel/categories/` | 9 لوحات (Account, AI, AuditCenter, DataGovernance, Integrations, Notifications, Security, Theme, UsersRoles) | لفّ 4 ميزات موجودة كـ Settings panels: `EngineJobsSettingsPanel`, `DependencyGraphSettingsPanel`, `ToolsMarketplaceSettingsPanel`, `AdminRolesSettingsPanel` (تستورد من `src/features/*` كما هي) | create (wrappers) | منخفض |
| S3 | `CategoryPanelFactory.tsx` | يربط 9 فئات | توسيع الـ map ليغطي 13 | modify | منخفض |
| S4 | كل لوحة فئة | hand-coded | كل لوحة تعرض صناديقها المنصوصة (مثل 4 صناديق account: disclaimer/profile-form/password-controls/account-stats) عبر `<TabRenderer>` | modify | متوسط |

### هـ) Box-Kit / Renderers
| # | المكان | الموجود | المطلوب | نوع | المخاطر |
|---|---|---|---|---|---|
| K1 | `src/components/box-kit/registry.ts` | 17 ref | إضافة المراجع المستخدمة في المواصفة وغير المسجّلة: `IPF-TXT-01` (text input)، `IPF-TXA-01` (textarea)، `DAV-TML-01` (timeline)، `DAV-ALR-01` (alert) | create + register | منخفض |
| K2 | `box-kit.registry.completeness.test.ts` | غير موجود | اختبار يفشل إذا ظهر componentRef في `APP_SPEC` بلا تسجيل | create | منخفض |
| K3 | `src/components/workspaces/SpecDrivenDashboard.tsx` | غير موجود | غلاف موحَّد يقرأ تبويبات لوحة من `APP_SPEC`، يرسم شريط تبويبات + `<TabRenderer>` لكل تبويب نشط | create | متوسط |
| K4 | حالة Loading/Empty/Error داخل `BoxRenderer` | لا يوجد | عرض حالات قياسية حسب `slotProps.status` لتقليل تكرار الكود في كل tab adapter | modify | منخفض |

### و) قواعد البيانات والخدمات (للوحات السطح الأربعة)
| # | المكان | الموجود | المطلوب | نوع | المخاطر |
|---|---|---|---|---|---|
| DB1 | لا يوجد | — | جدول `archive_documents(id, category, title, source_module, source_id, file_url, owner_id, tags[], archived_at, status, metadata jsonb)` + RLS (مالك يقرأ/يكتب، صلاحية archive.manage تعرض الكل) | create migration | عالٍ |
| DB2 | لا يوجد | — | جدول `user_settings(user_id, category, value jsonb, updated_at)` + RLS (`auth.uid()=user_id`) + Realtime اختياري | create migration | متوسط |
| DB3 | الجداول الخمسة الجديدة للإدارات الـ 3 الناقصة | — | `bcm_members, bcm_segments, bcm_engagements`, `partnerships_partners, partnerships_opportunities, partnerships_agreements`, `knowledge_articles, knowledge_categories` (الحد الأدنى لإظهار CRUD) + RLS | create migration | عالٍ |

---

## 2) قائمة التنفيذ المرتبة (تنفّذ بهذا الترتيب)

### المرحلة 0 — Box-Kit Completion & Spec-Driven Shell *(مدة قصيرة، يفتح كل الباقي)*
1. **K1**: إضافة Primitives `TextInput`, `TextArea`, `TimelineList`, `AlertBox` تحت `src/components/box-kit/primitives/` وتسجيلها في `registry.ts`.
2. **K2**: إنشاء `src/__tests__/box-kit.registry.completeness.test.ts` يجمع كل `componentRefs` من `APP_SPEC` ويتحقق من وجودها في `BOX_KIT_REGISTRY`.
3. **K4**: تمرير `status: 'loading' | 'empty' | 'error' | 'no-access'` ضمن `slotProps` ودعمه داخل `BoxRenderer`.
4. **K3**: إنشاء `src/components/workspaces/SpecDrivenDashboard.tsx` (يقرأ `APP_SPEC.workspaces[*].dashboards[*]` ويعرض tabs + `<TabRenderer>`) ومساعد `useSlotProps(dashboardKey, tabCode)` يُسلِّم slotProps من hook خارجي.

### المرحلة 1 — Departments (يغطي D1→D7)
5. **D1**: تحديث `DepartmentsSidebar.tsx` لتطابق 12 مفتاحًا (الأكواد + التسميات + الأيقونات للثلاث الجديدة BCM, Partnerships, Knowledge).
6. **D2**: استبدال `social→csr`, `research→kmpa` في `DepartmentPanel.tsx` و`NavigationContext` (و routes إن وجدت) + alias مؤقت لكسر مرجعي لا يحطّم الجلسات.
7. **D3**: إنشاء `src/components/DepartmentTabs/{BCM,Partnerships,Knowledge}/{index.ts, …Dashboard.tsx}` كل واحد غلاف لـ `<SpecDrivenDashboard dashboardKey="bcm"/>` إلخ.
8. **D4**: ربط كل Dashboard لإدارة موجودة (Financial, Legal, …) ليصبح غلافًا لـ `<SpecDrivenDashboard>` مع `specSlots/<dept>/<tab>.ts` لتغذية البيانات من `src/services/departments/*`.
9. **D5+D6+D7**: حذف JSX المكرر داخل تبويبات الإدارات بعد التحقق من تطابق الصناديق مع المواصفة.

### المرحلة 2 — Archive (يغطي A1→A4 + DB1)
10. **DB1**: Migration: إنشاء `archive_documents` + RLS + indexes.
11. **A1**: تعديل `ArchiveSidebar.tsx` لقائمة الـ 9 فئات بأكوادها المنصوصة.
12. **A2**: إنشاء `TemplatesArchivePanel.tsx` (وأي فئة ناقصة بعد التحقق).
13. **A3**: تعديل كل فئة لتستخدم `<SpecDrivenDashboard dashboardKey="archive"/>` فتُرسم 3 صناديق لكل فئة عبر `<TabRenderer>`، مع `useArchive({ category })` كمصدر بيانات.
14. خدمة `src/services/archive.service.ts` فوق Supabase + audit عبر `withAuthorizationAndAudit`.

### المرحلة 3 — Settings (يغطي S1→S4 + DB2)
15. **DB2**: Migration لـ `user_settings` + RLS.
16. **S1**: تعديل `SettingsSidebar.tsx` لـ 13 فئة بأكوادها المنصوصة.
17. **S2**: إنشاء 4 وحدات تغليف تربط ميزات `src/features/{engine-jobs,dependency-graph,tools-marketplace,admin-roles}/` كـ Settings panels.
18. **S3**: تحديث `CategoryPanelFactory.tsx`.
19. **S4**: لكل فئة، تعديل اللوحة لتقرأ صناديقها من المواصفة عبر `<SpecDrivenDashboard dashboardKey="settings"/>` مع `useUserSettings(category)`.

### المرحلة 4 — Projects (يغطي P1→P3) *(أعلى مخاطرة لذا في الأخير)*
20. **P1**: لفّ `ProjectManagementBoard.tsx` بـ `<SpecDrivenDashboard dashboardKey="project-management"/>` مع الإبقاء على كل التبويبات الـ 8 (نفس الأكواد).
21. **P2**: إنشاء `src/components/ProjectManagement/specSlots/<tab>.ts` لكل تبويب يربط 29 BoxRef بـ hooks موجودة (`useUnifiedTasks`, `useProjectFiles`, … إلخ).
22. **P3**: `popups/registry.ts` للنوافذ الـ 18 + استبدال أي Modal منفصل بالاستدعاء عبر `useModal()`.

### المرحلة 5 — التحقق والإغلاق
23. توسيع `app-spec.coverage.test.ts` بفحوصات:
    - كل `BoxRef` في `APP_SPEC` له `slotProps` مُسجَّلة (لا صناديق يتيمة).
    - كل `Popup Ref` مرتبط بمدخل في popups registry للوحته.
24. تشغيل `box-kit.smoke.test.tsx` على كل التبويبات الـ 124 وليس واحدًا لكل workspace.
25. تحديث `docs/specs/INDEX.md` لرفع الحالات من 🟡 إلى ✅.
26. تحديث `.lovable/plan.md`: تعليم R4 (Projects)، R5 (Departments)، R6 (Archive)، R7 (Settings) كمكتملة.

---

## 3) نطاقات خارج هذه الخطة (يُؤجَّل)
- Operations Workspace (لا يقابل أي ملف من الأربعة المرفقة).
- Planning Workspace (نفس السبب).
- إعادة هيكلة الـ 10 طبقات الكاملة (R14).
- تكاملات إنتاجية محددة (R11).

## 4) Orphans (موجود في الكود وغير مذكور في الملفات الأربعة) — تأكيد مطلوب قبل أي حذف
- `src/components/DepartmentTabs/GeneralOverviewTab.tsx` + `ReportsTab.tsx` + `TemplatesTab.tsx` في الجذر (تبدو أدوات عامة، لا تُسند لإدارة بعينها).
- `src/components/SettingsPanel.tsx` (مقابل `SettingsWorkspace.tsx`) — احتمال تكرار.
- `src/components/DepartmentPanel/{Feature,Base}DepartmentPanel.tsx` — يصبح المسار الموحَّد بعد `SpecDrivenDashboard` غير ضروري.
**الاقتراح**: الإبقاء كاحتياط، عدم الحذف ضمن هذه الخطة.

## 5) أسئلة مفتوحة (إجاباتك تحدد التفاصيل)
1. **إعادة التسمية `social→csr`, `research→kmpa`**: هل أُبقي alias مؤقت يقبل القديم لمدة (لتفادي كسر مفضّلات المستخدمين)، أم أُجري rename صارمًا؟
2. **الإدارات الـ 3 الجديدة (BCM, Partnerships, Knowledge)**: أنشئ لها الآن جداول حد أدنى في Supabase (DB3) للحصول على CRUD حقيقي، أم أبدأها كـ UI-only تقرأ من `[]` فارغة وتُكمل لاحقًا؟
3. **Settings "feature" panels** (engine-jobs/dependency-graph/tools-marketplace/admin-roles): اللفّ كما هي مع غلاف رفيع، أم نقلها فعليًا تحت `src/components/SettingsPanel/categories/`؟
4. **حدود الدفعات**: تنفيذ المراحل 0→5 على دفعة واحدة كبيرة، أم وقفة مراجعة بعد كل مرحلة؟

---

استخدمت skill **planning-master** للموازنة spec↔code وتنظيم الخطة، و **source-truth-reconciler** لرصد التعارضات قبل اقتراح أي تغيير.