/**
 * BaseBox Documentation
 * توثيق المكون الموحد للصناديق والبطاقات في نظام سوبرا
 * 
 * @description هذا الملف يحتوي على أمثلة استخدام BaseBox
 * يمكن استخدامه كمرجع للمطورين
 */

import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { FileText, Settings, Star, Bell, Users } from 'lucide-react';

// ===== الأمثلة =====

// القصة الافتراضية
export const DefaultExample = () => (
  <BaseBox>محتوى البطاقة الافتراضية</BaseBox>
);

// مع عنوان وأيقونة
export const WithTitleAndIconExample = () => (
  <BaseBox title="عنوان البطاقة" icon={<FileText size={20} />}>
    هذا هو محتوى البطاقة مع عنوان وأيقونة
  </BaseBox>
);

// البطاقة الزجاجية
export const GlassExample = () => (
  <div className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
    <BaseBox variant="glass" title="بطاقة زجاجية" icon={<Star size={20} />}>
      محتوى البطاقة الزجاجية مع تأثير blur
    </BaseBox>
  </div>
);

// البطاقة المسطحة
export const FlatExample = () => (
  <BaseBox variant="flat">بطاقة مسطحة بدون تأثيرات</BaseBox>
);

// بطاقة العمليات
export const OperationsExample = () => (
  <BaseBox variant="operations" title="بطاقة العمليات" icon={<Settings size={20} />}>
    محتوى بطاقة العمليات
  </BaseBox>
);

// جميع الأحجام
export const AllSizesExample = () => (
  <div className="flex flex-col gap-4">
    <BaseBox size="none" variant="unified">
      <span className="text-sm">size: none</span>
    </BaseBox>
    <BaseBox size="sm" variant="unified">
      <span className="text-sm">size: sm</span>
    </BaseBox>
    <BaseBox size="md" variant="unified">
      <span className="text-sm">size: md</span>
    </BaseBox>
    <BaseBox size="lg" variant="unified">
      <span className="text-sm">size: lg</span>
    </BaseBox>
  </div>
);

// جميع المظاهر
export const AllVariantsExample = () => (
  <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-xl">
    {(['standard', 'glass', 'flat', 'operations', 'unified', 'legal', 'exception'] as const).map((variant) => (
      <BaseBox key={variant} variant={variant} size="sm">
        <span className="text-sm font-medium">variant: {variant}</span>
      </BaseBox>
    ))}
  </div>
);

// مع الألوان
export const WithColorsExample = () => (
  <div className="grid grid-cols-2 gap-4">
    <BaseBox color="info" size="sm">
      <span className="text-sm">color: info</span>
    </BaseBox>
    <BaseBox color="success" size="sm">
      <span className="text-sm">color: success</span>
    </BaseBox>
    <BaseBox color="warning" size="sm">
      <span className="text-sm">color: warning</span>
    </BaseBox>
    <BaseBox color="error" size="sm">
      <span className="text-sm">color: error</span>
    </BaseBox>
    <BaseBox color="crimson" size="sm">
      <span className="text-sm">color: crimson</span>
    </BaseBox>
  </div>
);

// مع تأثير النيون
export const WithNeonRingExample = () => (
  <div className="grid grid-cols-2 gap-6 p-4">
    <BaseBox neonRing="info" size="sm">
      <span className="text-sm">neonRing: info</span>
    </BaseBox>
    <BaseBox neonRing="success" size="sm">
      <span className="text-sm">neonRing: success</span>
    </BaseBox>
    <BaseBox neonRing="warning" size="sm">
      <span className="text-sm">neonRing: warning</span>
    </BaseBox>
    <BaseBox neonRing="error" size="sm">
      <span className="text-sm">neonRing: error</span>
    </BaseBox>
  </div>
);

// مع حركة
export const AnimatedExample = () => (
  <BaseBox animate title="بطاقة متحركة" icon={<Bell size={20} />}>
    هذه البطاقة تظهر بحركة سلسة
  </BaseBox>
);

// بطاقة معقدة
export const ComplexCardExample = () => (
  <BaseBox
    variant="unified"
    size="md"
    title="إحصائيات الفريق"
    icon={<Users size={20} />}
    neonRing="success"
    animate
  >
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">الأعضاء النشطون</span>
        <span className="text-lg font-bold text-green-600">24</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">المهام المكتملة</span>
        <span className="text-lg font-bold text-blue-600">156</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }} />
      </div>
    </div>
  </BaseBox>
);

// تصدير جميع الأمثلة
const BaseBoxExamples = {
  Default: DefaultExample,
  WithTitleAndIcon: WithTitleAndIconExample,
  Glass: GlassExample,
  Flat: FlatExample,
  Operations: OperationsExample,
  AllSizes: AllSizesExample,
  AllVariants: AllVariantsExample,
  WithColors: WithColorsExample,
  WithNeonRing: WithNeonRingExample,
  Animated: AnimatedExample,
  ComplexCard: ComplexCardExample,
};

export default BaseBoxExamples;
