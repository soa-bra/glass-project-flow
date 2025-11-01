# خطة مفصلة لعلاج مشاكل أداة التحديد واللوحة التحكم الخاصة بها والتحرير

## تحليل المشكلة

بعد التجربة العملية تبيّن أن أداة التحديد لا تتعرّف على العناصر المرسومة ولا تتيح تحريكها أو تعديلها. لحل هذه المشكلة جذريًا وضمان استيفاء جميع المتطلبات المذكورة، تم وضع خطة تنفيذية على مراحل، مع تعليمات برمجية مفصلة لكل مرحلة.

---

## أولاً: تحليل جذور المشكلة

* من الواضح أن العناصر التي تُضاف إلى الكانفاس تُرسم بصريًا لكنها لا تُربط بحالة التطبيق (**canvasStore**) كعناصر قابلة للتحديد والتحريك.
* عدم وجود معالِجات أحداث (event handlers) تربط النقر والسحب بالعناصر، وبالتالي لا يتم تحديث `selectedElementIds` في الحالة.
* عدم وجود مكوّن **BoundingBox** يظهر حول العناصر المحددة لتغيير الحجم أو التدوير أو التحريك.
* أداة التحديد ليس لديها منطق لمعالجة التحديد المتعدد أو اختصارات لوحة المفاتيح.

---

## ثانياً: الخطة التنفيذية (مقسمة إلى خطوات)

### الخطوة 1 – ربط العناصر بحالة الكانفاس ومعالجة النقر

#### أهداف:
* تسجيل كل عنصر يُضاف إلى الكانفاس في `canvasStore` بمعرف فريد.
* تحديث حالة الاختيار (`selectedElementIds`) عند النقر على عنصر.
* إلغاء الاختيار عند النقر في مساحة فارغة.

#### المهام:
1. مراجعة `addElement` في `canvasStore` لضمان إضافة العنصر بمعرف (ID) وحفظ موقعه وحجمه ونوعه.
2. إنشاء معالج نقر في مكوّن `CanvasElement` يرسل معرف العنصر إلى `canvasStore.selectElement(id)` عند النقر.
3. تحديث الحالة بحيث تُفرّغ قائمة `selectedElementIds` عند النقر خارج أي عنصر.

#### المطالبة:
```
الخطوة 1: ربط العناصر بحالة الكانفاس ومعالجة النقر
1. راجع ملف canvasStore.ts وتأكد من أن كل عنصر يُضاف عبر دالة addElement يملك معرفًا فريدًا (id) ويُخزن موقعه وحجمه ونوعه.
2. في مكوّن CanvasElement (أو مكوّن عنصر الشكل)، أضف معالج onClick يستدعي canvasStore.selectElement(id) عند النقر على العنصر. هذه الدالة يجب أن تُحدّث selectedElementIds في الحالة لتحتوي على المعرّف الحالي.
3. في InfiniteCanvas، أضف معالج onClick على الكانفاس الخلفي يقوم بإفراغ selectedElementIds عندما ينقر المستخدم على مساحة فارغة، لإلغاء أي تحديد حالي.
```

#### التعليمات البرمجية:

```typescript
// canvasStore.ts
import { nanoid } from 'nanoid';

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
  // ... خصائص أخرى
}

interface CanvasState {
  elements: Record<string, CanvasElement>;
  selectedElementIds: string[];
  addElement: (el: Partial<CanvasElement>) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;
}

const useCanvasStore = create<CanvasState>((set, get) => ({
  elements: {},
  selectedElementIds: [],
  addElement: (el) => {
    const id = nanoid();
    set((state) => {
      state.elements[id] = { id, width: 100, height: 100, x: 0, y: 0, ...el };
    });
  },
  selectElements: (ids) => set({ selectedElementIds: ids }),
  clearSelection: () => set({ selectedElementIds: [] }),
}));
```

```tsx
// CanvasElement.tsx
import { useCanvasStore } from '@/stores/canvasStore';

export const CanvasElement = ({ element }: { element: CanvasElement }) => {
  const selectElements = useCanvasStore((s) => s.selectElements);
  return (
    <g
      onMouseDown={(e) => {
        e.stopPropagation(); // منع تفعيل السحب في الكانفاس
        selectElements([element.id]);
      }}
    >
      {/* رسم العنصر بناءً على نوعه */}
    </g>
  );
};
```

```tsx
// InfiniteCanvas.tsx (جزء من الكانفاس الخلفي)
const InfiniteCanvas = () => {
  const clearSelection = useCanvasStore((s) => s.clearSelection);

  const handleCanvasClick = () => {
    clearSelection();
  };

  return (
    <svg
      onMouseDown={handleCanvasClick}
      /* ... باقي خصائص الكانفاس ... */
    >
      {/* رسم العناصر */}
    </svg>
  );
};
```

---

### الخطوة 2 – إنشاء مكوّن BoundingBox للتحريك وتغيير الحجم والتدوير

#### أهداف:
* إظهار إطار حول العناصر المحددة يوضح الحدود.
* توفير مقابض (handles) لتغيير الحجم والتدوير.
* تحريك العناصر عند سحب الإطار نفسه.

#### المهام:
1. إنشاء مكوّن `BoundingBox` يستقبل `selectedElementIds` ويحسب المساحة المحيطة بالعناصر المحددة.
2. رسم الإطار بأربع مقابض لتغيير الحجم وأداة للتدوير في أحد الأركان.
3. إضافة معالجات سحب إلى الإطار والمقابض:
   - السحب داخل الإطار لتحريك جميع العناصر المحددة.
   - السحب من المقابض لتغيير الحجم مع الحفاظ على النسب عند الضغط على Shift.
   - تدوير العناصر عند سحب مقبض التدوير.
4. تحديث `canvasStore` بالقيم الجديدة للموقع والحجم والزوايا أثناء السحب.

#### المطالبة:
```
الخطوة 2: إنشاء مكوّن BoundingBox للتحديد والتحويل
1. أنشئ ملفًا جديدًا باسم BoundingBox.tsx داخل مجلد Planning/Canvas، يحتوي على مكوّن React يستقبل قائمة selectedElementIds.
2. استخدم بيانات العناصر من canvasStore لحساب الحد الأدنى والأقصى لإحداثيات العناصر المحددة ورسم مستطيل يحيط بها.
3. أضف مقابض في زوايا المستطيل تتيح تغيير الحجم، ومقبض تدوير في الأعلى.
4. اربط أحداث السحب (onMouseDown/onMouseMove/onMouseUp) بالمقابض لتحديث موقع العناصر وأحجامها وزواياها في canvasStore أثناء السحب.
5. اربط سحب المستطيل نفسه بنقل جميع العناصر المحددة معًا.
6. دمج المكوّن BoundingBox داخل InfiniteCanvas بحيث يظهر فقط عند وجود selectedElementIds غير فارغة.
```

#### التعليمات البرمجية:

```tsx
// BoundingBox.tsx
import { useCanvasStore } from '@/stores/canvasStore';
import { useState } from 'react';

export const BoundingBox = () => {
  const selectedIds = useCanvasStore((s) => s.selectedElementIds);
  const elements = useCanvasStore((s) => s.elements);
  const moveElements = useCanvasStore((s) => s.moveElements); // تحتاج إلى تعريفها في المتجر
  const resizeElements = useCanvasStore((s) => s.resizeElements);
  const rotateElements = useCanvasStore((s) => s.rotateElements);

  if (selectedIds.length === 0) return null;

  // حساب حدود الإطار المحيط
  const selectedElements = selectedIds.map((id) => elements[id]);
  const minX = Math.min(...selectedElements.map((e) => e.x));
  const minY = Math.min(...selectedElements.map((e) => e.y));
  const maxX = Math.max(...selectedElements.map((e) => e.x + e.width));
  const maxY = Math.max(...selectedElements.map((e) => e.y + e.height));

  const [dragStart, setDragStart] = useState<{x: number; y: number} | null>(null);

  const onDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  const onDrag = (e: React.MouseEvent) => {
    if (!dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    moveElements(dx, dy);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  const onDragEnd = () => setDragStart(null);

  return (
    <g
      onMouseDown={onDragStart}
      onMouseMove={onDrag}
      onMouseUp={onDragEnd}
    >
      {/* الإطار */}
      <rect
        x={minX}
        y={minY}
        width={maxX - minX}
        height={maxY - minY}
        stroke="rgba(0, 120, 212, 0.8)"
        fill="none"
        strokeDasharray="4 2"
      />
      {/* مقبض التدوير في الأعلى */}
      <circle
        cx={(minX + maxX) / 2}
        cy={minY - 20}
        r={6}
        fill="#fff"
        stroke="#000"
        onMouseDown={(e) => {
          // منطق التدوير
        }}
      />
      {/* مقابض تغيير الحجم في الزوايا ... */}
    </g>
  );
};
```

**ملاحظة:** يجب إضافة دوال `moveElements` و `resizeElements` و `rotateElements` في `canvasStore` لتحديث مواقع وأحجام وزوايا العناصر المحددة بناءً على إزاحة السحب أو التدوير.

---

### الخطوة 3 – دعم التحديد المتعدد ورسم منطقة التحديد (Rubber Band)

#### أهداف:
* رسم مستطيل تحديد عند السحب على مساحة فارغة.
* اختيار كل العناصر داخل هذا المستطيل.
* دعم Shift+Click لإضافة أو إزالة عناصر من التحديد.
* دعم Cmd/Ctrl+A لتحديد كل العناصر.

#### المهام:
1. في `InfiniteCanvas`, إضافة معالج لسحب الماوس عندما تكون أداة التحديد نشطة ولا يوجد عنصر تحت المؤشر لبدء رسم مستطيل التحديد (selection box).
2. أثناء السحب، يتم تحديث مستطيل التحديد وإظهار المنطقة المظللة.
3. عند إفلات الزر، يتم حساب العناصر التي تقع داخل المستطيل وإضافتها إلى `selectedElementIds` (مع مراعاة Shift+Click لإضافة عناصر أخرى).
4. إضافة اختصار Cmd/Ctrl+A لتحديد كل العناصر في اللوحة.
5. إضافة اختصار Esc لإلغاء التحديد.

#### المطالبة:
```
الخطوة 3: دعم التحديد المتعدد ورسم منطقة التحديد
1. في InfiniteCanvas، أضف حالة محلية selectionRect تمثل مستطيل التحديد أثناء السحب.
2. عند الضغط على زر الماوس الأيسر على منطقة فارغة وأداة التحديد نشطة، ابدأ رسم selectionRect من نقطة البداية.
3. أثناء تحريك الماوس، حدّث أبعاد selectionRect وأظهر مستطيلاً شفافًا فوق الكانفاس.
4. عند تحرير الزر، احسب العناصر التي تقع داخل حدود selectionRect وقم بتحديث selectedElementIds وفقًا لحالة Shift (إضافة إلى التحديد الحالي أو استبداله).
5. أضف اختصار Cmd/Ctrl+A لتحديد جميع العناصر في الكانفاس، واختصار Esc لإلغاء التحديد الحالي.
```

#### التعليمات البرمجية:

```tsx
// InfiniteCanvas.tsx (الجزء المتعلق بالرسم)
const [selectionRect, setSelectionRect] = useState<null | { x: number; y: number; width: number; height: number }>(null);
const [dragStart, setDragStart] = useState<null | { x: number; y: number }>(null);
const selectElements = useCanvasStore((s) => s.selectElements);
const elements = useCanvasStore((s) => s.elements);

const onMouseDown = (e: React.MouseEvent) => {
  // ابدأ مستطيل التحديد إذا لم يكن هناك عنصر تحت المؤشر
  if (activeTool === 'selection' && !e.target.closest('.canvas-element')) {
    setDragStart({ x: e.clientX, y: e.clientY });
    setSelectionRect({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
  }
};
const onMouseMove = (e: React.MouseEvent) => {
  if (selectionRect && dragStart) {
    const x = Math.min(dragStart.x, e.clientX);
    const y = Math.min(dragStart.y, e.clientY);
    const w = Math.abs(e.clientX - dragStart.x);
    const h = Math.abs(e.clientY - dragStart.y);
    setSelectionRect({ x, y, width: w, height: h });
  }
};
const onMouseUp = (e: React.MouseEvent) => {
  if (selectionRect) {
    const selectedIds = Object.values(elements)
      .filter((el) => {
        return (
          el.x >= selectionRect.x &&
          el.y >= selectionRect.y &&
          el.x + el.width <= selectionRect.x + selectionRect.width &&
          el.y + el.height <= selectionRect.y + selectionRect.height
        );
      })
      .map((el) => el.id);
    if (e.shiftKey) {
      // إضافة إلى التحديد الحالي
      selectElements([...new Set([...selectedElementIds, ...selectedIds])]);
    } else {
      selectElements(selectedIds);
    }
    setSelectionRect(null);
    setDragStart(null);
  }
};

// استخدم useEffect لتعريف اختصارات Ctrl+A و Esc
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
      selectElements(Object.keys(elements));
    }
    if (e.key === 'Escape') {
      selectElements([]);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [elements]);
```

---

### الخطوة 4 – تفعيل اختصارات لوحة المفاتيح وعمليات النقل الدقيقة

#### أهداف:
* تحريك العناصر عبر أسهم لوحة المفاتيح.
* تكرار العناصر عند سحبها مع Cmd.
* تقييد حركة السحب لمحور واحد مع Shift.
* تجميع وفك تجميع العناصر.

#### المهام:
1. مراقبة ضغطات الأسهم لتحريك العناصر المحددة بمقدار 1 بكسل في الاتجاه المناسب، ومع Shift للتحريك بمقدار 10 بكسل.
2. دعم Cmd+سحب لتكرار العنصر المحدد أثناء السحب.
3. دعم Shift+سحب لتقييد الحركة إلى محور واحد (أفقي أو عمودي).
4. دعم Ctrl+G لتجميع العناصر المحددة في مجموعة واحدة، وShift+G لفك التجميع، مع تحديث `canvasStore` بهيكل مجموعة.

#### المطالبة:
```
الخطوة 4: تفعيل اختصارات لوحة المفاتيح وعمليات النقل الدقيقة
1. في InfiniteCanvas أو مكوّن علوي آخر، استمع لأحداث keydown عند التركيز على اللوحة.
2. عند الضغط على الأسهم، حدّث مواقع العناصر المحددة في canvasStore بتحريكها بمقدار 1 بكسل في الاتجاه المعني. إذا كان مفتاح Shift مضغوطًا، حركها بمقدار 10 بكسل.
3. عند استخدام Cmd/Ctrl أثناء سحب عنصر، قم بإنشاء نسخة جديدة من العنصر المحدد مع موقع جديد وإضافتها إلى canvasStore.
4. عند استخدام Shift أثناء السحب، اجعل الحركة مقيدة بمحور واحد (أفقي أو عمودي) عبر تجاهل التغير في المحور غير المرغوب.
5. أضف دعمًا لاختصاري Ctrl+G لتجميع العناصر المحددة في مجموعة واحدة وShift+G لفك التجميع، مع تحديث هيكلية البيانات في canvasStore لحفظ العلاقة بين العناصر المجمّعة.
```

#### التعليمات البرمجية:

```typescript
// canvasStore.ts (أضف هذه الدوال إلى الحالة)
moveElements: (dx: number, dy: number) => {
  set((state) => {
    state.selectedElementIds.forEach((id) => {
      const el = state.elements[id];
      if (!el.locked) {
        el.x += dx;
        el.y += dy;
      }
    });
  });
},
duplicateSelected: () => {
  set((state) => {
    state.selectedElementIds.forEach((id) => {
      const el = state.elements[id];
      const newId = nanoid();
      state.elements[newId] = { ...el, id: newId, x: el.x + 20, y: el.y + 20 };
    });
  });
},
groupSelected: () => {
  // يمكن إنشاء عنصر من نوع group يحتوي على children
},
ungroupSelected: () => {
  // فك المجموعة
},
```

```tsx
// InfiniteCanvas.tsx (اختصارات الأسهم وCmd+سحب وShift+سحب)
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    let dx = 0;
    let dy = 0;
    if (e.key === 'ArrowLeft') dx = -1;
    if (e.key === 'ArrowRight') dx = 1;
    if (e.key === 'ArrowUp') dy = -1;
    if (e.key === 'ArrowDown') dy = 1;
    if (dx !== 0 || dy !== 0) {
      if (e.shiftKey) {
        dx *= 10;
        dy *= 10;
      }
      moveElements(dx, dy);
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
      groupSelected();
    }
    if (e.shiftKey && e.key.toLowerCase() === 'g') {
      ungroupSelected();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [moveElements]);
```

في معالجات السحب الخاصة بعنصر مفرد أو مجموعة:

```tsx
const onElementDrag = (e: React.MouseEvent) => {
  const dx = e.clientX - prevX;
  const dy = e.clientY - prevY;
  if (e.metaKey || e.ctrlKey) {
    duplicateSelected();
  }
  if (e.shiftKey) {
    // تقييد الحركة على محور واحد
    if (Math.abs(dx) > Math.abs(dy)) {
      moveElements(dx, 0);
    } else {
      moveElements(0, dy);
    }
  } else {
    moveElements(dx, dy);
  }
};
```

---

### الخطوة 5 – تنفيذ وظائف لوحة التخصيص (selection_panel)

#### أهداف:
* تنفيذ قص ونسخ ولصق وحذف وتجميع وعكس ومحاذاة وقفل/إلغاء قفل العناصر.
* ربط الأزرار في لوحة التخصيص بالدوال المناسبة في `canvasStore`.

#### المهام:
1. عند اختيار "قص"، نسخ العناصر المحددة إلى clipboard الخاص بالتطبيق ثم حذفها من الكانفاس.
2. عند "نسخ"، نسخ العناصر دون حذفها.
3. عند "لصق"، إنشاء عناصر جديدة بنسخ من محتويات clipboard في موقع تعويض بسيط عن الأصل.
4. عند "حذف"، إزالة العناصر المحددة من `canvasStore`.
5. تنفيذ أوامر العكس (Flip Horizontally/Vertically) عبر ضرب الإحداثيات في -1 حول مركز العنصر.
6. تنفيذ أوامر المحاذاة (يسار، وسط، يمين، أعلى، وسط عمودي، أسفل) عبر حساب الحدود المشتركة للعناصر وضبط مواقعها.
7. إضافة خاصية قفل/إلغاء القفل بإضافة حقل `locked` للعناصر ومنع تعديلها عند القفل.

#### المطالبة:
```
الخطوة 5: تنفيذ وظائف لوحة التخصيص selection_panel
1. ضمن canvasStore، أنشئ Clipboard محلي لتخزين العناصر المنسوخة/المقصوصة.
2. أضف دوال copySelected وcutSelected وpasteClipboard: 
   - copySelected تنسخ العناصر المحددة إلى Clipboard مع الحفاظ على الأصل.
   - cutSelected تنسخ العناصر ثم تزيلها من العناصر الحالية.
   - pasteClipboard تُنشئ نسخًا جديدة من العناصر في clipboard بإزاحة طفيفة (مثلاً +20 بكسل في المحورين).
3. أضف دالة deleteSelected لإزالة العناصر المحددة بالكامل من canvasStore.
4. أضف دوال flipHorizontally وflipVertically تقوم بعكس إحداثيات العناصر المحددة حول مركزها.
5. أضف دوال alignSelected (يسار، وسط، يمين، أعلى، وسط عمودي، أسفل) تقوم بحساب إحداثيات مشتركة وضبط مواقع العناصر المحددة وفقًا للمحاذاة المطلوبة.
6. أضف خاصية locked لكل عنصر، وأضف دوال lockSelected وunlockSelected لتفعيل القفل/إلغاء القفل، ويجب منع اختيار أو تحريك العناصر المقفولة.
7. اربط هذه الدوال بأزرار لوحة selection_panel بحيث تظهر للمستخدم عند تحديد عنصر أو مجموعة عناصر، وتنفذ مباشرة عند النقر.
```

#### التعليمات البرمجية:

```typescript
// canvasStore.ts (إضافة clipboard ودوال العمليات)
let clipboard: CanvasElement[] = [];

copySelected: () => {
  clipboard = get().selectedElementIds.map((id) => ({ ...get().elements[id] }));
},
cutSelected: () => {
  clipboard = get().selectedElementIds.map((id) => ({ ...get().elements[id] }));
  set((state) => {
    state.selectedElementIds.forEach((id) => {
      delete state.elements[id];
    });
    state.selectedElementIds = [];
  });
},
pasteClipboard: () => {
  set((state) => {
    clipboard.forEach((el) => {
      const newId = nanoid();
      state.elements[newId] = { ...el, id: newId, x: el.x + 20, y: el.y + 20 };
    });
  });
},
deleteSelected: () => {
  set((state) => {
    state.selectedElementIds.forEach((id) => {
      delete state.elements[id];
    });
    state.selectedElementIds = [];
  });
},
flipHorizontally: () => {
  set((state) => {
    state.selectedElementIds.forEach((id) => {
      const el = state.elements[id];
      el.scaleX = el.scaleX ? -el.scaleX : -1;
    });
  });
},
flipVertically: () => {
  set((state) => {
    state.selectedElementIds.forEach((id) => {
      const el = state.elements[id];
      el.scaleY = el.scaleY ? -el.scaleY : -1;
    });
  });
},
alignSelected: (direction: 'left' | 'centerX' | 'right' | 'top' | 'centerY' | 'bottom') => {
  set((state) => {
    const selected = state.selectedElementIds.map((id) => state.elements[id]);
    const minX = Math.min(...selected.map((e) => e.x));
    const maxX = Math.max(...selected.map((e) => e.x + e.width));
    const minY = Math.min(...selected.map((e) => e.y));
    const maxY = Math.max(...selected.map((e) => e.y + e.height));
    selected.forEach((el) => {
      switch (direction) {
        case 'left': el.x = minX; break;
        case 'centerX': el.x = minX + (maxX - minX - el.width) / 2; break;
        case 'right': el.x = maxX - el.width; break;
        case 'top': el.y = minY; break;
        case 'centerY': el.y = minY + (maxY - minY - el.height) / 2; break;
        case 'bottom': el.y = maxY - el.height; break;
      }
    });
  });
},
lockSelected: () => {
  set((state) => {
    state.selectedElementIds.forEach((id) => { state.elements[id].locked = true; });
  });
},
unlockSelected: () => {
  set((state) => {
    state.selectedElementIds.forEach((id) => { state.elements[id].locked = false; });
  });
},
```

```tsx
// SelectionPanel.tsx (ربط الأزرار بالدوال)
import { useCanvasStore } from '@/stores/canvasStore';

export const SelectionPanel = () => {
  const { 
    copySelected, 
    cutSelected, 
    pasteClipboard, 
    deleteSelected, 
    flipHorizontally,
    flipVertically, 
    alignSelected, 
    lockSelected, 
    unlockSelected 
  } = useCanvasStore();
  
  return (
    <div className="selection-panel">
      <button onClick={copySelected}>نسخ</button>
      <button onClick={cutSelected}>قص</button>
      <button onClick={pasteClipboard}>لصق</button>
      <button onClick={deleteSelected}>حذف</button>
      <button onClick={flipHorizontally}>عكس أفقي</button>
      <button onClick={flipVertically}>عكس عمودي</button>
      <button onClick={() => alignSelected('left')}>محاذاة يسار</button>
      <button onClick={() => alignSelected('centerX')}>محاذاة وسط أفقي</button>
      <button onClick={() => alignSelected('right')}>محاذاة يمين</button>
      <button onClick={() => alignSelected('top')}>محاذاة أعلى</button>
      <button onClick={() => alignSelected('centerY')}>محاذاة وسط عمودي</button>
      <button onClick={() => alignSelected('bottom')}>محاذاة أسفل</button>
      <button onClick={lockSelected}>قفل</button>
      <button onClick={unlockSelected}>إلغاء القفل</button>
    </div>
  );
};
```

---

## ثالثاً: ملخص الخطوات وترتيب التنفيذ

1. **الخطوة 1**: ربط العناصر بالحالة ومعالجة النقر - **أولوية عليا**
2. **الخطوة 2**: إنشاء BoundingBox للتحريك والتحجيم - **أولوية عليا**
3. **الخطوة 3**: التحديد المتعدد ومنطقة التحديد - **أولوية متوسطة**
4. **الخطوة 4**: اختصارات لوحة المفاتيح والنقل الدقيق - **أولوية متوسطة**
5. **الخطوة 5**: وظائف لوحة التخصيص الكاملة - **أولوية متوسطة**

---

## رابعاً: اعتبارات إضافية

### الأداء:
* استخدام `useMemo` و `useCallback` لتحسين الأداء عند التعامل مع عدد كبير من العناصر.
* تفعيل Virtualization لرسم العناصر المرئية فقط.

### إمكانية الوصول:
* إضافة دعم قارئ الشاشة للعناصر والأزرار.
* توفير بدائل لوحة المفاتيح لجميع الوظائف.

### التوافق:
* اختبار التطبيق على متصفحات مختلفة.
* التأكد من دعم اللمس للأجهزة اللوحية.

---

## خامساً: نقاط الاختبار الرئيسية

- [ ] تحديد عنصر واحد بالنقر
- [ ] تحديد متعدد بمستطيل التحديد
- [ ] تحديد متعدد بـ Shift+Click
- [ ] تحريك العناصر بالسحب
- [ ] تحريك العناصر بأسهم لوحة المفاتيح
- [ ] تغيير حجم العناصر بالمقابض
- [ ] تدوير العناصر
- [ ] نسخ ولصق وقص
- [ ] المحاذاة (جميع الاتجاهات)
- [ ] العكس الأفقي والعمودي
- [ ] القفل وإلغاء القفل
- [ ] التجميع وفك التجميع
- [ ] التكرار بـ Cmd+سحب
- [ ] التقييد بمحور واحد بـ Shift+سحب
- [ ] حفظ الحالة في التاريخ (Undo/Redo)

---

## الخاتمة

هذه الخطة توفر مسارًا واضحًا ومفصلًا لإصلاح وتحسين أداة التحديد. يُنصح بتنفيذ كل خطوة على حدة واختبارها قبل الانتقال للخطوة التالية لضمان الاستقرار والجودة.
