# ShapeRenderer Contract Review

## الملفات المراجَعة
- `src/features/planning/elements/diagram/ShapeRenderer.tsx`
- `src/features/planning/elements/shared/ShapeRenderer.tsx`

## 1) جدول الـ Props

| Prop | النوع | مطلوب | موجود في `diagram` | موجود في `shared` | الملاحظات السلوكية |
|---|---|---:|---:|---:|---|
| `shapeType` | `string` | نعم | ✅ (بشكل غير مباشر عبر re-export) | ✅ | يحدد مسار الرسم بالكامل (أشكال هندسية/أسهم/أيقونة/ستيكي). |
| `width` | `number` | نعم | ✅ (غير مباشر) | ✅ | يتم تطبيعها إلى `w = Math.max(width, 1)` لمنع الأبعاد السالبة/الصفرية. |
| `height` | `number` | نعم | ✅ (غير مباشر) | ✅ | يتم تطبيعها إلى `h = Math.max(height, 1)`. |
| `fillColor` | `string` | نعم | ✅ (غير مباشر) | ✅ | تعبئة الأشكال؛ وتُستخدم كلون fallback للأسهم عندما `strokeColor` شفاف. |
| `strokeColor` | `string` | نعم | ✅ (غير مباشر) | ✅ | حدّ الأشكال ولون السهم الأساسي إذا لم يكن شفافًا. |
| `strokeWidth` | `number` | نعم | ✅ (غير مباشر) | ✅ | سماكة الحدود/الأسهم + حساب `padding = strokeWidth / 2`. |
| `opacity` | `number` | اختياري | ✅ (غير مباشر) | ✅ | افتراضي `1` ويُمرر في `commonProps`؛ في `sticky` يطبّق فقط على الورقة نفسها. |
| `borderRadius` | `number` | اختياري | ✅ (غير مباشر) | ✅ | افتراضي `0` ويؤثر على `rectangle` و`default` فقط (وليس `sticky` الذي يستخدم `rx=4` ثابت). |
| `iconName` | `string` | اختياري | ✅ (غير مباشر) | ✅ | مستخدم عند `shapeType='icon'` لتحديد Lucide icon؛ fallback إلى مستطيل عند اسم غير صالح. |
| `stickyText` | `string` | اختياري | ✅ (غير مباشر) | ✅ | نص ملاحظة `sticky`; مع حساب ارتفاع ديناميكي حسب طول النص والمساحة المتاحة. |
| `arrowData` | `ArrowData` | اختياري | ✅ (غير مباشر) | ✅ | يفعّل مسار سهم متقدم (`elbow/orthogonal`) عند توفر `middlePoint` أو `segments>1`. |

> ملاحظة مهمة: ملف `diagram/ShapeRenderer.tsx` لا يعرّف Contract مستقلًا؛ هو طبقة توافق (`re-export`) فقط.

## 2) السلوك المختلف بين الملفين

### النتيجة الفعلية
لا يوجد اختلاف سلوكي في التنفيذ بين الملفين في الوضع الحالي:

- `diagram/ShapeRenderer.tsx` يصدّر `ShapeRenderer` من `shared` مباشرة.
- كل منطق الرسم الفعلي موجود في `shared/ShapeRenderer.tsx` فقط.

### اختلافات بنيوية (غير سلوكية)
1. **اختلاف Domain مقصود (Compatibility Layer):**
   - ملف `diagram` موجود فقط للتوافق العكسي مع مسارات استيراد قديمة (`@deprecated`).
2. **تكرار قابل للدمج:**
   - لا يوجد تكرار منطقي حقيقي الآن؛ التكرار الوحيد هو وجود نقطة دخول قديمة، وهذا تكرار مقصود لتفادي كسر المستهلكين.

## 3) تصنيف الفروقات

| الفارق | النوع | القرار |
|---|---|---|
| وجود ملفين بنفس الاسم في مسارين مختلفين | اختلاف Domain مقصود | الإبقاء مؤقتًا لدعم backward compatibility. |
| منطق الرسم داخل ملف واحد (`shared`) | ليس تكرارًا ضارًا | جيد حاليًا؛ لا حاجة لدمج إضافي على مستوى هذين الملفين تحديدًا. |

## 4) `variant` strategy لتوحيد التنفيذ مع الحفاظ على سلوك كل سياق

رغم عدم وجود اختلاف سلوكي حاليًا، يمكن تصميم استراتيجية `variant` استباقية حتى لو ظهرت فروقات مستقبلًا (Diagram vs Shared consumers):

### الهدف
- إبقاء نواة رسم واحدة (`BaseShapeRenderer`).
- تمرير إعدادات سياقية عبر `variant` بدل نسخ مكونات.

### تصميم مقترح

```ts
export type ShapeRendererVariant = 'diagram' | 'shared';

interface ShapeRendererProps {
  // props الحالية
  variant?: ShapeRendererVariant; // default: 'shared'
}
```

### طبقة إعدادات لكل Variant

```ts
type ShapeRendererConfig = {
  arrow: {
    hitAreaWidth: number;
    headSize: number;
    allowAdvancedArrowData: boolean;
  };
  sticky: {
    enableShadow: boolean;
    fixedCornerRadius?: number;
    autoHeight: boolean;
  };
  icon: {
    fallbackToRectangle: boolean;
  };
};

const VARIANT_CONFIG: Record<ShapeRendererVariant, ShapeRendererConfig> = {
  shared: {
    arrow: { hitAreaWidth: 20, headSize: 12, allowAdvancedArrowData: true },
    sticky: { enableShadow: true, fixedCornerRadius: 4, autoHeight: true },
    icon: { fallbackToRectangle: true },
  },
  diagram: {
    arrow: { hitAreaWidth: 20, headSize: 12, allowAdvancedArrowData: true },
    sticky: { enableShadow: true, fixedCornerRadius: 4, autoHeight: true },
    icon: { fallbackToRectangle: true },
  },
};
```

### طريقة التوحيد
1. استخراج دوال الرسم الداخلية إلى وحدات نقية (مثل `renderArrow`, `renderSticky`, `renderIcon`) تأخذ `config`.
2. `ShapeRenderer` يختار `config` حسب `variant` ثم يمرره لدوال الرسم.
3. ملف `diagram/ShapeRenderer.tsx` يصبح Wrapper صريحًا:
   ```tsx
   export const ShapeRenderer = (props: ShapeRendererProps) => (
     <SharedShapeRenderer {...props} variant="diagram" />
   );
   ```
4. ملف `shared` يمرر `variant="shared"` تلقائيًا.

### الفائدة
- يمنع التفرع العشوائي بشرطية مرتبطة بالمسار.
- يتيح فروقات مستقبلية محسوبة (مثلاً hit-area أكبر في diagram للتحرير، أو تبسيط sticky في export/print context).
- يحافظ على API واحد ويقلل مخاطر الانكسار.

### مسار ترحيل آمن
1. إدخال `variant` بدون تغيير سلوك (نفس config لكلا السياقين).
2. إضافة اختبارات snapshot/DOM للأنواع الحساسة (arrows + sticky + icon fallback).
3. عند الحاجة لأي فرق domain، يتم تغيير config فقط بدل نسخ component.
