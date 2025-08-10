# SoaBra Motion System
نظام الحركة الموحد لتطبيق سوبرا

## المكونات الأساسية

### Reveal
مكون لإظهار عنصر واحد بحركة fade + slide-up خفيفة

```tsx
import { Reveal } from '@/components/shared/motion';

// استخدام أساسي
<Reveal>
  <Card>محتوى البطاقة</Card>
</Reveal>

// مع خصائص مخصصة
<Reveal delay={0.1} y={32} duration={0.8}>
  <h1>عنوان مع تأخير</h1>
</Reveal>
```

#### الخصائص المتاحة:
- `delay?: number` - تأخير البدء بالثواني (افتراضي: 0)
- `y?: number` - المسافة العمودية الابتدائية بالبكسل (افتراضي: 24)
- `duration?: number` - مدة الحركة بالثانية (افتراضي: 0.7)
- `ease?: [number, number, number, number]` - منحنى الحركة (افتراضي: [0.22, 1, 0.36, 1])
- `once?: boolean` - تشغيل مرة واحدة فقط (افتراضي: true)
- `amount?: number` - نسبة ظهور العنصر قبل بدء الحركة (افتراضي: 0.2)

### Stagger
مكون لإظهار مجموعة عناصر بتتابع زمني

```tsx
import { Stagger } from '@/components/shared/motion';

// استخدام أساسي
<Stagger delay={0.1} gap={0.08}>
  <Stagger.Item><Card>بطاقة 1</Card></Stagger.Item>
  <Stagger.Item><Card>بطاقة 2</Card></Stagger.Item>
  <Stagger.Item><Card>بطاقة 3</Card></Stagger.Item>
</Stagger>

// مع شبكة CSS
<Stagger className="grid grid-cols-3 gap-4" delay={0.2} gap={0.12}>
  {items.map(item => (
    <Stagger.Item key={item.id}>
      <Card>{item.content}</Card>
    </Stagger.Item>
  ))}
</Stagger>
```

#### خصائص Stagger:
- `delay?: number` - تأخير بدء التتابع (افتراضي: 0)
- `gap?: number` - الفاصل الزمني بين العناصر (افتراضي: 0.08)
- `once?: boolean` - تشغيل مرة واحدة فقط (افتراضي: true)
- `amount?: number` - نسبة الظهور قبل البدء (افتراضي: 0.2)

#### خصائص Stagger.Item:
- `y?: number` - المسافة العمودية لكل عنصر (افتراضي: 24)
- `duration?: number` - مدة حركة كل عنصر (افتراضي: 0.7)
- `ease?: [number, number, number, number]` - منحنى الحركة (افتراضي: [0.22, 1, 0.36, 1])

## أمثلة الاستخدام

### صفحة البطل (Hero Section)
```tsx
<Reveal delay={0}>
  <h1>العنوان الرئيسي</h1>
</Reveal>
<Reveal delay={0.08}>
  <p>العنوان الفرعي</p>
</Reveal>
<Reveal delay={0.14}>
  <Button>دعوة للعمل</Button>
</Reveal>
```

### شبكة المشاريع
```tsx
<Stagger delay={0.1} gap={0.09} className="grid grid-cols-3 gap-6">
  {projects.map(project => (
    <Stagger.Item key={project.id}>
      <ProjectCard project={project} />
    </Stagger.Item>
  ))}
</Stagger>
```

### قائمة الإحصائيات
```tsx
<Stagger delay={0.1} gap={0.08} className="grid grid-cols-4 gap-4">
  {stats.map((stat, index) => (
    <Stagger.Item key={index}>
      <StatCard {...stat} />
    </Stagger.Item>
  ))}
</Stagger>
```

## القيم الافتراضية الموصى بها

- **ease**: `[0.22, 1, 0.36, 1]` - منحنى طبيعي وسلس
- **duration**: `0.7` ثانية - سرعة متوازنة
- **y**: `24` بكسل - حركة خفيفة غير مبالغ فيها
- **stagger gap**: `0.08` ثانية - تتابع سريع ومريح
- **viewport once**: `true` - تجنب تكرار الحركة أثناء التمرير
- **viewport amount**: `0.2` - بدء الحركة عند ظهور 20% من العنصر

## نصائح الأداء

1. **استخدم `once={true}`** لتجنب إعادة حساب الحركة عند التمرير
2. **تجنب تطبيق Motion على آلاف العناصر** في نفس الصفحة
3. **فضّل CSS transforms** على تغييرات Layout
4. **اختبر على الأجهزة الضعيفة** للتأكد من الأداء

## قائمة المراجعة

- ✅ كل عنصر يظهر بسلاسة بدون قفزات
- ✅ التأخيرات قصيرة ومتناسقة
- ✅ لا توجد حركات إضافية غير مطلوبة
- ✅ تجربة RTL سليمة