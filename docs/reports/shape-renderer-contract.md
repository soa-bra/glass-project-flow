# ShapeRenderer Contract Review

## الملفات المراجَعة
- `src/features/planning/elements/shared/ShapeRenderer.tsx`

## 1) جدول الـ Props

| Prop | النوع | مطلوب | موجود في `diagram` | موجود في `shared` | الملاحظات السلوكية |
|---|---|---:|---:|---:|---|
| `shapeType` | `string` | نعم | — | ✅ | يحدد مسار الرسم بالكامل (أشكال هندسية/أسهم/أيقونة/ستيكي). |
| `width` | `number` | نعم | — | ✅ | يتم تطبيعها إلى `w = Math.max(width, 1)` لمنع الأبعاد السالبة/الصفرية. |
| `height` | `number` | نعم | — | ✅ | يتم تطبيعها إلى `h = Math.max(height, 1)`. |
| `fillColor` | `string` | نعم | — | ✅ | تعبئة الأشكال؛ وتُستخدم كلون fallback للأسهم عندما `strokeColor` شفاف. |
| `strokeColor` | `string` | نعم | — | ✅ | حدّ الأشكال ولون السهم الأساسي إذا لم يكن شفافًا. |
| `strokeWidth` | `number` | نعم | — | ✅ | سماكة الحدود/الأسهم + حساب `padding = strokeWidth / 2`. |
| `opacity` | `number` | اختياري | — | ✅ | افتراضي `1` ويُمرر في `commonProps`؛ في `sticky` يطبّق فقط على الورقة نفسها. |
| `borderRadius` | `number` | اختياري | — | ✅ | افتراضي `0` ويؤثر على `rectangle` و`default` فقط (وليس `sticky` الذي يستخدم `rx=4` ثابت). |
| `iconName` | `string` | اختياري | — | ✅ | مستخدم عند `shapeType='icon'` لتحديد Lucide icon؛ fallback إلى مستطيل عند اسم غير صالح. |
| `stickyText` | `string` | اختياري | — | ✅ | نص ملاحظة `sticky`; مع حساب ارتفاع ديناميكي حسب طول النص والمساحة المتاحة. |
| `arrowData` | `ArrowData` | اختياري | — | ✅ | يفعّل مسار سهم متقدم (`elbow/orthogonal`) عند توفر `middlePoint` أو `segments>1`. |

> ملاحظة مهمة: لم تعد توجد طبقة توافق للـ diagram؛ المسار canonical الوحيد هو barrel `shared`.

## 2) السلوك الحالي

### النتيجة الفعلية
كل منطق الرسم الفعلي موجود في `shared/ShapeRenderer.tsx` فقط، ويصل المستهلكون إليه عبر barrel `shared`.

### اختلافات بنيوية (غير سلوكية)
1. **نقطة دخول واحدة:**
   - يتم استيراد `ShapeRenderer` من barrel `shared`.
2. **لا توجد طبقة توافق:**
   - تمت إزالة نقطة الدخول القديمة بعد ترحيل المستهلكين.

## 3) تصنيف الفروقات

| الفارق | النوع | القرار |
|---|---|---|
| وجود نقطة دخول واحدة في `shared` | تبسيط مقصود | الاعتماد على barrel canonical وعدم إعادة إنشاء shim قديم. |
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
3. يبقى barrel `shared` نقطة الدخول الوحيدة ويختار `variant` حسب الحاجة.
4. ملف `shared` يمرر `variant="shared"` تلقائيًا أو يقبل `context="diagram"` للمستهلكين الذين يحتاجون سلوك diagram.

### الفائدة
- يمنع التفرع العشوائي بشرطية مرتبطة بالمسار.
- يتيح فروقات مستقبلية محسوبة (مثلاً hit-area أكبر في diagram للتحرير، أو تبسيط sticky في export/print context).
- يحافظ على API واحد ويقلل مخاطر الانكسار.

### مسار ترحيل آمن
1. إدخال `variant` بدون تغيير سلوك (نفس config لكلا السياقين).
2. إضافة اختبارات snapshot/DOM للأنواع الحساسة (arrows + sticky + icon fallback).
3. عند الحاجة لأي فرق domain، يتم تغيير config فقط بدل نسخ component.
