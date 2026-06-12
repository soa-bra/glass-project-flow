# 🏗️ Planning Feature Architecture

## نظرة عامة

تتبع ميزة التخطيط معمارية طبقات صارمة لضمان الفصل بين المسؤوليات وقابلية الصيانة.

```
src/features/planning/
├── ui/           → واجهة المستخدم (React Components)
├── canvas/       → مكونات اللوحة التفاعلية
├── elements/     → عناصر اللوحة (MindMap, Diagram, Smart)
├── ai/           → ميزات AI التخطيطية المحلية (اختياري عند الحاجة)
├── execution/    → توسعات التنفيذ داخل التخطيط (عند الحاجة)
├── domain/       → منطق الأعمال (Commands, Policies)
├── state/        → إدارة الحالة (Zustand Slices)
├── integration/  → تكامل خارجي (Collaboration, Export)
└── index.ts      → Barrel Export
```


## 🧭 نقاط الدمج المعتمدة

`src/features/planning/` هو مسار الكانفس الرسمي والوحيد. لا تُنشئ `src/features/planning-canvas/` لأي ميزة تخطيط أو ذكاء مشروع؛ أي فجوة يجب حلّها داخل شجرة `planning/` الحالية أو عبر طبقة façade موثقة تستدعي هذه الشجرة.

- `src/features/planning/ui/PlanningCanvas.tsx` هو نقطة دمج واجهة التخطيط الرسمية. كل smart conversion أو execution expansion أو project-intelligence UI يجب أن يُركّب منه أو من مكوّن فرعي داخل `ui/` يستدعيه.
- `src/features/planning/canvas/viewport/InfiniteCanvas.tsx` هو مضيف تفاعل اللوحة المباشر: pan/zoom، selection، drag، drop/paste، gestures، وعرض عناصر canvas. لا تُنقل هذه المسؤوليات إلى مسار جديد أو طبقة موازية.
- `src/features/planning/state/` هو مصدر حالة الكانفس: العناصر، viewport، selection، layers، history، وأي slices أو selectors مرتبطة بها. أي façade خارجي يجب أن يقرأ أو يكتب عبر هذا المصدر بدل إنشاء store مكرر.
- `src/features/planning/services/smartConversion.service.ts` هو نقطة بداية التحويل الذكي الحالية، ومكان عقد `SmartConversionPayload` ونتائج التحويل. أي orchestration أعلى يجب أن يفوّض إليه بدل إعادة تعريف منطق التحويل الأساسي.
- `src/features/planning/integration/connectors/` هو مكان الموصلات الذكية داخل التخطيط: adapters، relationship types، وأي wiring يربط عناصر التخطيط ببيانات أو علاقات خارجية.
- `src/features/ai/context/` هو مكان بناء وتنظيف سياق AI قبل تمريره إلى خدمات الذكاء: context builders، sanitizers، وسياسات تقليل/تنقية السياق.
- أي `project-intelligence` جديد يجب أن يكون façade أو orchestration layer فوق المسارات أعلاه فقط، لا طبقة canvas أو state أو connector مكررة. يجب أن يعيد استخدام `PlanningCanvas` و`InfiniteCanvas` و`state/` و`smartConversion.service.ts` و`integration/connectors/` و`features/ai/context/`.
- المسارات الجديدة المسموحة للتوسّع يجب أن تبقى داخل `src/features/planning/`: استخدم `ai/` للذكاء التخطيطي إن احتجت واجهة محلية، `integration/connectors/` للربط، و`execution/` لتوسعات التنفيذ.

## 🧾 مصادر الأنواع الوحيدة

لا تُعرّف أنواع `CanvasElement` أو `SmartConnector` أو `SmartConversionPayload` في أكثر من مصدر. الاستيراد أو إعادة التصدير مسموحان؛ إعادة إنشاء interface/type بنفس الاسم ممنوعة.

| النوع | المصدر الوحيد المعتمد | ملاحظات الاستخدام |
|------|------------------------|-------------------|
| `CanvasElement` | `src/features/planning/domain/types/canvas.types.ts` | يمكن الوصول إليه عبر re-export مثل `src/types/canvas.ts`، لكن لا تُنشئ تعريفًا جديدًا له في `state/` أو `ui/` أو `project-intelligence`. |
| `SmartConnector` | `src/types/central/index.ts` أو alias مباشر من جدول `smart_connectors` في طبقة الخدمة المركزية | استخدم النوع المركزي للصف المخزّن، واجعل adapters في `src/features/planning/integration/connectors/` تحوّل البيانات بدل تعريف نوع موازٍ. |
| `SmartConversionPayload` | `src/features/planning/services/smartConversion.service.ts` | هذا هو عقد طلب التحويل الذكي؛ أي UI أو façade يجب أن يستورده من الخدمة، لا أن ينسخه. |

## 📊 مخطط التبعيات

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
│  (panels, toolbars, overlays, widgets, pages)               │
└─────────────────────┬───────────────────────────────────────┘
                      │ يستورد من ↓
┌─────────────────────▼───────────────────────────────────────┐
│                     Canvas Layer                             │
│  (viewport, selection, gestures, layers)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │ يستورد من ↓
┌─────────────────────▼───────────────────────────────────────┐
│                    Elements Layer                            │
│  (mindmap, diagram, text, smart)                            │
└─────────────────────┬───────────────────────────────────────┘
                      │ يستورد من ↓
┌─────────────────────▼───────────────────────────────────────┐
│                     State Layer                              │
│  (store, slices, selectors)                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │ يستورد من ↓
┌─────────────────────▼───────────────────────────────────────┐
│                    Domain Layer                              │
│  (types, commands, policies)                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔒 قواعد الحوكمة (مفروضة بـ ESLint)

| القاعدة | الوصف | الملف المتأثر |
|---------|-------|---------------|
| **UI ≠ Engine** | UI لا تستورد من `engine/` مباشرة | `ui/**/*` |
| **Engine ≠ React** | Engine خالية من React imports | `engine/**/*` |
| **Slices = Reducers** | State slices لا تحتوي business logic | `state/slices/**/*` |
| **Elements ≠ UI** | Elements لا تستورد من panels/toolbars | `elements/**/*` |
| **Canvas ≠ Integration** | Canvas لا تستورد من integration | `canvas/**/*` |
| **No Legacy** | ممنوع استيراد من `components/Planning/` | `**/*` |

## 📁 تفاصيل الطبقات

### UI Layer (`ui/`)
```
ui/
├── panels/      → لوحات جانبية (Properties, Tools)
├── toolbars/    → أشرطة الأدوات (Bottom, Canvas, Navigation)
├── overlays/    → نوافذ منبثقة (Dialogs, Popovers)
├── widgets/     → مكونات صغيرة (Minimap, AI Assistant)
├── PlanningCanvas.tsx
├── PlanningEntryScreen.tsx
└── PlanningCommandDeck.tsx
```

### Canvas Layer (`canvas/`)
```
canvas/
├── viewport/    → التحكم بالعرض (InfiniteCanvas, Grid)
├── selection/   → التحديد (BoundingBox, ResizeHandle)
├── gestures/    → الإدخال (Pen, Frame, Touch)
└── layers/      → طبقات الرسم (Snap, Elements)
```

### Elements Layer (`elements/`)
```
elements/
├── mindmap/     → خرائط ذهنية (Node, Connector)
├── diagram/     → مخططات (VisualNode, Arrow)
├── text/        → نصوص (Editor, Renderer)
└── smart/       → عناصر ذكية (Kanban, Gantt, Cards)
```

### State Layer (`state/`)
```
state/
├── slices/      → Zustand slices (elements, viewport, selection)
├── store.ts     → Main store configuration
├── selectors.ts → Memoized selectors
└── types.ts     → State types
```

### Integration Layer (`integration/`)
```
integration/
├── collaboration/  → تعاون (Cursors, Sync, Locks)
├── connectors/     → موصلات ذكية وعلاقات عناصر التخطيط
├── export/         → تصدير (PDF, Image, JSON)
├── accessibility/  → إمكانية الوصول
├── persistence/    → حفظ البيانات
└── telemetry/      → تتبع الأحداث
```

### AI / Connectors / Execution (`ai/`, `integration/connectors/`, `execution/`)
```
ai/                     → واجهات AI التخطيطية المحلية التي يركّبها PlanningCanvas عند الحاجة
integration/connectors/ → منطق ربط العناصر أو تحويل العلاقات إلى إجراءات وموصلات ذكية
execution/              → execution expansion، job affordances، وحالات التنفيذ داخل التخطيط
```

هذه المجلدات اختيارية وتُنشأ عند وجود ميزة فعلية، لكنها تبقى داخل `src/features/planning/` ولا تستبدل `ui/PlanningCanvas.tsx` أو `canvas/viewport/InfiniteCanvas.tsx`. سياق AI العام يُبنى ويُنظّف في `src/features/ai/context/` بدل إنشاء نسخة داخل التخطيط.

## ✅ أمثلة صحيحة

```typescript
// ✅ UI تستورد من canvas
import { InfiniteCanvas } from '@/features/planning/canvas';

// ✅ UI تستورد من state
import { useCanvasStore } from '@/stores/canvasStore';

// ✅ Canvas تستورد من elements
import { SmartElementRenderer } from '@/features/planning/elements';

// ✅ Elements تستورد من domain
import type { SmartElementType } from '@/types/smart-elements';
```

## ❌ أمثلة خاطئة

```typescript
// ❌ UI تستورد من engine مباشرة
import { CanvasKernel } from '@/engine/canvas/kernel';
// الحل: استخدم canvas/ أو hooks

// ❌ Engine تستورد React
import React from 'react';
// الحل: Engine يجب أن تكون pure TypeScript

// ❌ استيراد من المسار القديم
import { KanbanBoard } from '@/components/Planning/SmartElements';
// الحل: استخدم @/features/planning/elements/smart
```

## 🔄 كيفية الإضافة

### إضافة مكون UI جديد
1. راجع أولًا `ui/PlanningCanvas.tsx` لتحديد نقطة التركيب، و`canvas/viewport/InfiniteCanvas.tsx` إذا كان التغيير يخص تفاعل اللوحة.
2. أنشئ الملف في `ui/panels/` أو `ui/widgets/` أو أحد المسارات المتخصصة (`ai/`, `integration/connectors/`, `execution/`) حسب المسؤولية.
3. أضف التصدير المناسب في أقرب `index.ts`.
4. استورده عبر `@/features/planning/...` ولا تستخدم مسارًا جديدًا خارج `src/features/planning/`.

### إضافة عنصر ذكي جديد
1. أنشئ الملف في `elements/smart/`
2. أضف التصدير في `elements/smart/index.ts`
3. سجّله في `SmartElementRenderer`

### إضافة slice جديد
1. أنشئ الملف في `state/slices/`
2. دمجه في `state/store.ts`
3. أضف selectors في `state/selectors.ts`
