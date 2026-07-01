# خطة إصلاح أداة التحديد (Selection Tool) — مع دعم شاشات اللمس

بعد مراجعة الملفات الأساسية للأداة:
- `InfiniteCanvas.tsx` (المدخل الرئيسي لأحداث الماوس/اللمس)
- `useCanvasSelectionController.ts` (منسّق marquee)
- `SelectionBox.tsx` + `useSelectionBox`
- `BoundingBox.tsx` (سحب/تغيير حجم العناصر المحددة)
- `CanvasElement.tsx` (نقر العنصر واختيار المتعدد)
- `selectionSlice.ts` + `selectionCoordinator.ts`
- `useTouchGestures.ts` (لمس)

تم رصد 4 مشاكل جذرية متشابكة + فجوة كاملة في دعم اللمس على التابلت وشاشات اللمس في الكمبيوتر.

## المشاكل الجذرية

**١) Marquee (السحب) غير دقيق**
- `beginBoxSelection` يستخدم `additive = e.shiftKey` فقط — Ctrl/Meta لا تعمل كإضافة.
- لا يوجد مسح للتحديد السابق عند بدء marquee بدون shift → التحديد القديم يبقى ظاهراً ثم يتبدّل فجأة.
- عتبة 5px صغيرة → رجفة تحوّل نقرة إلى marquee فارغ يمسح التحديد.

**٢) Shift/Ctrl+Click خربان**
- عند `!isSelected && multiSelect` يُستدعى `onSelect(multiSelect)` ثم `startDrag` فوراً → يبدأ سحب عنصر واحد.
- منطق multi-select مكرر في `CanvasElement` و`selectionCoordinator` بدون توحيد.

**٣) تحريك المحدد فيه لخبطة**
- `startDrag` في `CanvasElement` يحرّك `[element.id]` فقط دون احترام `metadata.groupId` بينما `BoundingBox` يحترمه → مساران متعارضان.

**٤) التحديد يختفي بدون سبب**
- كل نقرة تبدأ `boxSelect` فوراً؛ mouseUp بلا سحب فعلي ينفّذ `clearSelection`.
- `setTimeout(0)` داخل `useSelectionBox.finishSelection` يسبّب race مع تحديد لاحق.
- `setHoveredConnectableElementId` كل حركة → إعادة تصيير مستمرة تُبطل ذاكرة الأحداث (يفسّر ملاحظة المستخدم عن الاستقرار بعد تحديث زر الذكاء).

**٥) اللمس غير مدعوم للأداة (تابلت + شاشات لمس كمبيوتر)**
- كل معالجات الأداة تستخدم `onMouseDown/Move/Up` بدل `onPointerDown/Move/Up`؛ اللمس على Chromium يولّد أحداث Mouse مركّبة لكن مع تأخير 300ms، وبدون ضغط modifiers (لا Shift/Ctrl على اللمس).
- `useTouchGestures` مُستدعى لكن مقتصر على `onLongPress` كـ `console.log` فقط، ولا يفعّل marquee أو multi-select.
- BoundingBox يستخدم Pointer Events (جيد) لكن مقاسات المقابض 16px × 16px، صغيرة لأصابع اللمس (الحد الأدنى الموصى: 40px hit-area).
- لا يوجد سلوك اختيار متعدد لمسي بديل عن Shift (المطلوب: **long-press → دخول وضع multi-select**، ثم كل tap يضيف/يزيل).
- لا يوجد `touch-action` مضبوط على الحاوية → المتصفح يحاول عمل تمرير أثناء marquee.

## خطة الإصلاح

### أ. توحيد marquee + عتبة سحب حقيقية (ماوس + لمس)
- في `InfiniteCanvas` بدّل `onMouseDown/Move/Up` بـ `onPointerDown/Move/Up` + `onPointerCancel`.
- خزّن `pendingBoxSelect = {clientX, clientY, additive, pointerType, pointerId}` في ref بدل بدء `boxSelect` فوراً.
- في `PointerMove`: إذا تجاوزت المسافة threshold ديناميكية:
  - **ماوس**: 6px.
  - **لمس/قلم** (`pointerType === 'touch' | 'pen'`): 10px (لتقليل الحساسية للرجفة).
- عند التجاوز: إن لم يكن additive نفّذ `clearSelection()` مرة قبل `beginBoxSelection`.
- على `PointerUp`: إن بقي pending (نقرة قصيرة) فامسح التحديد فقط إذا كان الهدف كانفاس فارغ ولم يكن additive.
- في `useCanvasSelectionController.completeBoxSelection`: أزل مسار "clearSelection عند غياب drag" (صار محسوماً في PointerUp).

### ب. توحيد سحب العناصر داخل BoundingBox فقط
- في `CanvasElement.handleMouseDown` → حوّله إلى `handlePointerDown`:
  - `!isSelected` بدون multiSelect: نفّذ `onSelect(false)` فقط، **لا** تبدأ drag.
  - `multiSelect`: نفّذ toggle عبر `selectionCoordinator.handleElementSelect` و`stopPropagation()` وارجع.
  - أزل `startDrag` الداخلي، عدا حالة `isAllArrows` (حيث BoundingBox = null) — احتفظ به كـ fallback.
- `BoundingBox.handleDragStart` يبقى المصدر الوحيد لتحريك المجموعة.

### ج. تثبيت منطق multi-select (ماوس + لمس)
- استبدل الكتلة اليدوية في `CanvasElement` باستدعاء `selectionCoordinator.handleElementSelect(id, isSelected, modifiers)`.
- **وضع Multi-Select اللمسي**: أضف حقلاً `touchMultiSelectMode: boolean` في `interactionStore`:
  - يُفعَّل عند **long-press ≥ 500ms** على عنصر (عبر `useTouchGestures.onLongPress` المفعّل حقيقياً).
  - أثناء تفعّله، كل `tap` على عنصر = toggle كأن Shift مضغوط.
  - يُطفأ بزر عائم صغير "إنهاء التحديد" داخل شريط أدوات التحديد، أو عند مسح التحديد.
  - أضف مؤشراً بصرياً واضحاً (شارة صغيرة في الفلوتنق بار) بلغة عربية: "وضع التحديد المتعدد".
- في `selectionCoordinator.handleElementSelect`: عامل `touchMultiSelectMode` كأنه `modifiers.shift = true`.

### د. إزالة race الخريطة الذهنية
- في `useSelectionBox.finishSelection`: احذف `setTimeout(0)` وادمج التوسّع في نفس التحديث:
  - احسب `expandedIds` مباشرة قبل استدعاء `selectElements(finalIds)` مرة واحدة.

### هـ. تقليل إعادة التصيير من hover
- في `handlePointerMove`: لا تستدعِ `setHoveredConnectableElementId` إلا عند تغيّر فعلي.
- تعطيل hover تماماً عند `pointerType !== 'mouse'` (اللمس لا يوفر hover مفيداً).
- استخدم `requestAnimationFrame` throttle للـ hover detection.

### و. تحسينات اللمس على الحاوية والمقابض
- الحاوية `infinite-canvas-container`: أضف `style={{ touchAction: 'none' }}` عند `activeTool === 'selection_tool'` لمنع المتصفح من التمرير أثناء marquee. عند أدوات أخرى تكتفي بـ `touchAction: 'pan-x pan-y'` كي يعمل التمرير الطبيعي.
- BoundingBox `ResizeHandle`:
  - رفع hit-area إلى 24×24 مع إبقاء المقبض المرئي 8px (استخدم `padding` شفاف داخل غلاف الحدث).
  - dragArea الرئيسي يبقى pointer-events auto كما هو.
- إضافة `user-select: none; -webkit-touch-callout: none;` على الحاوية لمنع القوائم السياقية للنظام أثناء long-press.

### ز. Pan/Zoom باللمس بدون تعارض مع marquee
- في `useTouchGestures`:
  - **إصبع واحد + selection_tool**: يبدأ pending marquee (نفس مسار الماوس).
  - **إصبعان**: pinch-zoom + pan (بدل marquee) — عبر `zoomByWheel`/`panBy`.
  - **long-press ≥ 500ms على عنصر**: يفعّل `touchMultiSelectMode`.
  - **long-press على كانفاس فارغ**: يفتح قائمة سياقية خفيفة (لاحقاً — خارج النطاق).
- عند اكتشاف إصبع ثانٍ أثناء pending/boxSelect: ألغِ marquee وحوّل إلى pan/zoom.

### ح. اختبارات وتحقّق
- شغّل: `useCanvasSelectionController.test.ts`, `SelectionBox.test.tsx`, `selectionSlice.test.ts`.
- سيناريوهات Playwright (viewport = tablet 1024×1366 + touch emulation):
  1. Marquee ماوس من فراغ يحدد؛ Shift+drag يضيف.
  2. Ctrl/Meta+Click متعدد يعمل بدون بدء سحب.
  3. سحب عضو مجموعة يحرّك المجموعة.
  4. نقرة سريعة على عنصر محدد لا تفقد التحديد.
  5. **لمس تابلت**: tap على عنصر يحدده؛ long-press يفعّل multi-select mode؛ tap لاحق يضيف.
  6. **لمس تابلت**: إصبعان يعملان pinch-zoom بدل marquee.
  7. **لمس تابلت**: drag بإصبع واحد فوق فراغ يعمل marquee بعد 10px.
  8. لا context menu للمتصفح عند long-press.

## الملفات المتأثرة
- `src/features/planning/canvas/viewport/InfiniteCanvas.tsx` — تحويل إلى Pointer Events + threshold + touchAction.
- `src/features/planning/canvas/controllers/useCanvasSelectionController.ts` — عتبة ديناميكية + إزالة clearSelection الضمني.
- `src/features/planning/canvas/selection/SelectionBox.tsx` — إزالة setTimeout.
- `src/features/planning/canvas/selection/BoundingBox.tsx` — hit-area مقابض + PointerEvents موحّدة.
- `src/features/planning/canvas/layers/CanvasElement.tsx` — تحويل إلى PointerDown + إزالة startDrag الافتراضي.
- `src/features/planning/state/slices/selectionSlice.ts` — حراسة.
- `src/stores/interactionStore.ts` — إضافة `touchMultiSelectMode` + actions.
- `src/hooks/useTouchGestures.ts` — تنفيذ long-press/two-finger/single-finger فعلياً.
- `src/engine/canvas/interaction/selectionCoordinator.ts` — قراءة `touchMultiSelectMode` كـ shift.
- (اختياري) شارة "وضع التحديد المتعدد" في `FloatingBar`.

## المخاطر
- تحويل الأحداث من Mouse إلى Pointer قد يكسر مستمعين معتمدين على bubble من `mousedown` — سنراجع كل `addEventListener('mousedown')` في `CanvasElement`/`BoundingBox` ونحوّلها متزامناً.
- `touchAction: 'none'` يعطّل تمرير الصفحة داخل الكانفاس — مقبول لأن الكانفاس ملء الشاشة.
- زيادة hit-area للمقابض قد تسبّب اعتراض نقرات قريبة — سنستخدم padding شفاف فقط دون تغيير المرئي.
- long-press قد يتعارض مع القائمة السياقية للنظام — نمنعها بـ `contextmenu` preventDefault داخل الكانفاس.

## خارج النطاق
- قائمة سياقية لمسية عند long-press على فراغ (تُجدول لاحقاً).
- دعم Apple Pencil/Stylus tilt/pressure لأداة التحديد (لا معنى له للتحديد).
