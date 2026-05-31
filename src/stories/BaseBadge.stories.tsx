/**
 * BaseBadge Storybook - توثيق تفاعلي لمكون BaseBadge
 */

import React, { useState } from 'react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Check, AlertTriangle, Info, X, Star, Zap } from 'lucide-react';

// ===== التحكم التفاعلي =====

type Variant = 'success' | 'warning' | 'error' | 'info' | 'default' | 'secondary' | 'outline' | 'primary';
type Size = 'sm' | 'md' | 'lg';

export const InteractivePlayground = () => {
  const [variant, setVariant] = useState<Variant>('default');
  const [size, setSize] = useState<Size>('md');
  const [text, setText] = useState('شارة تجريبية');

  const variants: Variant[] = ['success', 'warning', 'error', 'info', 'default', 'primary', 'secondary', 'outline'];
  const sizes: Size[] = ['sm', 'md', 'lg'];

  return (
    <div className="p-8 space-y-8 bg-panel min-h-screen" dir="rtl">
      <h1 className="text-display-m font-bold text-ink">BaseBadge Playground</h1>
      
      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-2xl border border-border">
        <div className="space-y-2">
          <label className="text-label font-medium text-ink-60">Variant</label>
          <select 
            value={variant} 
            onChange={(e) => setVariant(e.target.value as Variant)}
            className="w-full p-2 rounded-lg border border-border bg-white text-sm"
          >
            {variants.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-label font-medium text-ink-60">Size</label>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value as Size)}
            className="w-full p-2 rounded-lg border border-border bg-white text-sm"
          >
            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-label font-medium text-ink-60">Text</label>
          <input 
            type="text"
            value={text} 
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 rounded-lg border border-border bg-white text-sm"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="p-8 bg-white rounded-2xl border border-border flex items-center justify-center">
        <BaseBadge variant={variant} size={size}>
          {text}
        </BaseBadge>
      </div>

      {/* Code Preview */}
      <div className="p-4 bg-ink text-white rounded-xl font-mono text-sm">
        <pre>{`<BaseBadge variant="${variant}" size="${size}">
  ${text}
</BaseBadge>`}</pre>
      </div>
    </div>
  );
};

// ===== جميع الـ Variants =====

export const AllVariantsShowcase = () => {
  const variants = [
    { name: 'success', icon: <Check size={12} />, label: 'نجاح' },
    { name: 'warning', icon: <AlertTriangle size={12} />, label: 'تحذير' },
    { name: 'error', icon: <X size={12} />, label: 'خطأ' },
    { name: 'info', icon: <Info size={12} />, label: 'معلومات' },
    { name: 'default', icon: <Star size={12} />, label: 'افتراضي' },
    { name: 'primary', icon: <Zap size={12} />, label: 'أساسي' },
    { name: 'secondary', icon: null, label: 'ثانوي' },
    { name: 'outline', icon: null, label: 'إطار' },
  ] as const;

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">جميع الـ Variants</h2>
      
      <div className="flex flex-wrap gap-4 p-6 bg-white rounded-2xl border border-border">
        {variants.map(({ name, icon, label }) => (
          <div key={name} className="flex items-center gap-2">
            <BaseBadge variant={name}>
              {icon && <span className="mr-1">{icon}</span>}
              {label}
            </BaseBadge>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== جميع الأحجام =====

export const AllSizesShowcase = () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">جميع الأحجام</h2>
      
      <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-border">
        {sizes.map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <BaseBadge variant="primary" size={size}>
              حجم {size}
            </BaseBadge>
            <span className="text-xs text-ink-60">size: {size}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== أمثلة واقعية =====

export const RealWorldExamples = () => {
  return (
    <div className="p-8 space-y-8 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">أمثلة واقعية</h2>
      
      {/* Status Badges */}
      <div className="p-6 bg-white rounded-2xl border border-border space-y-4">
        <h3 className="text-subtitle font-semibold text-ink">حالات المشاريع</h3>
        <div className="flex flex-wrap gap-3">
          <BaseBadge variant="success"><Check size={12} className="mr-1" /> مكتمل</BaseBadge>
          <BaseBadge variant="warning"><AlertTriangle size={12} className="mr-1" /> قيد التنفيذ</BaseBadge>
          <BaseBadge variant="error"><X size={12} className="mr-1" /> ملغي</BaseBadge>
          <BaseBadge variant="info"><Info size={12} className="mr-1" /> جديد</BaseBadge>
        </div>
      </div>

      {/* Priority Badges */}
      <div className="p-6 bg-white rounded-2xl border border-border space-y-4">
        <h3 className="text-subtitle font-semibold text-ink">مستويات الأولوية</h3>
        <div className="flex flex-wrap gap-3">
          <BaseBadge variant="error">عاجل</BaseBadge>
          <BaseBadge variant="warning">مرتفع</BaseBadge>
          <BaseBadge variant="info">متوسط</BaseBadge>
          <BaseBadge variant="secondary">منخفض</BaseBadge>
        </div>
      </div>

      {/* Category Tags */}
      <div className="p-6 bg-white rounded-2xl border border-border space-y-4">
        <h3 className="text-subtitle font-semibold text-ink">تصنيفات</h3>
        <div className="flex flex-wrap gap-2">
          <BaseBadge variant="default" size="sm">تصميم</BaseBadge>
          <BaseBadge variant="default" size="sm">تطوير</BaseBadge>
          <BaseBadge variant="default" size="sm">تسويق</BaseBadge>
          <BaseBadge variant="default" size="sm">مالية</BaseBadge>
          <BaseBadge variant="default" size="sm">موارد بشرية</BaseBadge>
        </div>
      </div>

      {/* Clickable Badges */}
      <div className="p-6 bg-white rounded-2xl border border-border space-y-4">
        <h3 className="text-subtitle font-semibold text-ink">شارات تفاعلية</h3>
        <div className="flex flex-wrap gap-3">
          <BaseBadge 
            variant="primary" 
            onClick={() => alert('تم النقر!')}
          >
            انقر هنا
          </BaseBadge>
          <BaseBadge 
            variant="outline" 
            onClick={() => alert('خيار!')}
          >
            خيار قابل للنقر
          </BaseBadge>
        </div>
      </div>
    </div>
  );
};

// ===== Default Export =====

const BaseBadgeStories = {
  InteractivePlayground,
  AllVariantsShowcase,
  AllSizesShowcase,
  RealWorldExamples,
};

export default BaseBadgeStories;
