# LEGACY SPEC AUDIT — مراجعة الوثيقة القديمة مقابل الكود

> **المصدر القديم:** "الوثيقة التوصيفية الشاملة لنظام سـوبــرا للإدارة الشاملة" (المُحمَّلة في المحادثة) + توصيف "SoaBra – The Brain" + `project-knowledge` المرفقة بالمشروع.
>
> **القاعدة الذهبية:** لا تعديل على الوثيقة القديمة. هذه الوثيقة تُصنّف بنودها فقط.
>
> **التصنيفات المستخدمة:** `Accurate | Partially Accurate | Outdated | Planned/Vision | Unsupported | Conflicting`.

---

## 1. التقنيات والمعمارية العامة

| البند من الوثيقة القديمة | التصنيف | السبب | الدليل |
|---|---|---|---|
| استخدام Supabase كـ backend | `Accurate` | مُثبَت في المشروع | `src/integrations/supabase/client.ts`, `supabase/config.toml` |
| وجود Node.js API منفصل | `Outdated/Conflicting` | لا يوجد server في المستودع، الـ Frontend يستهلك Supabase مباشرة | `package.json` (لا dependencies لـ express/fastify) |
| معمارية Microservices + Kubernetes + Istio + gRPC | `Planned/Vision` | غير منفّذة، المشروع SPA + Supabase | كامل بنية `src/` |
| Identity & RBAC Service مستقلة | `Planned/Vision` | غير موجودة، RBAC حاليًا داخل Supabase RLS فقط | `supabase/migrations/*` |
| Service Mesh + Pod Security Policies | `Unsupported` | لا أثر لها | لا |
| Feature-Sliced Design + FSD Public API | `Accurate` | منفّذة فعليًا في `src/features/planning/` | `src/features/planning/index.ts` |
| Engine Microkernel للكانفاس | `Accurate` | مُنفَّذ كاملًا | `src/engine/canvas/{kernel,graph,…}/` |
| استخدام Zustand للحالة | `Accurate` | منفّذ | `src/stores/*` |

---

## 2. نظام الصلاحيات RBAC/ABAC

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| 18 دور تنفيذي (Owner, CISO, DPO, Infra Admin, Finance Admin, …) | `Planned/Vision` | الموجود فعليًا 3 أدوار على مستوى السبورة فقط | `enum board_role: host/editor/viewer` |
| نظام موافقات متدرّج (Approval Levels) | `Planned/Vision` | غير منفّذ | لا |
| JIT Access (ساعتان كحد أقصى) | `Planned/Vision` | غير منفّذ | لا |
| Break-Glass للـ Owner | `Planned/Vision` | غير منفّذ | لا |
| Separation of Duties Matrix | `Planned/Vision` | غير منفّذ | لا |
| Access Review Campaigns كل 3 أشهر | `Planned/Vision` | غير منفّذ | لا |
| ABAC على departmentId/projectId/countryCode/dataSensitivity | `Partially Accurate` | منفّذ جزئيًا فقط لأمر Smart Elements | `src/features/planning/domain/policies/authorization.ts` |
| Geo-IP + MFA إلزامي خارج SA/QA | `Unsupported` | غير منفّذ | لا |
| KMS Key Rotation كل 90 يوم | `Planned/Vision` | غير منفّذ | لا |
| SCIM 2.0 للتزويد الآلي | `Planned/Vision` | غير منفّذ | لا |
| سياسات Supabase RLS حقيقية | `Accurate` | موجودة على معظم الجداول | `supabase/migrations/*` |

---

## 3. التكاملات بين الوحدات

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| التكامل التلقائي عند إنشاء مشروع جديد (ميزانية + CRM + قانوني + موارد بشرية + علامة) | `Planned/Vision` | الواجهات موجودة جزئيًا، لكن لا توجد أوتوميشن تربطها | `ProjectWorkspace.tsx` (Mock فقط) |
| تدفّق المعلومات بين الوحدات بدون إعادة إدخال | `Partially Accurate` | جزئي داخل Planning فقط، الإدارات منفصلة | `src/features/planning/state/store.ts` |
| التحليل المتقاطع للأداء/الرضا/المالية | `Planned/Vision` | غير منفّذ | لا |
| لوحات معلومات تنفيذية موحّدة | `Partially Accurate` | `OperationsBoard` يقدّم نسخة مبسّطة على mock data | `src/components/OperationsBoard/mockData.ts` |
| سيناريو إدارة أزمة مالية (تنبيهات + تحليل + تدخّل قانوني) | `Planned/Vision` | غير منفّذ | لا |
| Event Bus بـ Outbox/DLQ + Kafka | `Planned/Vision` | معرّف فقط في ملف `.txt`، لا تنفيذ | `prisma/V2.prisma.additions.txt` |

---

## 4. الذكاء الاصطناعي

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| AI Gateway موصّلات لتحليل الشذوذ | `Unsupported` | غير موجود كخدمة، فقط Edge Function وحيدة | `supabase/functions/smart-elements-ai/` |
| Smart Command Bar في Planning | `Accurate` | منفّذ | `src/features/planning/ui/PlanningCommandDeck.tsx` |
| Contract-First Smart Elements (Zod) | `Accurate` | منفّذ بالكامل | `src/types/smart-elements.ts`, `src/stores/smartElementsStore.ts` |
| تتبّع أوامر AI مع explainability | `Accurate` | منفّذ بـ DB + RLS | `supabase/migrations/20260428120000_add_ai_command_traces.sql` |
| تحليل سلوكي/ذكاء عاطفي/توصيات استراتيجية | `Planned/Vision` | غير منفّذ | لا |
| استخدام نماذج محلية في المتصفح | `Accurate` | `@huggingface/transformers` مثبّتة | `package.json` |

---

## 5. التدقيق والمراقبة (Audit/Logging)

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| تكامل SIEM/SOC (Splunk/ELK) | `Unsupported` | غير منفّذ | لا |
| PagerDuty للحوادث الحرجة | `Unsupported` | غير منفّذ | لا |
| Audit شامل لكل عملية | `Partially Accurate` | الجداول موجودة، لكن `auditService` Mock | `src/services/audit.ts` (تعليق صريح Mock) |
| تسجيل فيديو لجلسات Break-Glass | `Planned/Vision` | غير منفّذ | لا |
| Telemetry Events | `Accurate` | جدول مع RLS | جدول `telemetry_events` |
| Op Log للسبورة | `Accurate` | منفّذ مع Realtime | جدول `op_log` |

---

## 6. التصميم البصري (Design System)

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| IBM Plex Sans Arabic | `Accurate` | معتمد في `tailwind.config` و `state/types.ts` | `DEFAULT_TOOL_SETTINGS.text.fontFamily` |
| RTL-first + Logical CSS Properties | `Accurate` | منفّذ كقاعدة Core memory | `mem://architecture/rtl-layout-governance` |
| Glassmorphism للـ Overlays فقط، أسطح ثابتة بيضاء عالية التباين | `Accurate` | مُلزَم كقاعدة معمارية | `mem://architecture/ui-system-governance-contract` |
| نصف قطر 24px للبطاقات الرئيسية | `Accurate` | منفّذ | `mem://style/radius-and-surface-standards` |
| Premium Chart Spec (إخفاء المحاور، ChartTooltipShell) | `Accurate` | منفّذ | `mem://style/premium-chart-specification` |
| KPI animation بـ useAnimatedNumber | `Accurate` | منفّذ | `src/hooks/useAnimatedNumber.ts` |
| Visual Data Component Library (10 primitives) | `Accurate` | منفّذ | `src/components/shared/`, `mem://architecture/visual-data-component-library` |
| AppDashboardGrid بـ 12 عمود | `Accurate` | منفّذ | `mem://architecture/grid-layout-governance` |

---

## 7. وحدة التخطيط التشاركي

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| كانفاس لانهائي مع zoom/pan | `Accurate` | منفّذ | `src/features/planning/canvas/viewport/InfiniteCanvas.tsx` |
| Mind Map بنود ديناميكية + موصّلات عالمية | `Accurate` | منفّذ | `src/features/planning/elements/mindmap/` |
| Smart Pen مع تعرّف أشكال | `Accurate` | منفّذ | `src/utils/shapeRecognition.ts` |
| Frame Tool بـ drag & drop containers | `Accurate` | منفّذ | `mem://features/frame-tool/*` |
| WebRTC Voice في الكانفاس | `Accurate` | منفّذ | `src/engine/canvas/voice/webrtcVoice.ts` |
| Real-time sync مع locking | `Accurate` | منفّذ | `RealtimeSyncManager.tsx` |
| Board Invite بـ tokens آمنة + RPC | `Accurate` | منفّذ | RPC `validate_board_invite_token` |
| Snapshots للسبورات | `Accurate` | جدول + UI | جدول `snapshots` |
| Operational Transform | `Accurate` | منفّذ | `src/engine/canvas/transform/operationalTransform.ts` |
| Spatial Indexing للأداء | `Accurate` | منفّذ | `src/engine/canvas/spatial/spatialIndex.ts` |

---

## 8. الإدارات والمشاريع

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| 10 إدارات (Brand, CRM, CSR, Financial, HR, KMPA, Legal, Marketing, Templates, Training) | `Accurate` (UI) / `Mock` (data) | الواجهات موجودة، البيانات mock عدا Invoices | `src/components/DepartmentTabs/*` |
| ربط الإدارات بالمشاريع تلقائيًا | `Planned/Vision` | غير منفّذ، الجدول `department_projects` موجود لكن غير مستخدم | migration `20260430090000` |
| ProjectsColumn + ProjectPanel + OperationsBoard | `Accurate` (UI) / `Mock` (data) | الواجهات منفّذة، البيانات mock | `ProjectWorkspace.tsx` |
| إدارة المهام بـ @dnd-kit | `Accurate` | منفّذ | `mem://features/project-management/draggable-task-list` |
| نموذج Board/Department/Project/Task/Tool/EngineJob المركزي | `Planned/Vision` | في DB منذ migration `20260430090000`، لا UI | المعمارية المستهدفة |

---

## 9. الأمان والخصوصية

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| TLS 1.3 + HSTS + CSP | `Partially Accurate` | يدار من Lovable/Supabase افتراضيًا، لا تكوين خاص في المستودع | إعدادات المستضيف |
| RS256 + AES-256-GCM للـ JWT | `Partially Accurate` | يستخدم Supabase JWT الافتراضي | `@supabase/supabase-js` |
| Prepared statements/ORM آمن | `Accurate` | عبر Supabase JS Client | `src/integrations/supabase/client.ts` |
| MFA إلزامي للأدوار الحساسة | `Planned/Vision` | غير منفّذ | لا |
| تشفير Cold Storage بـ Glacier | `Unsupported` | غير منفّذ | لا |
| Refresh Token rotation عبر OAuth 2.0 Revocation | `Partially Accurate` | يأتي افتراضيًا من Supabase | `auth-js` |
| Safe Math evaluation بدلًا من eval() | `Accurate` | منفّذ | `mem://security/safe-formula-evaluation-math` |
| Security Definer Views آمنة | `Accurate` | معالجة سابقة | `mem://security/security-definer-views-mitigated` |
| RPC آمن للتحقق من invite tokens | `Accurate` | منفّذ | `validate_board_invite_token` |

---

## 10. السيناريوهات العملية

| البند | التصنيف | السبب | الدليل |
|---|---|---|---|
| سيناريو إنشاء مشروع جديد بكل التكاملات | `Planned/Vision` | غير منفّذ، إنشاء المشروع يكتفي بإضافة كائن للـ state المحلي | `ProjectWorkspace.tsx` (`handleProjectAdded`) |
| سيناريو إدارة الموارد البشرية بـ Hiring API + Onboarding + Training | `Planned/Vision` | غير منفّذ | لا |
| سيناريو إدارة العمليات المالية بـ Expense API متدرّج | `Partially Accurate` | Modal للمصروف موجود + جداول Invoices منفّذة، لكن لا workflow متعدّد المستويات | `src/components/ProjectPanel/ExpenseModal.tsx` |
| سيناريو حادث أمني بـ Incident Response + Forensic | `Planned/Vision` | غير منفّذ | لا |

---

## 11. خلاصة المراجعة

- **النوايا المفيدة في الوثيقة القديمة** (الـ RBAC المؤسسي + التكاملات الذكية + Event Bus + Audit الشامل + سيناريوهات الأزمات) **محفوظة كرؤية**، تنتقل إلى `TARGET_ARCHITECTURE_SPECIFICATION.md` و `MIGRATION_PLAN.md`.
- **ما هو دقيق ومطابق للكود** (الـ Design Tokens + Planning Module + Smart Elements + Engine Microkernel + RTL/Glass Governance) يبقى مرجعًا تشغيليًا.
- **الـ Outdated/Unsupported** (Node.js API, Microservices, SCIM, SIEM/PagerDuty, Identity Service مستقلة) **يجب إزالته من أي قراءة مستقبلية للنظام**.
- **التضارب الجوهري:** الوثيقة القديمة تصف نظامًا مؤسّسيًا متعدّد الخدمات، بينما الواقع SPA + Supabase. التوصية: عدم الرجوع للوثيقة القديمة كمصدر حقيقة.
