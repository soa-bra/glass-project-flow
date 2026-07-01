
# خطة الإصلاح — أداة التحديد + الأنكر + لوحة الخطوة التالية

## 1) مراجعة كاملة لأداة التحديد (بلا تعارض مع الأقفال والأنكرات)

الهدف: التأكد أن الاختيار لا يستدعي منطق القفل ولا يتضارب مع أنكرات SmartConnector.

- **Single click** على عنصر ذكي/عادي: يحدّد فقط. لا يستدعي `ensureEditLock` ولا يبدأ سحبًا. القفل يُطلب فقط بعد تجاوز عتبة السحب (4px مؤشر / 10px لمس).
- **Shift/Ctrl/Meta + click**: يمر عبر `selectionCoordinator` فقط، لا يبدأ drag ولا lock.
- **Marquee (سحب على فراغ)**: يعمل بعد عتبة 6px، ولا يمسح التحديد قبل تجاوز العتبة.
- **Long-press باللمس**: يُفعّل `touchMultiSelectMode` — النقرات التالية = shift-click. تمرير واحد إصبع = marquee بعد عتبة اللمس.
- **النقر على أنكر SmartConnector**: يجب أن يوقف انتشار الحدث قبل وصول `CanvasElement.onPointerDown` (يستخدم `event.stopPropagation()` بالفعل، لكن سنضيف `data-anchor-hit` للحماية من selectionCoordinator).
- **العنصر المقفل من متعاون آخر**: النقرة تحدد فقط للقراءة (بدون toast متكرر)، ولا تفتح تحرير.
- **Escape**: يلغي marquee/drag/anchor-drag ويعيد `interactionStore` إلى idle.

الملفات المتأثرة:
- `src/features/planning/canvas/layers/CanvasElement.tsx` — تأجيل `ensureEditLock` نهائيًا لبدء drag فعلي، والتأكد من تجاهل النقر إذا انطلق من عنصر يحمل `data-anchor-hit`.
- `src/engine/canvas/interaction/selectionCoordinator.ts` — التأكد من أن shift/ctrl لا يُشغّل drag.
- `src/features/planning/canvas/viewport/InfiniteCanvas.tsx` — عدم استدعاء `clearSelection` قبل عتبة marquee (كما هو، مع مراجعة سريعة).

## 2) لوحة اقتراحات الخطوة التالية — تعمل فقط عند الإفلات في فراغ

`SmartConnectorManager.onUp` حاليًا:
```
if (target) → handleCreateConnector(...)
else if (canEditBoard) → setNextStepPanel(...)
```
هذا صحيح مبدئيًا. سنضيف حواجز إضافية لضمان عدم التعارض مع التوصيل:
- **عدم فتح اللوحة** إذا كان `hoveredElementId` موجودًا لحظة الإفلات (target موجود).
- **عدم فتح اللوحة** إذا كانت مسافة السحب < 8px (نقرة عابرة على الأنكر).
- **صندوق "كتابة أمر"**: يُرسل payload بـ `preset='framed_workflow'` و`smartType='frame'` (موجود). سنتأكد أن `onInsertComponent` في `PlanningCanvas` يتعامل مع هذا الـ preset ويُنشئ **فريمًا واحدًا يحتوي عناصر متعدّدة** عبر استدعاء `useSmartElementAI.generateElements({ prompt, wrapInFrame: true, sourceElementId })`، ثم يستدعي `handleCreateConnector` لربط المصدر بأول عنصر داخل الفريم.
- **عدم التعارض مع التوصيل**: اللوحة تُفتح فقط بعد `onUp` وليس أثناء السحب، لذا لا تتقاطع مع snap على العناصر.

## 3) إعادة تصميم أنكر الجذر (RootConnector)

**الموقع الجديد** (نمط Miro، ثابت لكل عنصر):
- محاذاة يمين العنصر بالضبط: `x = bounds.x + bounds.width + 12`
- على ارتفاع 1/4 من الأعلى (= 3/4 من الأسفل): `y = bounds.y + bounds.height * 0.25`

**الشكل الجديد**:
- **بلا دائرة حاوية**. سهم فقط.
- سهم رفيع متجه لليمين (→) مرسوم بـ `path` مع stroke بلون AI gradient (`linearGradient` من `#3DBE8B` إلى `#3DA8F5`).
- عند hover: تكبير 1.25x + توهج ناعم (glow filter) بلون AI.
- منطقة hit شفافة (18px radius) حول السهم لسهولة الاستهداف.

**تزامن حركة الأنكر مع العنصر (إصلاح التأخر)**:
حاليًا `ConnectionAnchors` تُرسم داخل `SmartConnectorManager` باستخدام `elements` prop، الذي يُحدَّث من `canvasStore.elements`. أثناء drag العناصر تستخدم transform مؤقتًا (interactionStore.dragOffset) لتقليل عدد الـcommits، فتتأخر الأنكرات.
الحل: 
- في `SmartConnectorManager` نقرأ `interactionStore` مباشرة (`useInteractionStore(s => s.dragOffset, s.draggingIds)`) ونضيف الإزاحة إلى `bounds` عند حساب موقع الأنكر لكل عنصر يجري سحبه (نفس ما يفعله renderer العنصر).
- بديل احتياطي: نقلها ليتم رندرها كأبناء لطبقة العنصر مباشرة داخل `CanvasElement` بحيث تشترك في نفس transform.
- سنعتمد الحل الأول لأنه لا يغيّر شجرة SVG ويحافظ على `svgGroupRef` لحسابات clientToCanvas.

## 4) التغييرات التقنية الموجزة

| ملف | التغيير |
|---|---|
| `src/features/planning/elements/smart/RootConnector.tsx` | إعادة رسم `ConnectionAnchors`: y = 0.25 من الأعلى على يمين العنصر، سهم بلا دائرة، gradient AI، اتجاه ←، glow عند hover |
| `src/features/planning/elements/smart/SmartConnectorManager.tsx` | قراءة `dragOffset/draggingIds` من `interactionStore` وتطبيقها على `bounds` قبل تمريرها لـ`ConnectionAnchors` وقبل `resolvePoint`. إضافة عتبة 8px قبل فتح `nextStepPanel`، والتأكد من عدم فتحها عند وجود hovered target |
| `src/features/planning/canvas/layers/CanvasElement.tsx` | تجاهل onPointerDown القادم من عنصر بـ`data-anchor-hit`، وتأكيد أن lock/drag يبدآن فقط بعد عتبة الحركة |
| `src/features/planning/ui/PlanningCanvas.tsx` | معالجة `preset='framed_workflow'` في `onInsertComponent`: توليد فريم + عناصر داخله عبر `useSmartElementAI`، ثم توصيل المصدر بأول عنصر |
| `src/features/planning/elements/smart/RootConnector.test.ts` (وملف الاختبار المرافق) | تحديث القيم المتوقعة لموقع الأنكر (top-right at 25% height) |

## 5) الاختبار
- Unit: تحديث `RootConnector.test` لموقع الأنكر الجديد.
- يدوي: 
  1. سحب عنصر → مراقبة أن الأنكر يتحرك متزامنًا 60fps بلا تأخر.
  2. سحب من الأنكر وإفلات على عنصر آخر → يُنشئ موصلًا فقط.
  3. سحب من الأنكر وإفلات في فراغ → تظهر لوحة الخطوة التالية.
  4. كتابة أمر مخصص → يُنشأ فريم يحوي عدة عناصر + موصل من المصدر.
  5. Shift+Click على 5 عناصر ذكية متتالية → لا رعشة، لا فقدان تحديد.
