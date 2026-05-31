# 🏗️ Planning Feature Architecture

## نظرة عامة

تتبع ميزة التخطيط معمارية طبقات صارمة لضمان الفصل بين المسؤوليات وقابلية الصيانة.

```
src/features/planning/
├── ui/           → واجهة المستخدم (React Components)
├── canvas/       → مكونات اللوحة التفاعلية
├── elements/     → عناصر اللوحة (MindMap, Diagram, Smart)
├── ai/           → ميزات AI العامة للتخطيط (عند الحاجة)
├── connectors/   → ربط العناصر/الأدوات/المساحات (عند الحاجة)
├── execution/    → توسعات التنفيذ داخل التخطيط (عند الحاجة)
├── domain/       → منطق الأعمال (Commands, Policies)
├── state/        → إدارة الحالة (Zustand Slices)
├── integration/  → تكامل خارجي (Collaboration, Export)
└── index.ts      → Barrel Export
```


## 🧭 نقاط الدمج المعتمدة

- `ui/PlanningCanvas.tsx` هو المضيف الفعلي للميزات الجديدة داخل Workspace التخطيط؛ أي smart conversion أو execution expansion يجب أن يُركّب منه أو من مكوّن فرعي داخل `ui/` يستدعيه.
- `canvas/viewport/InfiniteCanvas.tsx` هو مضيف تفاعل اللوحة المباشر: pan/zoom، selection، gestures، drop/paste، وعرض عناصر canvas. لا تُنقل هذه المسؤوليات إلى مسار جديد.
- لا تنشئ `src/features/planning-canvas/` إلا بعد توثيق فجوة لا يمكن تغطيتها في `src/features/planning/` وشرح سبب عدم كفاية `PlanningCanvas` و`InfiniteCanvas`.
- المسارات الجديدة المسموحة للتوسّع يجب أن تبقى داخل `src/features/planning/`: استخدم `ai/` للذكاء، `connectors/` للربط، و`execution/` لتوسعات التنفيذ.

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
├── export/         → تصدير (PDF, Image, JSON)
├── accessibility/  → إمكانية الوصول
├── persistence/    → حفظ البيانات
└── telemetry/      → تتبع الأحداث
```

### AI / Connectors / Execution (`ai/`, `connectors/`, `execution/`)
```
ai/           → واجهات وخدمات AI العامة التي يركّبها PlanningCanvas
connectors/   → منطق ربط العناصر أو تحويل العلاقات إلى إجراءات
execution/    → execution expansion، job affordances، وحالات التنفيذ داخل التخطيط
```

هذه المجلدات اختيارية وتُنشأ عند وجود ميزة فعلية، لكنها تبقى داخل `src/features/planning/` ولا تستبدل `ui/PlanningCanvas.tsx` أو `canvas/viewport/InfiniteCanvas.tsx`.

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
2. أنشئ الملف في `ui/panels/` أو `ui/widgets/` أو أحد المسارات المتخصصة (`ai/`, `connectors/`, `execution/`) حسب المسؤولية.
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
