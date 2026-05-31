# Canvas Architecture - بنية اللوحة
## نظرة عامة على المعمارية

```
┌─────────────────────────────────────────────────────────────────┐
│                         Canvas Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ CanvasBoard │  │CanvasToolbar│  │BottomToolbar│             │
│  │  (Main UI)  │  │  (Top Bar)  │  │  (Dock)     │             │
│  └──────┬──────┘  └─────────────┘  └─────────────┘             │
│         │                                                        │
│  ┌──────▼──────────────────────────────────────────────────┐   │
│  │              Infinite Canvas Container                    │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │              Canvas Elements Layer                  │ │   │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │ │   │
│  │  │  │Shape │ │ Text │ │Image │ │Smart │             │ │   │
│  │  │  └──────┘ └──────┘ └──────┘ └──────┘             │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │              Grid & Selection Layer                 │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## هيكل المتجر (Store Structure)

### Zustand Store Architecture
يستخدم النظام Zustand مع نمط Slices لفصل المسؤوليات:

```
canvasStore
├── ElementsSlice      → إدارة العناصر (CRUD)
├── SelectionSlice     → إدارة التحديد
├── ViewportSlice      → التكبير والتحريك
├── HistorySlice       → Undo/Redo
├── ToolsSlice         → الأدوات النشطة
├── LayersSlice        → إدارة الطبقات
├── PenSlice           → أداة الرسم
├── FrameSlice         → إطارات التجميع
└── MindmapSlice       → الخرائط الذهنية
```

### ElementsSlice (src/stores/canvas/elementsSlice.ts)
```typescript
interface ElementsSlice {
  elements: CanvasElement[];
  
  // CRUD Operations
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  
  // Batch Operations
  moveElements: (ids: string[], deltaX: number, deltaY: number) => void;
  resizeElements: (ids: string[], scaleX: number, scaleY: number, origin: Point) => void;
  rotateElements: (ids: string[], angle: number, origin: Point) => void;
  
  // Transforms
  flipHorizontally: (ids: string[]) => void;
  flipVertically: (ids: string[]) => void;
  alignElements: (ids: string[], alignment: AlignmentType) => void;
  
  // Grouping
  groupElements: (ids: string[]) => void;
  ungroupElements: (groupId: string) => void;
  
  // Locking
  lockElements: (ids: string[]) => void;
  unlockElements: (ids: string[]) => void;
}
```

### SelectionSlice (src/stores/canvas/selectionSlice.ts)
```typescript
interface SelectionSlice {
  selectedElementIds: string[];
  selectionBox: SelectionBox | null;
  
  // Selection Operations
  selectElement: (id: string) => void;
  deselectElement: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggleSelection: (id: string) => void;
  setSelectedElements: (ids: string[]) => void;
  
  // Box Selection
  startBoxSelection: (startPoint: Point) => void;
  updateBoxSelection: (currentPoint: Point) => void;
  endBoxSelection: () => void;
}
```

### ViewportSlice (src/stores/canvas/viewportSlice.ts)
```typescript
interface ViewportSlice {
  viewport: {
    zoom: number;      // 0.1 - 3.0
    pan: { x: number; y: number };
  };
  settings: ViewportSettings;
  
  // Zoom Operations
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  resetViewport: () => void;
  
  // Pan Operations
  setPan: (pan: Point) => void;
  
  // Settings
  updateSettings: (settings: Partial<ViewportSettings>) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  toggleMinimap: () => void;
}
```

### HistorySlice (src/stores/canvas/historySlice.ts)
```typescript
interface HistorySlice {
  history: {
    past: CanvasElement[][];
    future: CanvasElement[][];
  };
  
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}
```

## البنية الأساسية (Core Architecture)

### Canvas Kernel (src/core/canvasKernel.ts)
المصدر الوحيد للحقيقة لتحويلات الإحداثيات:

```typescript
class CanvasKernel {
  // تحويل الإحداثيات
  screenToWorld(screenX, screenY, camera, containerRect): Point;
  worldToScreen(worldX, worldY, camera, containerRect): Point;
  screenDeltaToWorld(deltaX, deltaY, zoom): Point;
  
  // CSS Transforms
  getCanvasTransform(camera): string;
  getFixedLayerTransform(camera): string;
  
  // حسابات الحدود
  calculateBounds(elements): Bounds;
  distance(p1, p2): number;
  boundsIntersect(a, b): boolean;
  pointInBounds(point, bounds): boolean;
  
  // Grid Snapping
  snapToGrid(point, gridSize, enabled): Point;
  snapBoundsToGrid(bounds, gridSize, enabled): Bounds;
  
  // Viewport
  getVisibleBounds(camera, width, height): Bounds;
  calculateZoomToFit(bounds, width, height, padding): { zoom, pan };
}
```

### Interaction State Machine (src/core/interactionStateMachine.ts)
آلة الحالة للتفاعلات:

```
┌─────────┐
│  IDLE   │◄─────────────────────────────────────┐
└────┬────┘                                       │
     │ pointerdown                                │
     ▼                                            │
┌─────────────┐     ┌───────────┐     ┌─────────┤
│  DRAGGING   │────►│  RESIZING │────►│ ROTATING│
└─────────────┘     └───────────┘     └─────────┘
     │                    │                 │
     ▼                    ▼                 ▼
┌───────────┐       ┌──────────┐      ┌─────────┐
│BOX_SELECT │       │  TYPING  │      │ DRAWING │
└───────────┘       └──────────┘      └─────────┘
     │                    │                 │
     └────────────────────┴─────────────────┘
                          │
                          ▼
                    ┌──────────┐
                    │CONNECTING│
                    └──────────┘
```

### Snap Engine (src/core/snapEngine.ts)
نظام المحاذاة الذكية:

```typescript
interface SnapEngine {
  // أنواع المحاذاة
  snapToGrid(point: Point, gridSize: number): Point;
  snapToElements(element: Element, others: Element[]): SnapResult;
  snapToGuides(point: Point, guides: Guide[]): Point;
  
  // حسابات المحاذاة
  findNearestSnapPoint(point: Point, candidates: Point[]): Point | null;
  calculateAlignmentGuides(element: Element, others: Element[]): Guide[];
}
```

## Selectors المحسّنة

### Memoized Selectors (src/stores/canvas/selectors.ts)
```typescript
// العناصر المرئية (حسب الطبقات)
export const selectVisibleElements = (state) => CanvasElement[];

// العناصر المحددة
export const selectSelectedElements = (state) => CanvasElement[];

// العناصر في viewport
export const selectElementsInViewport = (state, bounds) => CanvasElement[];

// العناصر حسب النوع
export const selectElementsByType = (state, type) => CanvasElement[];

// إحصائيات الكانفاس
export const selectCanvasStats = (state) => CanvasStats;

// الطبقة النشطة
export const selectActiveLayer = (state) => LayerInfo | undefined;

// العناصر المجمّعة
export const selectGroupedElements = (state, groupId) => CanvasElement[];

// مسح Cache
export const clearSelectorCache = () => void;
```

## مخطط العلاقات بين الملفات

```
src/
├── core/
│   ├── canvasKernel.ts         # تحويلات الإحداثيات
│   ├── interactionStateMachine.ts
│   ├── snapEngine.ts           # المحاذاة
│   ├── gridRenderer.ts         # الشبكة
│   └── eventPipeline.ts        # معالجة الأحداث
│
├── stores/
│   ├── canvasStore.ts          # المتجر الرئيسي
│   └── canvas/
│       ├── elementsSlice.ts
│       ├── selectionSlice.ts
│       ├── viewportSlice.ts
│       ├── historySlice.ts
│       ├── toolsSlice.ts
│       ├── layersSlice.ts
│       ├── penSlice.ts
│       ├── frameSlice.ts
│       ├── mindmapSlice.ts
│       ├── selectors.ts        # Memoized selectors
│       └── helpers.ts          # دوال مساعدة
│
├── components/Planning/
│   ├── CanvasBoard.tsx         # المكون الرئيسي
│   ├── CanvasToolbar.tsx       # شريط الأدوات
│   ├── BottomToolbar.tsx       # Dock سفلي
│   ├── CanvasElement.tsx       # عنصر واحد
│   ├── SelectionOverlay.tsx    # طبقة التحديد
│   └── ...
│
├── types/
│   ├── canvas.ts               # أنواع الكانفاس
│   ├── canvas-elements.ts      # أنواع العناصر
│   ├── arrow-connections.ts    # أنواع الأسهم
│   └── smart-elements.ts       # العناصر الذكية
│
└── hooks/
    ├── useCanvasKeyboardNav.ts # التنقل بلوحة المفاتيح
    ├── useCanvasSelection.ts   # إدارة التحديد
    └── useCanvasGestures.ts    # إيماءات اللمس
```

## أفضل الممارسات

### 1. استخدام Canvas Kernel
```typescript
// ✅ صحيح
import { canvasKernel } from '@/core/canvasKernel';
const worldPos = canvasKernel.screenToWorld(e.clientX, e.clientY, camera, rect);

// ❌ خطأ - لا تحسب يدوياً
const worldPos = {
  x: (e.clientX - rect.left - pan.x) / zoom,
  y: (e.clientY - rect.top - pan.y) / zoom
};
```

### 2. استخدام Selectors
```typescript
// ✅ صحيح - استخدم selectors المحسّنة
const visibleElements = selectVisibleElements(state);

// ❌ خطأ - لا تفلتر يدوياً في كل render
const visibleElements = state.elements.filter(el => el.visible);
```

### 3. Batch Operations
```typescript
// ✅ صحيح - عملية واحدة
moveElements(selectedIds, deltaX, deltaY);

// ❌ خطأ - عمليات متعددة
selectedIds.forEach(id => updateElement(id, { position: newPos }));
```

## الأداء

- **Memoization**: جميع الـ selectors محسّنة بـ memoization
- **Viewport Culling**: فقط العناصر المرئية يتم رسمها
- **Batch Updates**: التحديثات المجمّعة لتقليل re-renders
- **Web Workers**: العمليات الثقيلة تُنفذ في workers

---
*آخر تحديث: 2024-12*
