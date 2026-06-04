
# خطة إغلاق فجوات لوحة التخطيط الذكية في سـوبــرا
> تحديث شامل لخطة `plan.md` بناءً على الوصف الوظيفي الموسع (AI Buttons / Connectors / Convert / Expand / Execution Tools / Workflows).

---

## 1. جدول الفجوات (Spec ⇄ Code) — Per-File Diff

| # | مكون المواصفة | الكود الحالي | المطلوب | الملف(ات) | نوع التغيير | المخاطر |
|---|---|---|---|---|---|---|
| 1 | إزالة زر AI من الشريط العلوي | `CanvasToolbar.tsx:154` يعرض زر "AI" أخضر/أزرق | حذف الزر + الـ prop `onOpenAI` | `src/features/planning/ui/toolbars/CanvasToolbar.tsx`, `PlanningCanvas.tsx` | modify | low |
| 2 | زر AI بجانب شريط الأدوات (السفلي) | `AIAssistantButton.tsx` ثابت `bottom-6 left-1/2 ml-[420px]` ومنفصل عن `BottomToolbar` | دمجه كعنصر جانبي ضمن `BottomToolbar` (مع `Dock`)، يحترم RTL ويتموضع لوجستياً بجانب dock الأدوات | `src/features/planning/ui/toolbars/BottomToolbar.tsx`, `src/features/planning/ui/widgets/AIAssistantButton.tsx` | modify | low |
| 3 | وضعا AI: محادثة + توليد (Workflow/Docs/Sheets) | `AIAssistantPopover` يفتح محادثة فقط | إضافة Tabs داخل البوب-أوفر: "محادثة" / "إنشاء" (مستند، جدول، Workflow، صندوق تنفيذ، ملخص، مخاطر) | `src/features/planning/ui/widgets/AIAssistantPopover.tsx` | modify | medium |
| 4 | زر AI في الشريط الطافي عند تحديد عناصر | `AIMenuDropdown` موجود ويحوي "تحويل إلى smart element" + تحويل مخصص | إعادة هيكلة القائمة إلى أقسام: **تحويل إلى كيان**، **توسيع البطاقة**، **تحويل إلى عنصر ذكي**، **تلخيص/تحليل/مخاطر** | `src/features/planning/ui/toolbars/floating-bar/components/AIMenuDropdown.tsx` | modify | medium |
| 5 | إجراء "تحويل إلى كيان" (Convert to Entity) | `SmartConversionReviewDialog` يعرض معاينة لتحويل smart → smart فقط؛ لا إنشاء سجلات حقيقية | إضافة مسار `convertElementToEntity` يدعم الأنواع: project, task, budget_line, contract, campaign, csr_initiative, training_program, research_output, knowledge_record, archive_document. يكتب عبر `services/central/{projects,tasks,...}.service.ts` ثم يربط `canvas_element.linked_entity_id` | `src/features/planning/services/convertElementToEntity.ts` (جديد), `SmartConversionReviewDialog.tsx`, `useSmartElementAI.ts` | create+modify | **high** |
| 6 | إجراء "توسيع البطاقة" (Expand) | لا يوجد `isExpanded` في `SmartProjectCard` / `TaskCard` ولا modal | إضافة `ExpandableCardShell` يستخدم `framer-motion layoutId`؛ بطاقة مشروع → يفتح `ProjectManagementBoard` داخل modal/sidebar؛ بطاقة مهمة → يفتح `TaskDetailDrawer`؛ صندوق عرض → يحوّل إلى صندوق تنفيذ | `src/features/planning/elements/smart/ExpandableCardShell.tsx` (جديد), `SmartProjectCard.tsx`, `TaskCard.tsx`, `RootConnectorDisplay.tsx` | create+modify | **high** |
| 7 | أداة "الموصلات (الجذر الذكي)" — Anchor لكل عنصر محدد + Snap على الهدف + تخصيص نمط/اتجاه | `SmartConnectorManager` يعرض anchor واحدة فقط (top-right)، الـSVG `pointerEvents:none` يكسر الإمساك، لا يوجد محرر خصائص للموصل (لون/نمط/اتجاه) في UI | (أ) فصل طبقة SVG للموصلات بـ `pointerEvents:auto` على الـSVG؛ (ب) 4 anchors لوجستية (start/end/top/bottom)؛ (ج) استخدام `viewport.toCanvas` بدل حساب يدوي؛ (د) فلترة `findElementAt` لاستبعاد الإطارات الأمامية؛ (هـ) محرر خصائص الموصل في الشريط الطافي (لون، نمط solid/dashed/dotted، اتجاه single/double، نوع علاقة) | `src/features/planning/canvas/viewport/InfiniteCanvas.tsx`, `SmartConnectorManager.tsx`, `RootConnector.tsx`, `ConnectorPropertiesPanel.tsx` (جديد) | modify+create | **high** |
| 8 | حفظ منطقي للموصل في DB | `syncRootConnectors` يكتب في `planning_elements` فقط؛ `smart_connectors` service موجودة لكن غير مستدعاة | استدعاء `upsertSmartConnector` بعد إنشاء/تحديث + `deleteSmartConnectorByElementId` عند الحذف؛ تمرير `boardId` | `src/features/planning/canvas/viewport/InfiniteCanvas.tsx`, `services/central/smartConnectors.service.ts` | modify | medium |
| 9 | حذف cascading للموصلات عند حذف عنصر طرف | غير موجود في `canvasStore.deleteElements` | عند الحذف: العثور على موصلات root مرتبطة وحذفها قبل العنصر، ثم استدعاء DB cleanup | `src/stores/canvasStore.ts` | modify | medium |
| 10 | أداة "أدوات التنفيذ" (إدراج صناديق عرض/تنفيذ من أقسام أخرى) | غير موجودة كلياً | لوحة جديدة `ExecutionToolsPalette` تظهر في BottomToolbar مفتاح `E`؛ تعرض كاتالوج صناديق `BOX_KIT_REGISTRY` المسموحة بصلاحيات المستخدم (`useCanvasBoxCatalog`)؛ تدعم Drag-to-canvas؛ تنشئ عنصر `canvas_element` نوع `execution_box` بـ `linked_entity_id` + `mode: view\|execution` | `src/features/planning/ui/panels/ExecutionToolsPalette.tsx` (جديد), `src/features/planning/hooks/useCanvasBoxCatalog.ts` (جديد), `BottomToolbar.tsx`, `CanvasElement.tsx` | create+modify | **high** |
| 11 | فرق بصري بين صندوق عرض / تنفيذ / عنصر مرتبط / عنصر AI | لا يوجد | إضافة `EntityLinkBadge` + ring/border state (مرتبط=primary، AI=violet، مقفل=amber) داخل `CanvasElement` | `src/features/planning/elements/CanvasElement.tsx`, `EntityLinkBadge.tsx` (جديد) | create+modify | low |
| 12 | Workflow builder (تدفقات عمل) | غير موجود | **يُرحَّل إلى P9** (خارج نطاق الموجة الأولى) | — | defer | — |
| 13 | تحويل المستند الذكي إلى أرشيف/معرفة | `smart_doc_tool` يولّد فقط؛ لا تحويل لاحق | إضافة action في AI menu للمستندات: "حفظ في الأرشيف"، "إضافة لقاعدة المعرفة" — يكتب عبر `archiveService` و `knowledge_articles` | `SmartDocRenderer.tsx`, `AIMenuDropdown.tsx`, `services/knowledge.service.ts` (جديد) | create+modify | medium |
| 14 | نموذج بيانات: `linked_entity_id` + `linked_entity_type` على عنصر الكانفس | `planning_elements.metadata` jsonb غير منظم | migration إضافة عمودين generated من metadata + index؛ تحديث Zod schema | `supabase/migrations/<new>.sql`, `src/features/planning/domain/types/canvas.types.ts` | create | medium |
| 15 | EntityLink table مستقل للعلاقات الدلالية بين كيانات (غير canvas) | لا يوجد؛ `smart_connectors` يربط canvas elements فقط | جدول جديد `entity_links(source_entity_id, source_type, target_entity_id, target_type, relation_type, direction, confidence, created_by_ai, approved_by)` + RLS | `supabase/migrations/<new>.sql`, `services/central/entityLinks.service.ts` (جديد) | create | medium |
| 16 | AI Context Snapshot يحترم الصلاحيات | `contextBuilder.ts` + `contextSanitizer.ts` موجودان | إضافة فلترة `permission_scope` فعلية: استبعاد عناصر `dataSensitivity > user_clearance` قبل الإرسال للنموذج | `src/features/ai/context/contextBuilder.ts`, `contextSanitizer.ts` | modify | medium |
| 17 | Preview قبل التحويل (إجباري للحساس) | `SmartConversionReviewDialog` يعرض preview بسيط | توسيع الـ dialog ليعرض: الحقول المستخرجة، الكيانات المرتبطة، تحذيرات الصلاحية، زر "تشغيل تحويل منخفض المخاطر تلقائياً" في الإعدادات | `SmartConversionReviewDialog.tsx` | modify | medium |
| 18 | Audit log لكل تحويل/ربط | `smartConnectors.service` يسجّل ✓؛ canvas element trigger موجود ✓؛ لكن تحويل-إلى-كيان لا يسجّل | استدعاء `AuditService.log` في `convertElementToEntity` مع `action='canvas.element.converted_to_entity'` | `src/features/planning/services/convertElementToEntity.ts` | create | low |
| 19 | حالة "مقفل" / Locked by another user | `RealtimeSyncManager` يدعم element locking لكن UI لا يعرضه على البطاقات | إضافة overlay "مقفل من X" + إخفاء AI menu للعنصر | `CanvasElement.tsx`, `FloatingBar.tsx` | modify | low |
| 20 | إخفاء AI tools كلياً للضيف | `useCanvasAIPermissions` موجود لكن لا تطبيق على BottomToolbar's AI button | إضافة guard على `AIAssistantButton` المدموج | `BottomToolbar.tsx` | modify | low |

---

## 2. خطة التنفيذ المرحلية (Phased)

### مرحلة A — إعادة تموضع AI + إصلاح الموصلات (Foundation)
يجب أن تعمل أساسيات الموصلات قبل بناء أي شيء فوقها.
1. **A1** — حذف زر AI من `CanvasToolbar`؛ نقل `AIAssistantButton` ليكون عنصراً داخل `BottomToolbar` كزر أيمن (RTL). (#1، #2، #20)
2. **A2** — إصلاح طبقة أحداث الموصلات: SVG منفصل بـ`pointerEvents:auto`، Anchor خام بدون framer، استخدام `viewport.toCanvas`. (#7 أ–ج)
3. **A3** — Drop targeting صحيح + استجابة بصرية مؤكدة. (#7 د)
4. **A4** — حفظ + cascade delete عبر `smart_connectors`. (#8، #9)
5. **A5** — `ConnectorPropertiesPanel` في الشريط الطافي عند تحديد موصل. (#7 هـ)
> 🛑 **وقفة مراجعة A** — يجب أن يستطيع المستخدم رسم موصل، حفظه، حذف عنصر فيُحذف الموصل، تعديل نمطه.

### مرحلة B — Convert to Entity + Expand Card
6. **B1** — Migration: إضافة `linked_entity_id` + `linked_entity_type` لـ `planning_elements`. (#14)
7. **B2** — خدمة `convertElementToEntity` تدعم 10 أنواع كيانات حقيقية (تكتب في الجداول الفعلية). (#5)
8. **B3** — توسيع `SmartConversionReviewDialog` بالحقول والتحذيرات. (#17)
9. **B4** — `ExpandableCardShell` + ربطه ببطاقة مشروع (`ProjectManagementBoard` modal) وبطاقة مهمة (`TaskDetailDrawer`). (#6)
10. **B5** — إضافة "تحويل إلى كيان" و"توسيع البطاقة" في `AIMenuDropdown`. (#4)
11. **B6** — `EntityLinkBadge` + التمييز البصري + Locked overlay. (#11، #19)
> 🛑 **وقفة مراجعة B** — تحويل ملاحظة "حملة Q3" إلى مشروع حقيقي يظهر في `/projects` + توسيع البطاقة يفتح لوحته.

### مرحلة C — أدوات التنفيذ + AI Generation Mode
12. **C1** — `useCanvasBoxCatalog`: يقرأ `BOX_KIT_REGISTRY` + يصفّيها عبر `usePermission`. (#10)
13. **C2** — `ExecutionToolsPalette` مع Drag-to-canvas + render داخل `CanvasElement` لنوع `execution_box`. (#10)
14. **C3** — وضع "إنشاء" داخل `AIAssistantPopover` (tabs: محادثة/توليد). (#3)
15. **C4** — تحويل المستند الذكي إلى أرشيف/معرفة. (#13)
16. **C5** — `entity_links` table + service + استخدامه في `convertElementToEntity` لتسجيل العلاقات. (#15)
17. **C6** — تحسين سياق AI بحدود الصلاحيات الفعلية + audit التحويلات. (#16، #18)
> 🛑 **وقفة مراجعة C** — يمكن سحب صندوق "ميزانية مشروع" من palette، ربطه ببطاقة المشروع بموصل، وتلخيصه بالـAI.

### مرحلة D — مؤجلة (Out of Scope الآن)
- Workflow visual builder + runner (#12) — مرحلة لاحقة P9.
- Voice/Video in canvas (موجود stub).
- AI image generation داخل الكانفس.

---

## 3. تفاصيل تقنية مختصرة (Technical Section)

### قاعدة البيانات
- **Migration #1** (B1): `ALTER TABLE planning_elements ADD COLUMN linked_entity_id uuid, linked_entity_type text;` + index + Zod update.
- **Migration #2** (C5): `CREATE TABLE entity_links(...)` مع GRANT صارمة + RLS تعتمد `has_permission('entity_links.read')`. تشمل `confidence numeric(3,2)` و `created_by_ai bool` و `approved_by uuid`.

### الـ Stores
- `canvasStore.deleteElements` يستدعي hook جديد `onBeforeElementsDelete` لإطلاق cascade cleanup للموصلات (cleanly testable).
- لا يُضاف state جديد للـ Expand — يستخدم `framer-motion layoutId` + local state داخل الـ shell.

### الموصلات (تفصيل تقني للإصلاح الأساسي)
- إخراج موصلات الكانفس من الـ SVG العام (100000×100000، `pointerEvents:none`) إلى **SVG مخصص** بحجم العالم الفعلي، `pointerEvents:auto`، مع `<g pointerEvents:none>` للموصلات غير المحددة.
- 4 anchors لوجستية (start/end/top/bottom) لكل عنصر محدد، Hit-box نصف قطر 18px شفاف فوق دائرة مرئية r=6.
- `findElementAt(x,y)` يبحث في `visibleElements` reversed، يستبعد `type==='frame'` و `data-connectable===false`.
- تخزين: `planning_element` (visual geometry) + `smart_connectors` (logical edge) بنفس `id`.

### Convert to Entity (تفصيل)
- خريطة الكيانات:
  ```ts
  const ENTITY_CONVERTERS: Record<EntityType, (data) => Promise<{id, route}>> = {
    project: (d) => centralProjectsService.create(d),
    task: (d) => centralTasksService.create(d),
    budget_line: (d) => financeService.createBudgetLine(d),
    contract: (d) => contractService.create(d),
    campaign: (d) => marketingService.createCampaign(d),
    csr_initiative: (d) => csrService.create(d),
    training_program: (d) => hrService.createTraining(d),
    research_output: (d) => kmpaService.createResearch(d),
    knowledge_record: (d) => knowledgeService.create(d),
    archive_document: (d) => archiveService.create(d),
  };
  ```
- يتطلب `requirePermission('<entity>.create')` قبل التنفيذ + يحدّث `linked_entity_id/type` على `planning_element`.

### أدوات التنفيذ
- Catalog item shape: `{ boxId, componentRef, label, departmentId, requiredPermission, supports: ['view','execution'] }`.
- عند الإسقاط: `CanvasElement` بنوع `execution_box` + `metadata.boxRef`؛ يُرسم باستخدام نفس `BoxRenderer` المستخدم في SpecDrivenDashboard لكن داخل غلاف `CanvasExecutionBoxShell`.

---

## 4. Open Questions
1. هل بطاقة المشروع عند Expand تفتح **Modal فوق اللوحة** أم **Drawer جانبي**؟ المواصفة تذكر الاثنين (مكتب=Modal، موبايل=Full-screen).
2. أداة "أدوات التنفيذ" — هل تظهر كـ Palette dock في BottomToolbar أم كـ Sidebar منفصل؟
3. حدود التحويل منخفض المخاطر التي لا تتطلب preview — تحتاج تعريف من المستخدم (مثال: ملاحظة → مهمة بدون تاريخ = منخفض المخاطر؟).
4. `entity_links` — هل نسجل العلاقات الناتجة عن موصلات الكانفس فقط، أم نسمح أيضاً بربط كيانات بدون عناصر كانفس؟

## 5. Orphans (لا حذف)
- `RootConnectorDisplay.tsx` — يبقى لعرض الموصلات كعنصر smart مستقل (لم يذكره الـ spec الجديد).
- `LayoutEngine.tsx` (تخطيط تلقائي للعناصر الذكية) — يبقى كما هو.

## 6. Acceptance Checklist
- ✅ زر AI غير موجود في `CanvasToolbar`؛ موجود بجانب `BottomToolbar` ومخفي للضيف.
- ✅ `AIAssistantPopover` يعرض tab "محادثة" و"إنشاء".
- ✅ `AIMenuDropdown` (الشريط الطافي) يعرض: تحويل إلى كيان / توسيع البطاقة / تحويل إلى عنصر ذكي / تلخيص.
- ✅ نقطة Anchor تظهر على العنصر المحدد فقط؛ السحب يبدأ فوراً؛ تظليل أخضر متقطع على عنصر الهدف.
- ✅ إفلات الموصل ينشئ سجل في `smart_connectors` + planning_element.
- ✅ حذف عنصر طرف يحذف الموصل تلقائياً (client + DB cascade).
- ✅ تحرير لون/نمط/اتجاه الموصل عبر panel في الشريط الطافي.
- ✅ "تحويل إلى مشروع" ينشئ صف فعلي في `projects` ويفتحه في `/projects/:id`.
- ✅ "توسيع" بطاقة مشروع يفتح `ProjectManagementBoard` في modal مع `layoutId` انتقال.
- ✅ "توسيع" بطاقة مهمة يفتح `TaskDetailDrawer`.
- ✅ `ExecutionToolsPalette` (مفتاح E) يعرض صناديق مفلترة بالصلاحيات؛ Drag يُنشئ صندوقاً تنفيذياً مرتبطاً.
- ✅ صناديق العرض/التنفيذ/الكيانات المرتبطة لها تمييز بصري واضح (Badge + ring).
- ✅ `useCanvasAIPermissions` يحجب AI للضيف، و `contextSanitizer` يستبعد بيانات أعلى من clearance المستخدم.
- ✅ كل تحويل يُسجَّل في `audit_logs` بـ `action='canvas.element.converted_to_entity'`.

---

**ابدأ بالموجة A فوراً بعد الموافقة. الموجة B تنتظر إغلاق A. الموجة C تنتظر B. الـWorkflow Builder مؤجل.**
