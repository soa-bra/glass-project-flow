# Performance Guide - دليل الأداء

## معايير الأداء المستهدفة

| المقياس | الهدف | الحد الأقصى |
|---------|-------|-------------|
| **Render 1000 عنصر** | < 50ms | < 100ms |
| **Drag per frame** | < 4ms | < 8ms |
| **Selection update** | < 2ms | < 5ms |
| **Zoom/Pan** | < 8ms | < 16ms |
| **Export PNG** | < 2s | < 3s |
| **Export PDF** | < 2s | < 3s |
| **Import JSON** | < 500ms | < 1s |
| **Memory (1000 elem)** | < 100MB | < 150MB |
| **FPS during drag** | 60 | 30 (min) |

## تقنيات التحسين المُستخدمة

### 1. Memoized Selectors

```typescript
// src/stores/canvas/selectors.ts
const selectorCache = new Map<string, { deps: any[]; result: any }>();

function memoize<T>(key: string, deps: any[], compute: () => T): T {
  const cached = selectorCache.get(key);
  
  if (cached && deps.every((dep, i) => dep === cached.deps[i])) {
    return cached.result;
  }
  
  const result = compute();
  selectorCache.set(key, { deps, result });
  return result;
}

// استخدام
export const selectVisibleElements = (state: CanvasState): CanvasElement[] => {
  return memoize(
    'visibleElements',
    [state.elements, state.layers],
    () => {
      const visibleLayerIds = new Set(
        state.layers.filter(l => l.visible).map(l => l.id)
      );
      return state.elements.filter(el => 
        el.visible !== false && visibleLayerIds.has(el.layerId || 'default')
      );
    }
  );
};
```

### 2. Viewport Culling

```typescript
// عرض العناصر المرئية فقط
const ElementsLayer = memo(({ elements, viewport, containerBounds }) => {
  const visibleElements = useMemo(() => {
    return elements.filter(el => {
      const screenBounds = {
        left: el.position.x * viewport.zoom + viewport.pan.x,
        top: el.position.y * viewport.zoom + viewport.pan.y,
        right: (el.position.x + el.size.width) * viewport.zoom + viewport.pan.x,
        bottom: (el.position.y + el.size.height) * viewport.zoom + viewport.pan.y
      };
      
      // فحص التقاطع مع الشاشة
      return !(
        screenBounds.right < 0 ||
        screenBounds.left > containerBounds.width ||
        screenBounds.bottom < 0 ||
        screenBounds.top > containerBounds.height
      );
    });
  }, [elements, viewport, containerBounds]);
  
  return visibleElements.map(el => (
    <CanvasElement key={el.id} element={el} />
  ));
});
```

### 3. Batch Operations

```typescript
// ❌ سيء - تحديثات متعددة
selectedIds.forEach(id => {
  updateElement(id, { position: { x: x + 10, y: y + 10 } });
});

// ✅ جيد - تحديث واحد
moveElements(selectedIds, 10, 10);

// التنفيذ الداخلي
moveElements: (elementIds, deltaX, deltaY) => {
  set((state) => ({
    elements: state.elements.map(el =>
      elementIds.includes(el.id)
        ? { ...el, position: { x: el.position.x + deltaX, y: el.position.y + deltaY } }
        : el
    )
  }));
}
```

### 4. Web Workers

```typescript
// src/workers/exportWorker.ts
self.onmessage = async (e: MessageEvent) => {
  const { elements, options } = e.data;
  
  try {
    // التصدير في الخلفية
    const result = await processExport(elements, options);
    
    // إرسال التقدم
    self.postMessage({ type: 'progress', value: 50 });
    
    // الانتهاء
    self.postMessage({ type: 'complete', blob: result });
  } catch (error) {
    self.postMessage({ type: 'error', message: error.message });
  }
};

// الاستخدام
const exportWorker = new Worker(
  new URL('../workers/exportWorker.ts', import.meta.url),
  { type: 'module' }
);

exportWorker.postMessage({ elements, options });
```

### 5. Virtualization للقوائم الطويلة

```typescript
// src/utils/performanceOptimizer.ts
export class CanvasVirtualizer {
  private itemHeight: number;
  private containerHeight: number;
  private overscan: number;

  getVisibleRange(scrollTop: number, totalItems: number) {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / this.itemHeight) - this.overscan
    );
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const endIndex = Math.min(
      totalItems - 1,
      startIndex + visibleCount + this.overscan * 2
    );
    
    return { startIndex, endIndex };
  }
}
```

### 6. Object Pooling

```typescript
// إعادة استخدام الكائنات بدلاً من إنشاء جديدة
export class CanvasElementPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (item: T) => void;

  acquire(): T {
    return this.pool.pop() || this.factory();
  }

  release(item: T): void {
    this.reset(item);
    this.pool.push(item);
  }
}
```

### 7. Style Caching

```typescript
export const optimizedStyleCalculator = {
  cache: new Map<string, any>(),
  
  getElementStyle(element: CanvasElement) {
    const cacheKey = `${element.id}-${element.style?.fill}-${element.style?.stroke}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const style = computeStyle(element);
    this.cache.set(cacheKey, style);
    return style;
  },
  
  clearCache() {
    this.cache.clear();
  }
};
```

## أدوات القياس والمراقبة

### Performance Metrics Class

```typescript
// src/utils/performanceOptimizer.ts
export class PerformanceMetrics {
  private static instance: PerformanceMetrics;
  private metrics: Map<string, number[]> = new Map();

  startTiming(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.addMetric(label, duration);
    };
  }

  getAverage(label: string): number {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getAllMetrics() {
    const result: Record<string, { avg: number; count: number }> = {};
    this.metrics.forEach((values, label) => {
      result[label] = {
        avg: this.getAverage(label),
        count: values.length
      };
    });
    return result;
  }
}

// الاستخدام
const metrics = PerformanceMetrics.getInstance();
const endTiming = metrics.startTiming('render');
// ... عملية الـ render
endTiming();
console.log('Render avg:', metrics.getAverage('render'), 'ms');
```

### React DevTools Profiler

```typescript
// في Development mode
import { Profiler } from 'react';

<Profiler id="Canvas" onRender={onRenderCallback}>
  <CanvasBoard />
</Profiler>

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  if (actualDuration > 16) {
    console.warn(`Slow render: ${id} took ${actualDuration}ms`);
  }
}
```

## نصائح التحسين

### 1. تجنب Re-renders غير الضرورية

```typescript
// ❌ سيء - object جديد في كل render
<Component style={{ color: 'red' }} />

// ✅ جيد - object ثابت
const redStyle = { color: 'red' };
<Component style={redStyle} />

// ✅ أفضل - useMemo
const style = useMemo(() => ({ color: dynamicColor }), [dynamicColor]);
<Component style={style} />
```

### 2. استخدام React.memo بذكاء

```typescript
// فقط للمكونات التي تعيد الرسم كثيراً
const CanvasElement = memo(({ element, viewport }) => {
  // ...
}, (prevProps, nextProps) => {
  // custom comparison
  return (
    prevProps.element.id === nextProps.element.id &&
    prevProps.element.position.x === nextProps.element.position.x &&
    prevProps.element.position.y === nextProps.element.position.y
  );
});
```

### 3. تأجيل العمليات الثقيلة

```typescript
// استخدام requestIdleCallback
function processHeavyTask(data: any[]) {
  const chunks = chunkArray(data, 100);
  let index = 0;
  
  function processChunk(deadline: IdleDeadline) {
    while (deadline.timeRemaining() > 0 && index < chunks.length) {
      processData(chunks[index]);
      index++;
    }
    
    if (index < chunks.length) {
      requestIdleCallback(processChunk);
    }
  }
  
  requestIdleCallback(processChunk);
}
```

### 4. تحسين CSS

```css
/* استخدام will-change بحذر */
.canvas-element {
  will-change: transform;
}

/* GPU acceleration */
.canvas-element {
  transform: translateZ(0);
}

/* تجنب reflow */
.canvas-element {
  contain: layout style paint;
}
```

## Benchmarks

### تشغيل الـ Benchmarks

```bash
# تشغيل جميع الـ benchmarks
npm run test:benchmark

# تشغيل benchmark محدد
npm run test -- --grep "render benchmark"
```

### نتائج نموذجية

```
┌──────────────────────────────────────┐
│        Performance Benchmarks         │
├──────────────────────────────────────┤
│ Render 100 elements:     12ms  ✓     │
│ Render 500 elements:     38ms  ✓     │
│ Render 1000 elements:    72ms  ✓     │
│ Drag per frame:          3.2ms ✓     │
│ Selection update:        1.8ms ✓     │
│ Export PNG (100 elem):   890ms ✓     │
│ Export PNG (1000 elem):  2.1s  ✓     │
│ Export PDF:              1.4s  ✓     │
│ Import JSON (1000):      380ms ✓     │
└──────────────────────────────────────┘
```

## Memory Management

### تجنب Memory Leaks

```typescript
useEffect(() => {
  const subscription = store.subscribe(handler);
  
  // تنظيف عند unmount
  return () => {
    subscription.unsubscribe();
  };
}, []);

// تنظيف الـ cache دورياً
useEffect(() => {
  const interval = setInterval(() => {
    clearSelectorCache();
    optimizedStyleCalculator.clearCache();
  }, 60000); // كل دقيقة
  
  return () => clearInterval(interval);
}, []);
```

### مراقبة الذاكرة

```typescript
function logMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log({
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
    });
  }
}
```

---
*آخر تحديث: 2024-12*
