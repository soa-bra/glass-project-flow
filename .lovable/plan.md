# خطة إصلاح أداة التحديد + الأنكر + لوحة الخطوة التالية

## 1) استقرار الكانفاس عند تحديد عنصر ذكي (السبب الجذري "الجنون")

**المشكلة:** عند تحديد أي عنصر ذكي، تحدث سلسلة إعادة رندر مستمرة سببها ثلاثة أشياء متداخلة:
- `useElementLockAcquire` يعيد إنشاء نفسه على كل تغيير في `peersById` (يتغير باستمرار)، فيتغير `requestElementLock` prop لكل `CanvasElement`.
- `SmartConnectorManager` يقوم بحساب `resolvePoint` و `nearestEdgeAnchor` على كل mousemove حتى بدون سحب، ما يعيد رندر كل الموصلات.
- في `useElementLockAcquire` الاعتماديات `[acquire, peersById, options]` تعيد بناء الدالة بلا داعٍ (options جديد كل render).

**الإصلاح:**
- تثبيت `requestElementLock` عبر `useRef`+`useCallback` بمرجع ثابت داخل `PlanningCanvas`.
- إزالة `options` و`peersById` من مصفوفة الاعتماديات في `useElementLockAcquire` وقراءتهما عبر ref.
- في `SmartConnectorManager`: عزل مستمعات `mousemove/mouseup` بحيث لا تُسجَّل إلا حال `isCreatingConnector === true` (موجود جزئيًا)، ووضع `resolvePoint` داخل `useMemo` مفهرس على `[connectors, elements]` فقط.
- التحقق من عدم استدعاء `acquire` تلقائيًا عند مجرد التحديد — القفل يُطلب فقط عند بدء تحرير/سحب فعلي (تعديل `CanvasElement.handleMouseDown` لتأجيل `ensureEditLock` حتى تجاوز عتبة السحب 6px بدل استدعائه فورًا).

## 2) مراجعة كاملة لأداة التحديد

مراجعة سيناريو-سيناريو وضمان عملها 100%:

| السيناريو | الإصلاح |
|---|---|
| نقرة على عنصر غير محدد | تحديد فوري بدون قفل — القفل عند تجاوز عتبة السحب |
| نقرة على عنصر محدد | لا يبدأ سحب من `CanvasElement`، يترك `BoundingBox` يتولى |
| Shift/Ctrl/Meta + نقرة | عبر `selectionCoordinator` (متأكد لا يبدأ سحب) |
| سحب على فراغ | Marquee بعد عتبة (موجود) — التأكد أن `clearSelection` لا يستدعى قبل العتبة |
| Long-press باللمس | يُفعّل `touchMultiSelectMode` (موجود) |
| نقرة على عنصر مقفل من متعاون | تجاهل النقرة بصمت (بدون toast متكرر) |
| نقر على عنصر ذكي | نفس منطق العناصر العادية — عزل smart-specific handlers لتجنب تعارض stopPropagation |
| Escape أثناء marquee/drag | إلغاء نظيف وإعادة تعيين `interactionStore` |

## 3) إعادة تصميم أنكر الجذر (Root Connector Anchor) — نمط Miro

**الحالي:** نقطة واحدة أعلى-وسط، رأس السهم مثلث أسود متجه للأعلى.

**المطلوب:**
- **الموقع:** أعلى-يمين العنصر (خارج الحد بمقدار ~14px)، مطابق لسلوك Miro.
- **الشكل:** دائرة صغيرة (8px) مع سهم رفيع داخلها متجه لليمين (→).
- **اللون:** يطابق ألوان الذكاء الاصطناعي — استخدام gradient tokens `--ai-gradient-from` → `--ai-gradient-to` (نفس ألوان أزرار AI في FloatingBar)، مع stroke `hsl(var(--primary))`.
- **hover:** توسع 1.3x + توهج ناعم (glow) بلون AI.
- **ملاحظة:** `anchorPoint` سيظل `top-right` في الـtype ويُحسب `x = bounds.x + bounds.width + offset`, `y = bounds.y - offset`.

## 4) لوحة اقتراحات الخطوة التالية (Drop-on-Empty Workflow Panel)

**السلوك الجديد:** عند سحب من الأنكر وإفلاته في مساحة فارغة (لا يوجد `target` في `SmartConnectorManager.onUp`)، بدلًا من الإلغاء الصامت الحالي، تُفتح لوحة عائمة عند نقطة الإفلات:

**محتوى اللوحة:**
1. **قائمة اقتراحات الخطوة التالية** — تُولَّد بالذكاء الاصطناعي عبر `useSmartElementAI.generateElements` مستخدمة سياق العنصر المصدر (نوعه، محتواه، الموصلات الحالية) لاقتراح 3-5 خطوات منطقية (مهمة، قرار، مرحلة، تحقق…). كل اقتراح بطاقة قابلة للنقر تُنشئ عنصر ذكي جديد + موصل من المصدر إليه.
2. **زر "كتابة أمر"** — يفتح صندوق محادثة صغير (input + send)، يستقبل وصف المستخدم، ثم يستدعي `generateElements` مع prompt مخصص. الناتج يُنشأ كـ **فريم واحد** يحوي مجموعة عناصر ذكية تعمل كأداة مركّبة موحدة.
3. **زر "إلغاء"** — يغلق اللوحة دون فعل.

**الملفات الجديدة:**
- `src/features/planning/elements/smart/NextStepSuggestionsPanel.tsx` — لوحة عائمة (Popover) بستايل glass modal.
- تعديل `SmartConnectorManager.onUp`: عند غياب target، فتح اللوحة عند `p.x, p.y` مع تمرير `sourceElementId`.
- إضافة helper `createFramedWorkflow(elements, sourceId)` في `SmartConnectorManager` — يُنشئ frame + عناصر داخله + موصل من المصدر لأول عنصر.

## 5) تغييرات تقنية موجزة

| ملف | التغيير |
|---|---|
| `src/features/planning/hooks/useElementLockAcquire.ts` | تثبيت مرجع الدالة، إزالة deps المتقلبة |
| `src/features/planning/ui/PlanningCanvas.tsx` | تمرير `requestElementLock` ثابت |
| `src/features/planning/canvas/layers/CanvasElement.tsx` | تأجيل `ensureEditLock` حتى بدء السحب الفعلي |
| `src/features/planning/canvas/viewport/InfiniteCanvas.tsx` | تحسين clearSelection قبل العتبة |
| `src/features/planning/elements/smart/RootConnector.tsx` | إعادة تصميم `ConnectionAnchors` (موقع top-right، شكل دائري، ألوان AI، اتجاه ←) |
| `src/features/planning/elements/smart/SmartConnectorManager.tsx` | drop-on-empty يفتح لوحة الاقتراحات + memo لـresolvePoint |
| `src/features/planning/elements/smart/NextStepSuggestionsPanel.tsx` | **جديد** — لوحة الخطوة التالية + محادثة الأمر المخصص |

## 6) الاختبار
- تحديث `RootConnector.test.tsx` لتوقع anchor في `top-right` بموقع `(bounds.x + bounds.width, bounds.y)`.
- إضافة اختبار: drop في فراغ → لوحة تظهر بـ testId `next-step-panel`.
- اختبار يدوي: تحديد عنصر ذكي، مراقبة أن `CanvasElement` لا يُعاد رندره أكثر من مرة واحدة (React DevTools Profiler).
