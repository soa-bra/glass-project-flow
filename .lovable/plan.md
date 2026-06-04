# Wave B — موصلات بمظهر Qlik + لوحة خصائص + تحويل إلى كيان + توسيع البطاقة + أدوات التنفيذ

أربعة محاور، الأول مُعاد ترتيبه ليحقّق **المطابقة البصرية الصارمة** للموصلات كما في الصور المرفقة (Qlik Data Flow، n8n، إلخ).

---

## 1) إصلاح المظهر البصري للموصل ليطابق الصور المرفقة ⭐

### 1.1 نقاط الربط (Anchors) — تعديل `RootConnector.tsx` → `ConnectionAnchors`

| السمة | الحالي | المطلوب (مطابق للصور) |
|---|---|---|
| العدد | 1 نقطة (top-right) | **4 نقاط**: منتصف top/right/bottom/left |
| الموقع | إزاحة 14/12px خارج الزاوية | **على منتصف الحافة بالضبط** (بدون إزاحة خارجية) |
| الحجم المرئي | r=6px ثم 8 | **r=4px** (نقطة صغيرة دقيقة) |
| اللون | افتراضي | `#9CA3AF` (`token: ink_30/border`) في الحالة العادية |
| الظهور | دائم على البطاقة | **يظهر فقط عند hover** على العنصر الأب (opacity 0/100) |
| Hit area | r=18 | يبقى r=18 شفاف لسهولة الإمساك |
| Hover state | لا يوجد | تضخّم خفيف إلى r=6 + لون داكن `#0B0F12` |

### 1.2 مسار الموصل — تحويل من Bezier إلى Orthogonal

- استبدال حساب `path` في `RootConnectorDisplay` باستخدام **`connectorRouter` الموجود** في `src/engine/canvas/routing/connectorRouter.ts` بوضع `'orthogonal'`.
- يخرج المسار من المرساة المحددة على المصدر باتجاه عمودي على الحافة، يلتف بزوايا 90°، وينتهي على مرساة الهدف.
- نصف قطر الزوايا: `borderRadius: 4px` (rounded corners خفيف على الانعطاف، كما في Qlik).
- يدعم RTL: في الافتراضي يخرج من `left` لـ `right` للهدف عندما dir=rtl.

### 1.3 خصائص الخط البصرية

| الخاصية | القيمة |
|---|---|
| `stroke` (افتراضي) | `#C7CDD4` (رمادي محايد فاتح) |
| `stroke` (hover/selected) | `#0B0F12` (`ink`) |
| `strokeWidth` | `1.5px` افتراضي، `2px` عند selected |
| `strokeLinecap` | `round` |
| `strokeLinejoin` | `round` |
| رأس السهم الافتراضي | **بدون** (none) — يطابق Qlik تمامًا |
| نقطة النهاية | دائرة صغيرة `r=3` بنفس لون الخط |

### 1.4 إزالة الشارات/الكبسولات على الخط

- إزالة badge `getRelationshipTypeLabel` المعروض على منتصف الموصل في الحالة الافتراضية.
- يظهر التسمية فقط عند `isSelected` أو عند hover، ككبسولة بيضاء صغيرة بظل خفيف.

### 1.5 طبقة Hover للبطاقة

- في `SmartElementRenderer` (أو المغلّف العام للعناصر): إضافة `data-hover` يقلب visibility الـ Anchors.
- لا تظهر anchors لعناصر type `root_connector` نفسها (لا anchors على anchors).

---

## 2) ConnectorPropertiesPanel — لوحة خصائص الموصل

**ملف جديد:** `src/features/planning/ui/toolbars/floating-bar/groups/ConnectorActions.tsx`

يظهر في `FloatingBar` عندما `firstElement.type === 'root_connector'` ويسبق فرع `isVisualDiagramSelection`:

| العنصر | الخيارات | الحقل |
|---|---|---|
| اللون | 6 ألوان من الـtoken (`accent.blue/green/yellow/red` + ink + neutral) + ColorPicker | `data.color` |
| النمط | متصل / متقطع `8 4` / منقّط `2 4` | `data.style` |
| السماكة | 1 / 1.5 / 2 / 3 px | `data.strokeWidth` |
| الاتجاه | بلا / → / ← / ↔ | `data.arrowStart`, `data.arrowEnd` |
| نوع العلاقة | dropdown بالـ7 أنواع الموحّدة | `data.connectionType` |

التحديث يمر عبر `updateElement` ثم `syncRootConnectors` يكتب إلى `smart_connectors` (آلية موجودة من Wave A).

**تكامل في `FloatingBar.tsx`:** فرع `isConnectorSelection` قبل المنطق الحالي.

---

## 3) إجراء "تحويل إلى كيان" داخل AIMenuDropdown

**ملفات جديدة:**
- `src/features/planning/services/convertElementToEntity.ts` — مَصنع تحويل
- `src/features/planning/ui/dialogs/ConvertToEntityDialog.tsx` — معاينة قبل الإنشاء

**اقتراح ذكي حسب السياق:**
```
sticky قصير (<50 char)          → ملاحظة
sticky يحتوي تاريخ/keywords     → مهمة
smart_project_card              → مشروع
smart_task_card                 → مهمة
smart_crm_card                  → فرصة CRM
brainstorming/idea              → فكرة
default                         → ملاحظة
```

**Dialog معاينة** (يستخدم `sb-modal-shell`): يعرض الحقول المستخرجة قابلة للتعديل (عنوان/وصف/تاريخ/مسؤول/نوع الكيان كـSelect). عند التأكيد:
1. إنشاء سجل عبر الخدمة المركزية المناسبة (`projectsService.create` / `tasksService.create` / …)
2. تحديث العنصر بـ `linked_entity_id` و `linked_entity_type` (الأعمدة موجودة من Wave A.5)
3. تبديل أيقونة العنصر لحالة "🔗 مرتبط" + toast نجاح

**تكامل في `AIMenuDropdown.tsx`:** بند جديد "تحويل إلى كيان" في الأعلى مع badge اقتراح النوع المتوقّع.

---

## 4) "توسيع البطاقة" — تحويل صندوق عرض إلى صندوق تنفيذ

**ملف جديد:** `src/features/planning/ui/ExpandableCardShell.tsx`

Dialog (Desktop) بـ `sb-modal-shell` يحتوي:
- رأس البطاقة + زر "تصغير"
- جسم ديناميكي حسب `linked_entity_type`:
  - `project` → `ProjectExecutionPanel` placeholder (مراحل + ميزانية + فريق)
  - `task` → `TaskExecutionPanel` placeholder (حالة + تاريخ + مسؤول + تعليقات)
  - `note` → `NoteExecutionPanel` (محرر نص بسيط)

**التفعيل من الشريط الطافي:** زر "توسيع" في `ElementActions`. مرئي فقط إذا `linked_entity_id` موجود، وإلا يقترح "تحويل إلى كيان" أولًا.

عند الفتح، يضاف إطار أخضر مميّز + badge "تنفيذ" على الصندوق الأصلي على الكانفس.

---

## 5) أداة "أدوات التنفيذ" — Execution Tools Palette

**ملف جديد:** `src/features/planning/ui/toolbars/ExecutionToolsPalette.tsx`

Popover من زر جديد في `BottomToolbar.tsx` (أيقونة `Boxes`، اختصار `E`). شبكة بطاقات قابلة للسحب:

**صناديق تنفيذ:** بطاقة مشروع، مهمة، CRM، مالية، CSR
**صناديق عرض بيانات:** Gantt، Kanban، Timeline، Decision Matrix، KPI، Chart

السحب يضيف عنصرًا في موضع الإفلات (يعيد استخدام `addElement` بنوع smart مناسب). البطاقات تستعمل `BaseBox` المعتمد.

---

## ترتيب التنفيذ

1. **المظهر البصري للموصل** (الأهم) — الخطوات 1.1 → 1.5
2. **ConnectorPropertiesPanel**
3. **Execution Tools Palette**
4. **تحويل إلى كيان** + Dialog معاينة
5. **توسيع البطاقة** + ExpandableCardShell

كل محور قابل للاختبار مستقلًا.

---

## أسئلة قبل التنفيذ

1. **اللون الافتراضي للموصل:** `#C7CDD4` (رمادي Qlik) أم `ink_30` من الـtoken (`rgba(11,15,18,0.30)` ≈ نفس اللون عمليًا)؟ الأخير أكثر تناسقًا مع نظام التصميم.
2. **rounded corners عند انعطاف 90°:** هل تريد زوايا قائمة حادة (n8n) أم منحنية خفيفة 4px (Qlik)؟
3. **التحويل إلى كيان للمشروع:** هل أستدعي `centralProjectsService` أم أكتفي بـ stub محلي الآن؟
4. **توسيع البطاقة:** placeholders بسيطة كافية أم تريد ربطًا فعليًا بواجهات `Operations`/`Departments` الموجودة؟

سأبدأ بمجرد الاعتماد. الجواب على أي من الأسئلة سيُحدِّد القرار، وإلا سأستخدم: `ink_30` + زوايا 4px + stub محلي + placeholders.
