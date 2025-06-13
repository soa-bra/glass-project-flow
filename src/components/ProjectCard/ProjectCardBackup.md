
# تصميم البطاقات المرجعي - ProjectCard Reference Design

## التاريخ: 2025-06-10
## الحالة: التصميم المعتمد والثابت - محدث

### المواصفات الحالية:

#### ProjectCardLayout.tsx
- الخلفية: `bg-white/60 backdrop-blur-[20px]`
- الحواف: `rounded-2xl`
- الظل العادي: `shadow-sm`
- الظل عند التحديد: `shadow-lg scale-[1.02]`
- التأثير المخصص: `box-shadow: 0 0 20px ${statusColors[status]}30, 0 4px 16px ${statusColors[status]}20`
- الشفافية: `opacity-100` عادي، `opacity-50` عند تحديد بطاقة أخرى
- الحشو: `p-2`
- المسافات: `mx-auto my-1`

#### ProjectCardDaysCircle.tsx
- الحجم: `w-[75px] h-[75px]`
- الخلفية: `bg-transparent`
- الحدود: `border-2 border-gray-300`
- الموضع: الجانب الأيسر من البطاقة

#### ProjectCardTasksCircle.tsx
- الحجم: `w-[75px] h-[75px]`
- الخلفية: `bg-[#CCD4D7]`
- لون النص: `color: #2A3437`
- الموضع: الجانب الأيمن من البطاقة

#### ProjectCardTitle.tsx
- المحاذاة: `text-center`
- المسافات: `my-[15px] mx-[20px]`
- العنوان: `text-lg font-bold mb-1 font-arabic text-right text-gray-900`
- الوصف: `font-arabic text-right text-cyan-800`

#### ProjectCardStatusIndicators.tsx
- التخطيط: `flex items-center justify-between`
- المسافات: `px-0 mx-0 my-0 py-[5px]`
- دائرة الحالة: `w-[20px] h-[20px] rounded-full mx-[10px]` - الجانب الأيسر
- تأثير الإضاءة: `box-shadow: 0 2px 6px ${statusColors[status]}20, 0 0 12px ${statusColors[status]}15`
- ترتيب الشارات (من اليسار لليمين): التاريخ - المالك - القيمة
- الشارات: `bg-#E3E3E3 rounded-full py-0 px-[21px]`
- المالك: `mx-[15px] px-[25px]` - بدون هالة ضوئية

### ألوان الحالة:
```typescript
const statusColors = {
  success: '#00bb88',
  warning: '#ffb500',
  error: '#f4767f',
  info: '#2f6ead'
};
```

### خط الواجهة:
- الخط الأساسي: `IBM Plex Sans Arabic`
- الاتجاه: `RTL`
- التأثيرات: `Glassmorphism (rgba 255/255/255/40 + blur 20 px)`

### التحديثات الأخيرة:
1. تم تحريك دائرة الحالة إلى الجانب الأيسر من البطاقة
2. تم تكبير دائرة الحالة إلى 20px × 20px
3. تم إضافة تأثير إضاءة للدائرة مع الألوان المطابقة للحالة
4. تم ترتيب الشارات: التاريخ - المالك - القيمة
5. تم إزالة الهالة الضوئية من شارة المالك
6. تم توحيد خلفية جميع الشارات إلى #E3E3E3

---

## تعليمات الاستعادة:
في حال تم تعديل التصميم عن طريق الخطأ، استخدم هذا الملف كمرجع لاستعادة المواصفات الأصلية.

### كيفية الاستعادة:
1. انسخ المواصفات من هذا الملف
2. اطلب من المطور تطبيق هذه المواصفات على الملفات المقابلة
3. تأكد من عدم تغيير الوظائف الأساسية للبطاقات

### الملفات الرئيسية:
- ProjectCardLayout.tsx
- ProjectCardHeader.tsx
- ProjectCardTitle.tsx
- ProjectCardDaysCircle.tsx
- ProjectCardTasksCircle.tsx
- ProjectCardStatusIndicators.tsx
- ProjectCardFooter.tsx

