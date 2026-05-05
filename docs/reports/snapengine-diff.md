# SnapEngine Diff Report

## الملفات المراجَعة
- `src/engine/canvas/math/snapEngine.ts`
- `src/engine/canvas/interaction/snapEngine.ts`

## الخلاصة التنفيذية
لا يوجد حالياً تنفيذان مختلفان لـ SnapEngine. ملف `math/snapEngine.ts` هو **واجهة إعادة تصدير (re-export facade)** فقط، بينما التنفيذ الفعلي والـ API كاملة موجودة في `interaction/snapEngine.ts`.

---

## 1) الفروقات في API

### `src/engine/canvas/math/snapEngine.ts`
- لا يعرّف أي types أو classes أو functions خاصة به.
- يقوم فقط بـ:
  - `export * from '@/engine/canvas/interaction/snapEngine';`

**الأثر:**
- أي استيراد من مسار `math/snapEngine` يحصل على نفس الـ symbols المصدّرة من `interaction/snapEngine`.
- لا يوجد اختلاف سلوكي أو تعاقدي (contract) على مستوى API بين المسارين حالياً.

### `src/engine/canvas/interaction/snapEngine.ts`
يحتوي على المصدر الكامل للـ API، وأبرز ما يصدّره:
- أنواع البيانات:
  - `SnapConfig`
  - `SnapLine`
  - `SnapResult`
  - `ElementSnapTarget`
  - `SnapCandidate`
- إعدادات افتراضية (داخلياً): `DEFAULT_SNAP_CONFIG`
- تنفيذ المحرك (داخلياً): `SnapEngineImpl`
- واجهة الاستخدام عبر singleton export (من نفس الملف) لمحرك الـ snap المركزي.

---

## 2) الفروقات في المدخلات/المخرجات (I/O Contract)

بما أن `math/snapEngine` يعيد التصدير فقط:
- **المدخلات الفعلية** لكل دوال الـ snap تأتي من تنفيذ `interaction/snapEngine`.
- **المخرجات الفعلية** تأتي أيضاً من نفس التنفيذ دون أي تحويل أو adaptation إضافي.

### أمثلة من التعاقد الفعلي (من `interaction/snapEngine.ts`)
- `updateConfig(config: Partial<SnapConfig>): void`
  - **Input:** جزء من إعدادات `SnapConfig`.
  - **Output:** `void` (مع تحديث الحالة الداخلية وإشعار listeners).

- `updateTargets(elements, excludeIds?): void`
  - **Input:** مصفوفة عناصر بشكل `{ id, position, size }` + قائمة اختيارية للاستثناء.
  - **Output:** `void` (مع بناء targets داخلية مهيكلة).

- `snapPoint(point, excludeElementIds?): SnapResult`
  - **Input:** `Point` + قائمة IDs للاستثناء.
  - **Output:** `SnapResult` يحتوي `snappedPoint`, `didSnap`, `snappedX`, `snappedY`, `guides`, `deltaX`, `deltaY`.

- `snapBounds(bounds, excludeElementIds?): SnapResult & { snappedBounds: Bounds }`
  - **Input:** `Bounds` + قائمة IDs للاستثناء.
  - **Output:** نتيجة snap مع حدود جديدة `snappedBounds`.

---

## 3) المصدر الأساسي المقترح (Single Source of Truth)

**المقترح:**
- اعتماد `src/engine/canvas/interaction/snapEngine.ts` كمصدر أساسي وحيد للمنطق والـ API.

**السبب:**
- هو الملف الذي يحتوي التنفيذ الحقيقي وكل العقود (types + behavior).
- مسار `math/snapEngine` حالياً يعمل كـ compatibility alias مفيد للتوافق العكسي دون ازدواجية منطق.

---

## 4) Adapter مؤقت لتفادي كسر الاستدعاءات الحالية

بما أن هناك استدعاءات حالية قد تعتمد مسار `math/snapEngine`، الأفضل إبقاء adapter/bridge مؤقت بهذه الاستراتيجية:

1. **الإبقاء على re-export الحالي** في `math/snapEngine.ts` كما هو.
2. **إضافة deprecation notice** واضح داخل الملف (تعليق JSDoc) يوجّه لاستخدام `interaction/snapEngine` مباشرة.
3. **(اختياري) إضافة lint rule/ts-path warning** تدريجي لمنع imports جديدة من `math/snapEngine` مع السماح بالقديمة.
4. **خطة إزالة مرحلية:**
   - المرحلة A: keep + warn
   - المرحلة B: codemod/replace imports تلقائياً
   - المرحلة C: حذف الـ alias بعد دورة/دورتين release

### Adapter مقترح (نمطياً)
```ts
/** @deprecated استخدم '@/engine/canvas/interaction/snapEngine' مباشرة. */
export * from '@/engine/canvas/interaction/snapEngine';
```

بهذا نحافظ على الاستدعاءات القديمة بدون كسر، مع دفع تدريجي نحو المسار الرسمي الواحد.
