# Interaction Flow - تدفق التفاعلات

## نظرة عامة

يوثق هذا الملف كيفية معالجة تفاعلات المستخدم في نظام الكانفاس، من الأحداث الخام إلى تحديثات الحالة.

## أوضاع التفاعل (Interaction Modes)

```typescript
type InteractionMode =
  | 'idle'       // لا تفاعل نشط
  | 'panning'    // تحريك الكانفاس (Space + drag أو Middle click)
  | 'dragging'   // سحب عناصر محددة
  | 'boxSelect'  // تحديد مستطيل
  | 'typing'     // تحرير نص
  | 'drawing'    // رسم حر بالقلم
  | 'connecting' // رسم سهم/اتصال
  | 'resizing'   // تغيير حجم عنصر
  | 'rotating';  // تدوير عنصر
```

## مخطط انتقالات الحالة

```
                                    ┌──────────────────┐
                                    │                  │
                                    ▼                  │
┌─────────┐  click empty    ┌───────────┐  Escape     │
│  IDLE   │◄───────────────│ BOX_SELECT│─────────────┘
└────┬────┘                 └───────────┘
     │
     ├─── click element ──────► DRAGGING
     │                              │
     │                              ├── pointerup → IDLE
     │                              │
     │                              └── Shift → 45° snap
     │
     ├─── click resize handle ──► RESIZING
     │                              │
     │                              └── pointerup → IDLE
     │
     ├─── click rotate handle ──► ROTATING
     │                              │
     │                              └── pointerup → IDLE
     │
     ├─── Space + drag ─────────► PANNING
     │    أو Middle click           │
     │                              └── release → IDLE
     │
     ├─── double-click text ────► TYPING
     │                              │
     │                              ├── Escape → IDLE
     │                              └── click outside → IDLE
     │
     ├─── Pen tool active ──────► DRAWING
     │                              │
     │                              └── pointerup → IDLE
     │
     └─── Arrow tool drag ──────► CONNECTING
                                    │
                                    ├── snap to element → create connection
                                    └── pointerup → IDLE
```

## معالجة الأحداث (Event Handling)

### PointerDown
```typescript
function handlePointerDown(e: PointerEvent) {
  const worldPos = canvasKernel.screenToWorld(
    e.clientX, e.clientY, camera, containerRect
  );
  
  // 1. فحص Space للتحريك
  if (isSpacePressed) {
    setMode('panning');
    return;
  }
  
  // 2. فحص إذا كان الكلick على عنصر
  const hitElement = findElementAtPoint(worldPos);
  
  if (hitElement) {
    // فحص handles
    const handle = findHandleAtPoint(worldPos, hitElement);
    
    if (handle?.type === 'resize') {
      setMode('resizing');
      setResizeState({ element: hitElement, handle });
    } else if (handle?.type === 'rotate') {
      setMode('rotating');
    } else {
      // بدء السحب
      if (!selectedIds.includes(hitElement.id)) {
        // تحديد جديد
        if (e.shiftKey) {
          toggleSelection(hitElement.id);
        } else {
          setSelectedElements([hitElement.id]);
        }
      }
      setMode('dragging');
    }
  } else {
    // بدء تحديد مستطيل
    if (!e.shiftKey) {
      deselectAll();
    }
    startBoxSelection(worldPos);
    setMode('boxSelect');
  }
}
```

### PointerMove
```typescript
function handlePointerMove(e: PointerEvent) {
  const worldPos = canvasKernel.screenToWorld(
    e.clientX, e.clientY, camera, containerRect
  );
  const delta = canvasKernel.screenDeltaToWorld(
    e.movementX, e.movementY, camera.zoom
  );
  
  switch (mode) {
    case 'panning':
      setPan({
        x: camera.pan.x + e.movementX,
        y: camera.pan.y + e.movementY
      });
      break;
      
    case 'dragging':
      let finalDelta = delta;
      
      // Shift للقفل على محور
      if (e.shiftKey) {
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
          finalDelta = { x: delta.x, y: 0 };
        } else {
          finalDelta = { x: 0, y: delta.y };
        }
      }
      
      // Snap to grid
      if (settings.snapToGrid) {
        finalDelta = canvasKernel.snapToGrid(finalDelta, settings.gridSize);
      }
      
      moveElements(selectedIds, finalDelta.x, finalDelta.y);
      break;
      
    case 'resizing':
      const scale = calculateScale(resizeState, worldPos);
      resizeElements(selectedIds, scale.x, scale.y, resizeState.origin);
      break;
      
    case 'rotating':
      const angle = calculateAngle(rotateState.origin, worldPos);
      rotateElements(selectedIds, angle, rotateState.origin);
      break;
      
    case 'boxSelect':
      updateBoxSelection(worldPos);
      break;
      
    case 'drawing':
      addPointToPath(worldPos);
      break;
      
    case 'connecting':
      updateConnectionPreview(worldPos);
      // فحص snap للعناصر
      const nearestAnchor = findNearestAnchor(worldPos, elements);
      setSnapPreview(nearestAnchor);
      break;
  }
}
```

### PointerUp
```typescript
function handlePointerUp(e: PointerEvent) {
  switch (mode) {
    case 'dragging':
    case 'resizing':
    case 'rotating':
      pushHistory(); // حفظ للـ Undo
      break;
      
    case 'boxSelect':
      const selectedByBox = findElementsInBox(selectionBox);
      if (e.shiftKey) {
        addToSelection(selectedByBox);
      } else {
        setSelectedElements(selectedByBox);
      }
      endBoxSelection();
      break;
      
    case 'drawing':
      finalizePath();
      pushHistory();
      break;
      
    case 'connecting':
      if (snapPreview) {
        createConnection(connectionStart, snapPreview);
        pushHistory();
      }
      break;
  }
  
  setMode('idle');
}
```

### KeyDown
```typescript
function handleKeyDown(e: KeyboardEvent) {
  // لا تعالج إذا في وضع الكتابة
  if (mode === 'typing' && !['Escape', 'Tab'].includes(e.key)) {
    return;
  }
  
  switch (e.key) {
    // التنقل
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      if (selectedIds.length > 0) {
        e.preventDefault();
        const distance = e.shiftKey ? 10 : 1;
        const delta = getArrowDelta(e.key, distance);
        moveElements(selectedIds, delta.x, delta.y);
        pushHistory();
      }
      break;
      
    // الإجراءات
    case 'Delete':
    case 'Backspace':
      if (selectedIds.length > 0 && mode !== 'typing') {
        e.preventDefault();
        deleteElements(selectedIds);
        pushHistory();
      }
      break;
      
    case 'Escape':
      deselectAll();
      setMode('idle');
      break;
      
    case 'a':
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        selectAll();
      }
      break;
      
    case 'c':
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        copyToClipboard(selectedIds);
      }
      break;
      
    case 'v':
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        pasteFromClipboard();
        pushHistory();
      }
      break;
      
    case 'z':
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      break;
      
    case 'd':
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        duplicateElements(selectedIds);
        pushHistory();
      }
      break;
      
    case 'g':
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        if (e.shiftKey) {
          ungroupSelected();
        } else {
          groupSelected();
        }
        pushHistory();
      }
      break;
      
    case ' ':
      // تفعيل وضع التحريك
      if (!isSpacePressed) {
        setIsSpacePressed(true);
      }
      break;
  }
}
```

## تدفق البيانات

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  DOM Event  │────►│ Event Handler│────►│   Action    │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                                                 ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Re-render │◄────│    State     │◄────│   Reducer   │
└─────────────┘     │   (Zustand)  │     └─────────────┘
                    └──────────────┘
```

## اختصارات لوحة المفاتيح

| الاختصار | الإجراء |
|----------|---------|
| `Ctrl/⌘ + A` | تحديد الكل |
| `Ctrl/⌘ + C` | نسخ |
| `Ctrl/⌘ + V` | لصق |
| `Ctrl/⌘ + X` | قص |
| `Ctrl/⌘ + D` | تكرار |
| `Ctrl/⌘ + Z` | تراجع |
| `Ctrl/⌘ + Shift + Z` | إعادة |
| `Ctrl/⌘ + G` | تجميع |
| `Ctrl/⌘ + Shift + G` | فك التجميع |
| `Delete / Backspace` | حذف |
| `Escape` | إلغاء التحديد |
| `Space + Drag` | تحريك الكانفاس |
| `Arrow Keys` | تحريك 1px |
| `Shift + Arrow` | تحريك 10px |
| `Shift + Drag` | قفل المحور |
| `Alt + Drag` | تكرار أثناء السحب |
| `+` / `-` | تكبير / تصغير |
| `0` | إعادة تعيين التكبير |
| `1` | تكبير 100% |
| `F` | ملاءمة للشاشة |

## أفضل الممارسات

### 1. منع تعارض الأحداث
```typescript
// استخدم capture phase للأحداث الحرجة
element.addEventListener('pointerdown', handler, { capture: true });

// أوقف انتشار الأحداث عند الحاجة
e.stopPropagation();
```

### 2. تحسين الأداء
```typescript
// استخدم requestAnimationFrame للتحديثات المتكررة
let rafId: number;
function handleMove(e: PointerEvent) {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    updatePosition(e);
  });
}
```

### 3. إدارة الحالة
```typescript
// استخدم refs للقيم المتغيرة بسرعة
const dragStateRef = useRef(dragState);
useEffect(() => {
  dragStateRef.current = dragState;
}, [dragState]);
```

---
*آخر تحديث: 2024-12*
