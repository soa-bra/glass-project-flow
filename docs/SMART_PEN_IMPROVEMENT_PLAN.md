# خطة مفصلة لعلاج مشاكل أداة القلم الذكي (smart_pen) ولوحتها

## الهدف العام
تحويل القلم من «واجهة صورية» إلى أداة رسم كاملة تدعم:
- الرسم الحر
- «الوضع الذكي» (Smart Mode)
- الروابط الذكية (Smart Connectors)
- تجميع العناصر بالرسم الحلقي
- المسح بالخربشة
- ربط كامل بلوحة الإعدادات والاختصارات

---

## أولًا — تحليل جذور المشكلة (Root Cause)

### المشاكل الحالية:
- ❌ لا توجد حالة (state) لعناصر المسارات (strokes) داخل `canvasStore`، وبالتالي ما يُرسم بصريًا لا يُسجَّل
- ❌ لا يوجد مُعالج تفاعلي لنقر/سحب/إفلات خاص بالقلم، ولا تحويل للإحداثيات مع الـ zoom/pan
- ❌ غياب محوّل الوضع الذكي (تصنيف الإيماءات/الأشكال) وخوارزميات التنعيم/التقليل
- ❌ لوحة القلم غير مرتبطة فعليًا بـ stroke (السماكة/اللون/النمط)، ولا تُطبَّق الاختصارات (Shift/Alt/ESC)

---

## ثانيًا — الخطة التنفيذية (خطوات عملية)

---

### الخطوة 1 — تأسيس بنية البيانات وحالة القلم في canvasStore

#### الأهداف:
- تعريف بنية `PenStroke` وتخزينها
- تخزين إعدادات القلم الحالية (السماكة/اللون/النمط/الوضع الذكي)
- API لإضافة نقاط أثناء السحب، وإنهاء المسار

#### المهام:
1. إضافة واجهات `PenStroke`, `PenSettings`
2. دوال: `beginStroke()`, `appendPoint()`, `endStroke()`, `clearPendingStroke()`
3. دعم أنماط الخط (solid/dashed/dotted/double) عبر خاصية `style`

#### المطالبة + التعليمات البرمجية:

```json
{
  "prompt": "أضِف حالة أداة القلم ومسارات الرسم إلى canvasStore بدوال إنشاء وتحديث/إنهاء المسارات، وإعدادات القلم (سماكة/لون/نمط/وضع ذكي)."
}
```

```typescript
// src/stores/canvasStore.ts
export type LineStyle = 'solid' | 'dashed' | 'dotted' | 'double';

export interface PenPoint { x: number; y: number; t: number; }
export interface PenStroke {
  id: string;
  points: PenPoint[];
  color: string;
  width: number;
  style: LineStyle;
  isClosed?: boolean;
  simplified?: boolean;
  bbox?: { x: number; y: number; w: number; h: number };
}

export interface PenSettings {
  width: number;
  color: string;
  style: LineStyle;
  smartMode: boolean; // Alt للتبديل
}

interface CanvasState {
  pen: PenSettings;
  strokes: Record<string, PenStroke>;
  currentStrokeId?: string;

  setPen: (partial: Partial<PenSettings>) => void;
  beginStroke: (p: PenPoint) => string;
  appendPoint: (p: PenPoint) => void;
  endStroke: () => void;
  clearPendingStroke: () => void;
}

const useCanvasStore = create<CanvasState>((set, get) => ({
  pen: { width: 2, color: '#111111', style: 'solid', smartMode: false },
  strokes: {},
  setPen: (partial) => set((s) => ({ pen: { ...s.pen, ...partial } })),
  beginStroke: (p) => {
    const id = nanoid();
    const { pen } = get();
    set((s) => {
      s.strokes[id] = { id, points: [p], color: pen.color, width: pen.width, style: pen.style };
      s.currentStrokeId = id;
    });
    return id;
  },
  appendPoint: (p) => set((s) => {
    const id = s.currentStrokeId;
    if (id) s.strokes[id].points.push(p);
  }),
  endStroke: () => set((s) => { s.currentStrokeId = undefined; }),
  clearPendingStroke: () => set((s) => { s.currentStrokeId = undefined; })
}));
```

---

### الخطوة 2 — طبقة الإدخال للقلم على الكانفاس (Mouse/Pointer Capture)

#### الأهداف:
- التقاط السحب على الكانفاس عند تفعيل القلم (P)
- تحويل إحداثيات الشاشة → الكانفاس (مع zoom/pan)
- تعطيل Pan أثناء الرسم، وتفعيل ESC للإلغاء

#### المهام:
1. إضافة `PenInputLayer` داخل `InfiniteCanvas`
2. استخدام `pointerdown/move/up` على overlay أعلى الكانفاس
3. عند ESC: `clearPendingStroke()` وإخفاء المعاينة

#### المطالبة + التعليمات البرمجية:

```json
{
  "prompt": "أضف PenInputLayer يلتقط pointer events ويحوّل الإحداثيات وفق zoom/pan، ويبدأ/يحدّث/ينهي stroke في store. عطّل Pan أثناء الرسم، وفعّل ESC للإلغاء."
}
```

```typescript
// src/components/Planning/PenInputLayer.tsx
export const PenInputLayer: React.FC<{ active: boolean; viewport: {zoom:number; pan:{x:number;y:number}} }> = ({ active, viewport }) => {
  const { beginStroke, appendPoint, endStroke } = useCanvasStore();
  const ref = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);

  const toCanvas = (e: PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    return { x: (sx - viewport.pan.x) / viewport.zoom, y: (sy - viewport.pan.y) / viewport.zoom };
  };

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const onDown = (e: PointerEvent) => {
      if (!active || e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      const p = toCanvas(e);
      beginStroke({ ...p, t: performance.now() });
      drawingRef.current = true;
    };

    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      const p = toCanvas(e);
      appendPoint({ ...p, t: performance.now() });
    };

    const onUp = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      endStroke();
      el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
    };
  }, [active, viewport.zoom, viewport.pan]);

  // ESC للإلغاء
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        useCanvasStore.getState().clearPendingStroke();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return <div ref={ref} className="absolute inset-0 pointer-events-auto" />;
};
```

**دمج في InfiniteCanvas:** أضِف `PenInputLayer` فوق طبقة العناصر، وتفعيلها فقط عندما `activeTool === 'smart_pen'`.

---

### الخطوة 3 — التنعيم والتقليل (Smoothing & Simplification)

#### الأهداف:
- تحسين جودة المسار وتقليل النقاط الخام
- دعم الخط المستقيم مع Shift (قفل اتجاه)

#### المهام:
1. تطبيق Moving Average + تبسيط RDP (Ramer–Douglas–Peucker)
2. إن كان Shift أثناء الرسم: إسقاط النقاط على اتجاهٍ ثابت (أفقي/عمودي/أقرب زاوية 45°)

#### المطالبة + التعليمات البرمجية:

```json
{
  "prompt": "طبّق خوارزميات تنعيم/تقليل على stroke عند endStroke: Moving Average + RDP. وإذا كان Shift مفعّل أثناء الرسم فقُم بقفل الاتجاه لخط مستقيم."
}
```

```typescript
// src/lib/geometry/simplify.ts
export const movingAverage = (pts: PenPoint[], w = 3) => {
  if (pts.length <= w) return pts;
  const out: PenPoint[] = [];
  for (let i = 0; i < pts.length; i++) {
    const s = Math.max(0, i - w), e = Math.min(pts.length - 1, i + w);
    let sx = 0, sy = 0, c = 0;
    for (let j = s; j <= e; j++) { sx += pts[j].x; sy += pts[j].y; c++; }
    out.push({ ...pts[i], x: sx / c, y: sy / c });
  }
  return out;
};

export const rdp = (pts: PenPoint[], eps = 1.2): PenPoint[] => {
  if (pts.length < 3) return pts;
  const dmax = (a: PenPoint, b: PenPoint, p: PenPoint) => {
    const A = {x: a.x, y: a.y}, B = {x: b.x, y: b.y};
    const num = Math.abs((B.y - A.y)*p.x - (B.x - A.x)*p.y + B.x*A.y - B.y*A.x);
    const den = Math.hypot(B.y - A.y, B.x - A.x);
    return den === 0 ? Math.hypot(p.x - A.x, p.y - A.y) : num / den;
  };
  let dmaxv = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = dmax(pts[0], pts[pts.length - 1], pts[i]);
    if (d > dmaxv) { idx = i; dmaxv = d; }
  }
  if (dmaxv > eps) {
    const r1 = rdp(pts.slice(0, idx + 1), eps);
    const r2 = rdp(pts.slice(idx), eps);
    return r1.slice(0, -1).concat(r2);
  } else {
    return [pts[0], pts[pts.length - 1]];
  }
};

// داخل endStroke في store (تبسيط عند النهاية)
endStroke: () => set((s) => {
  const id = s.currentStrokeId;
  if (!id) return;
  const pts = s.strokes[id].points;
  const sm = movingAverage(pts, 2);
  const simple = rdp(sm, 1.1);
  const xs = simple.map(p => p.x), ys = simple.map(p => p.y);
  s.strokes[id].points = simple;
  s.strokes[id].simplified = true;
  s.strokes[id].bbox = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs)-Math.min(...xs), h: Math.max(...ys)-Math.min(...ys) };
  s.currentStrokeId = undefined;
})
```

**ملاحظة:** لقفل الاتجاه مع Shift، خزّن `shiftKey` عند `beginStroke` وطبّق إسقاطًا على اتجاهٍ ثابت في `appendPoint`.

---

### الخطوة 4 — «الوضع الذكي» (التعرّف على الإيماءات والأشكال)

#### الأهداف:
- **رسم ذكي:** تحويل الشكل الحر إلى أقرب (دائرة/مستطيل/سهم)
- **جذر ذكي:** خط بين عنصرين ⇒ إنشاء RootConnector
- **تجميع في إطار:** حلقة مغلقة حول عناصر ⇒ إنشاء Frame يضمّها
- **مسح (خربشة):** كشط/تشويش فوق عنصر ⇒ حذف

#### المهام:
1. مُصنّف إيماءات مبسّط:
   - مغلق & دائري ⇒ دائرة
   - مغلق & نسبة أضلاع ≈ مستطيل ⇒ مستطيل
   - خط بنهاية مثلثية ⇒ سهم
2. «وصل عنصرين»: ابحث عن أقرب عنصرين تقاطعَ معهما خطّ النهاية ⇒ أنشئ RootConnector
3. حلقة تحتضن عناصر متعددة ⇒ Frame يحتويها
4. خربشة: زيادة تقاطعات stroke مع حدود عنصر ⇒ حذف

#### المطالبة + التعليمات البرمجية:

```json
{
  "prompt": "فعّل الوضع الذكي: بعد endStroke، افحص stroke. إن كان مغلقًا فقُم بالكشف عن دائرة/مستطيل وتجميع العناصر إن كان حلقة. إن كان خطًا يقاطع عنصرين فأنشئ RootConnector. إن كان خربشةٌ على عنصر فاحذفه."
}
```

```typescript
// src/lib/smart/recognize.ts
import { PenStroke } from '@/stores/canvasStore';

export type SmartKind = 'circle' | 'rect' | 'arrow' | 'lasso' | 'scribble' | 'line' | 'none';

export function classifyStroke(st: PenStroke): SmartKind {
  const pts = st.points;
  if (pts.length < 2) return 'none';

  const first = pts[0], last = pts[pts.length - 1];
  const closed = Math.hypot(last.x - first.x, last.y - first.y) < Math.max(6, st.width*2);

  // خربشة: طول مسار كبير وكثافة تقاطع عالية ضمن مساحة صغيرة
  const bbox = st.bbox!;
  const density = pts.length / Math.max(16, bbox.w * bbox.h);
  if (!closed && density > 0.05) return 'scribble';

  if (closed) {
    const w = bbox.w, h = bbox.h, r = w/h;
    if (r > 0.8 && r < 1.2) return 'circle';
    return 'rect'; // تبسيط أولي
  }

  // سهم: خط طويل + تغيّر اتجاه واضح في النهاية
  const totalLen = pts.reduce((acc, p, i) => i? acc + Math.hypot(p.x-pts[i-1].x, p.y-pts[i-1].y) : 0, 0);
  if (totalLen > 24) {
    // إن أردنا دقة أعلى يمكن فحص مثلث الرأس
    return 'arrow';
  }
  return 'line';
}

// src/lib/smart/apply.ts
export function applySmart(st: PenStroke, elements: Record<string, any>) {
  const kind = classifyStroke(st);

  switch (kind) {
    case 'circle':
      return createShapeFromStroke('ellipse', st);
    case 'rect':
      return createShapeFromStroke('rect', st);
    case 'arrow':
      // إذا لمس عنصرين مختلفين فأنشئ RootConnector
      const targets = hitTestEnds(st, elements);
      if (targets.length >= 2) return createRootConnector(targets[0], targets[1]);
      return createArrowFromStroke(st);
    case 'scribble':
      return eraseHitElements(st, elements);
    default:
      return null;
  }
}
```

**بعد endStroke:** إن كان `pen.smartMode === true` أو Alt كان مضغوطًا أثناء الرسم ⇒ استدعِ `applySmart` واستبدِل stroke الناتج بشكل/عنصر ذكي أو احذف/جمّع حسب الحالة.

---

### الخطوة 5 — الربط بلوحة smart_pen_panel

#### الأهداف:
- ربط عناصر اللوحة (toggle الذكي، سماكة، لون، نمط) بـ `pen` في الـ store
- معاينة حيّة لقلم الرسم

#### المهام:
1. استدعاء `setPen({ smartMode })` عند تبديل الزر
2. ربط السلايدر وخيارات اللون والنمط بحالة القلم
3. إظهار «تلميحات» الاختصارات داخل اللوحة

#### المطالبة + التعليمات البرمجية:

```json
{
  "prompt": "اربط لوحة smart_pen_panel بحالة pen في store: toggle للوضع الذكي، سلايدر سماكة، اختيار لون، قائمة نمط الخط. أضِف تلميحات للاختصارات (Shift/Alt/ESC)."
}
```

```typescript
// src/components/Planning/panels/SmartPenPanel.tsx
export const SmartPenPanel: React.FC = () => {
  const pen = useCanvasStore(s => s.pen);
  const setPen = useCanvasStore(s => s.setPen);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>الوضع الذكي</span>
        <input type="checkbox" checked={pen.smartMode} onChange={e => setPen({ smartMode: e.target.checked })}/>
      </div>
      <div>
        <div className="mb-1">سمك الخط: {pen.width}px</div>
        <input type="range" min={1} max={24} value={pen.width} onChange={e => setPen({ width: +e.target.value })}/>
      </div>
      <div>
        <div className="mb-1">اللون</div>
        <input type="color" value={pen.color} onChange={e => setPen({ color: e.target.value })}/>
      </div>
      <div>
        <div className="mb-1">نمط الخط</div>
        <select value={pen.style} onChange={e => setPen({ style: e.target.value as any })}>
          <option value="solid">متصل</option>
          <option value="dashed">متقطع</option>
          <option value="dotted">نقطي</option>
          <option value="double">مزدوج</option>
        </select>
      </div>
      <div className="text-xs text-muted-foreground pt-2 border-t">
        اختصارات: <b>Shift</b> خط مستقيم، <b>Alt</b> تشغيل ذكي مؤقتًا، <b>ESC</b> إلغاء.
      </div>
    </div>
  );
};
```

---

### الخطوة 6 — العرض (Rendering) للـ strokes وأنماط الخط

#### الأهداف:
- رسم المسارات بأسلوب SVG/Canvas مع دعم `style`
- تحويل `double` إلى stroke مزدوج (مسار خارجي/داخلي بسيط)

#### المهام:
1. `StrokesLayer` لعرض جميع strokes
2. ترجمة `style` إلى `dasharray` أو مضاعفة stroke

#### المطالبة + التعليمات البرمجية:

```json
{
  "prompt": "أنشئ StrokesLayer لعرض كل strokes مع دعم style: dashed/dotted عبر strokeDasharray، و double عبر مسارين متراكبين."
}
```

```typescript
// src/components/Planning/StrokesLayer.tsx
export const StrokesLayer: React.FC<{ viewport: {zoom:number; pan:{x:number;y:number}} }> = ({ viewport }) => {
  const strokes = useCanvasStore(s => Object.values(s.strokes));
  const toScreen = (p: PenPoint) => ({
    x: p.x * viewport.zoom + viewport.pan.x,
    y: p.y * viewport.zoom + viewport.pan.y
  });

  return (
    <svg className="absolute inset-0 pointer-events-none">
      {strokes.map(st => {
        const d = st.points.map((p,i) => {
          const s = toScreen(p);
          return i ? `L ${s.x} ${s.y}` : `M ${s.x} ${s.y}`;
        }).join(' ');
        const dash = st.style === 'dashed' ? '8 6' : st.style === 'dotted' ? '2 6' : undefined;
        return (
          <g key={st.id}>
            {st.style === 'double' && (
              <path d={d} stroke={st.color} strokeWidth={st.width * 1.6} fill="none" opacity={0.55}/>
            )}
            <path d={d} stroke={st.color} strokeWidth={st.width} fill="none" strokeDasharray={dash}/>
          </g>
        );
      })}
    </svg>
  );
};
```

**أضِف `StrokesLayer`** تحت طبقة العناصر الذكية وفوق الشبكة.

---

### الخطوة 7 — الربط مع بقية النظام (Connectors / Frames / Delete)

#### الأهداف:
عند `applySmart`:
- إنشاء عناصر: Shape(ellipse/rect), Arrow, RootConnector, Frame
- تنفيذ الحذف عند scribble

#### المهام:
1. توسيع `canvasStore.addElement` لدعم الأنواع الجديدة
2. `hitTestEnds(stroke)` لإيجاد العناصر تحت النهايات

#### المطالبة + التعليمات البرمجية:

```json
{
  "prompt": "وسّع addElement/element models لدعم الشكل/السهم/الإطار/الموصل. أضف hitTestEnds لفحص العناصر أسفل نقطتي البداية والنهاية وإنشاء RootConnector."
}
```

```typescript
// مثال مبسّط
export function hitTestEnds(st: PenStroke, elements: Record<string, any>) {
  const a = st.points[0], b = st.points[st.points.length-1];
  const hits = (p: PenPoint) =>
    Object.values(elements).filter((el:any) => pointInBBox(p, el.bbox));
  const h1 = hits(a), h2 = hits(b);
  const out: any[] = [];
  if (h1[0]) out.push(h1[0]);
  if (h2[0] && (!h1[0] || h2[0].id !== h1[0].id)) out.push(h2[0]);
  return out;
}
```

---

### الخطوة 8 — الاختصارات والسلوكيات الدقيقة

#### الأهداف:
- **Shift:** خط مستقيم/قفل محور
- **Alt:** تفعيل الوضع الذكي مؤقتًا
- **ESC:** إلغاء

#### المهام:
التقاط `keydown/keyup` في `PenInputLayer` وتخزين flags (shift/alt) مؤقتًا داخل ref وإرسالها إلى store

#### المطالبة:

```json
{
  "prompt": "أكمل التعامل مع Shift/Alt/ESC في PenInputLayer: خزّن حالة Shift/Alt في ref لتنعكس على appendPoint والتصنيف الذكي، وESC لإلغاء المسار الحالي."
}
```

---

### الخطوة 9 — اختبارات قبول (QA)

#### قائمة التحقق:
- [ ] رسم حرّ يعمل ويظهر stroke فورًا
- [ ] Shift يرسم خطًا مستقيمًا
- [ ] Alt يحوّل الدائرة/المستطيل/السهم تلقائيًا
- [ ] خط يلامس عنصرين ⇒ RootConnector
- [ ] حلقة مغلقة حول عدة عناصر ⇒ Frame يحتويهم
- [ ] خربشة على عنصر ⇒ حذف العنصر فقط
- [ ] لوحة القلم تعكس وتعدّل اللون/السماكة/النمط فورًا
- [ ] لا تعارض مع Pan/Zoom (Pan متعطّل أثناء الرسم فقط)

---

## ملاحظات تنفيذية مهمة

### الإحداثيات:
دائمًا حوّل screen→canvas باستخدام `(screen - pan)/zoom` والعكس للعرض

### الأداء:
في `appendPoint` اسقط النقاط إذا كانت المسافة عن النقطة السابقة < 0.5px (تصفية)

### التاريخ (Undo/Redo):
استدعِ `pushHistory()` بعد `endStroke/applySmart`

### الأمان:
لا تعدّل عناصر locked

### التصميم:
احرص على pointer-events—القلم يحتاج طبقة capture خاصة لا تتعارض مع طبقات العناصر

---

## خلاصة

هذه الخطة تعالج القلم من الجذور:
- ✅ حالة بيانات
- ✅ إدخال مؤشّر
- ✅ عرض
- ✅ تنعيم
- ✅ «ذكاء» للإيماءات
- ✅ تكامل مع بقية العناصر
- ✅ لوحة إعدادات واختصارات

كل خطوة مرفقة بمطالبة واضحة وتعليمات برمجية مباشرة وقابلة للدمج في المشروع الحالي.

### التنفيذ التدريجي (PRs):
يمكن ترتيب الخطوات كـ PRs صغيرة (من 1 إلى 9) لتسهيل المراجعة والاختبار:
1. PR#1: بنية البيانات (canvasStore)
2. PR#2: طبقة الإدخال (PenInputLayer)
3. PR#3: التنعيم والتبسيط
4. PR#4: الوضع الذكي
5. PR#5: ربط اللوحة
6. PR#6: العرض (StrokesLayer)
7. PR#7: التكامل مع العناصر الذكية
8. PR#8: الاختصارات
9. PR#9: الاختبارات النهائية

---

**تاريخ الإنشاء:** 2025
**الحالة:** مخطط جاهز للتنفيذ
**الأولوية:** عالية
