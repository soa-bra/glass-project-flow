
# تصميم البطاقات المرجعي - ProjectCard Reference Design

## التاريخ: 2025-06-10
## الحالة: التصميم المعتمد والثابت

### المواصفات الحالية:

#### ProjectCardLayout.tsx
- الخلفية: `bg-white/60 backdrop-blur-[20px]`
- الحواف: `rounded-2xl`
- الظل العادي: `shadow-sm`
- الظل عند التحديد: `shadow-lg shadow-blue-200/30`
- التأثير المخصص: `box-shadow: 0 0 20px rgba(0, 153, 255, 0.3), 0 4px 16px rgba(0, 153, 255, 0.1)`
- الشفافية: `opacity-100` عادي، `opacity-50` عند تحديد بطاقة أخرى
- الحشو: `p-2`
- المسافات: `mx-auto my-1`

#### ProjectCardDaysCircle.tsx
- الحجم: `w-[75px] h-[75px]`
- الخلفية: `bg-white/80 backdrop-blur-sm`
- الحدود: `border-2 border-gray-300`
- الحشو: `px-[9px]`

#### ProjectCardTasksCircle.tsx
- الحجم: `w-[75px] h-[75px]`
- الخلفية: `bg-[#CCD4D7]`
- لون النص: `color: #2A3437`

#### ProjectCardTitle.tsx
- المحاذاة: `text-center`
- المسافات: `my-[15px] mx-[20px]`
- العنوان: `text-lg font-bold mb-1 font-arabic text-right text-gray-900`
- الوصف: `font-arabic text-right text-cyan-800`

#### ProjectCardStatusIndicators.tsx
- التخطيط: `flex items-center justify-between`
- المسافات: `px-0 mx-0 my-[5px] py-[5px]`
- دائرة الحالة: `w-[15px] h-[15px] rounded-full mx-[75px]`
- الشارات: `bg-white/60 backdrop-blur-sm rounded-full py-0 px-[21px]`

### ألوان الحالة:
```typescript
const statusColors = {
  success: '#5DDC82',
  warning: '#ECFF8C',
  error: '#F23D3D',
  info: '#9DCBFF'
};
```

### خط الواجهة:
- الخط الأساسي: `IBM Plex Sans Arabic`
- الاتجاه: `RTL`
- التأثيرات: `Glassmorphism (rgba 255/255/255/40 + blur 20 px)`

---

## تعليمات الاستعادة:
في حال تم تعديل التصميم عن طريق الخطأ، استخدم هذا الملف كمرجع لاستعادة المواصفات الأصلية.

### كيفية الاستعادة:
1. انسخ المواصفات من هذا الملف
2. اطلب من المطور تطبيق هذه المواصفات على الملفات المقابلة
3. تأكد من عدم تغيير الوظائف الأساسية للبطاقات

