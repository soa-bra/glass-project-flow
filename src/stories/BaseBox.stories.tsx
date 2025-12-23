/**
 * BaseBox Storybook - توثيق تفاعلي لمكون BaseBox
 * @description يعرض جميع الـ variants والـ props بشكل مرئي وتفاعلي
 */

import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { 
  FileText, Settings, Star, Bell, Users, 
  TrendingUp, Calendar, CheckCircle, AlertTriangle,
  Briefcase, Heart, Zap, Shield
} from 'lucide-react';

// ===== التحكم التفاعلي =====

type Variant = 'standard' | 'glass' | 'flat' | 'operations' | 'unified' | 'legal' | 'exception';
type Size = 'none' | 'sm' | 'md' | 'lg';
type Color = 'info' | 'success' | 'warning' | 'error' | 'crimson' | undefined;
type NeonRing = 'info' | 'success' | 'warning' | 'error' | undefined;

export const InteractivePlayground = () => {
  const [variant, setVariant] = useState<Variant>('unified');
  const [size, setSize] = useState<Size>('md');
  const [color, setColor] = useState<Color>(undefined);
  const [neonRing, setNeonRing] = useState<NeonRing>(undefined);
  const [animate, setAnimate] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showIcon, setShowIcon] = useState(true);

  const variants: Variant[] = ['standard', 'glass', 'flat', 'operations', 'unified', 'legal', 'exception'];
  const sizes: Size[] = ['none', 'sm', 'md', 'lg'];
  const colors: (Color)[] = [undefined, 'info', 'success', 'warning', 'error', 'crimson'];
  const neonRings: (NeonRing)[] = [undefined, 'info', 'success', 'warning', 'error'];

  return (
    <div className="p-8 space-y-8 bg-panel min-h-screen" dir="rtl">
      <h1 className="text-display-m font-bold text-ink">BaseBox Playground</h1>
      
      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-border">
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
          <label className="text-label font-medium text-ink-60">Color</label>
          <select 
            value={color || ''} 
            onChange={(e) => setColor(e.target.value as Color || undefined)}
            className="w-full p-2 rounded-lg border border-border bg-white text-sm"
          >
            {colors.map(c => <option key={c || 'none'} value={c || ''}>{c || 'none'}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-label font-medium text-ink-60">Neon Ring</label>
          <select 
            value={neonRing || ''} 
            onChange={(e) => setNeonRing(e.target.value as NeonRing || undefined)}
            className="w-full p-2 rounded-lg border border-border bg-white text-sm"
          >
            {neonRings.map(n => <option key={n || 'none'} value={n || ''}>{n || 'none'}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={animate} 
            onChange={(e) => setAnimate(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-label text-ink-80">Animate</label>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={showTitle} 
            onChange={(e) => setShowTitle(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-label text-ink-80">Show Title</label>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={showIcon} 
            onChange={(e) => setShowIcon(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-label text-ink-80">Show Icon</label>
        </div>
      </div>

      {/* Preview */}
      <div className={`p-8 rounded-2xl ${variant === 'glass' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-panel'}`}>
        <BaseBox
          variant={variant}
          size={size}
          color={color}
          neonRing={neonRing}
          animate={animate}
          title={showTitle ? 'عنوان البطاقة التفاعلية' : undefined}
          icon={showIcon ? <Star size={20} /> : undefined}
        >
          <p className="text-body text-ink-80">
            هذا هو المحتوى التفاعلي للبطاقة. يمكنك تغيير جميع الخصائص من الأعلى.
          </p>
        </BaseBox>
      </div>

      {/* Code Preview */}
      <div className="p-4 bg-ink text-white rounded-xl font-mono text-sm overflow-x-auto">
        <pre>{`<BaseBox
  variant="${variant}"
  size="${size}"${color ? `\n  color="${color}"` : ''}${neonRing ? `\n  neonRing="${neonRing}"` : ''}${animate ? '\n  animate' : ''}${showTitle ? '\n  title="عنوان البطاقة"' : ''}${showIcon ? '\n  icon={<Star size={20} />}' : ''}
>
  محتوى البطاقة
</BaseBox>`}</pre>
      </div>
    </div>
  );
};

// ===== عرض جميع الـ Variants =====

export const AllVariantsShowcase = () => {
  const variants = [
    { name: 'standard', label: 'قياسي', icon: <FileText size={20} /> },
    { name: 'glass', label: 'زجاجي', icon: <Star size={20} /> },
    { name: 'flat', label: 'مسطح', icon: <Settings size={20} /> },
    { name: 'operations', label: 'عمليات', icon: <Briefcase size={20} /> },
    { name: 'unified', label: 'موحد', icon: <Users size={20} /> },
    { name: 'legal', label: 'قانوني', icon: <Shield size={20} /> },
    { name: 'exception', label: 'استثناء', icon: <AlertTriangle size={20} /> },
  ] as const;

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">جميع الـ Variants</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variants.map(({ name, label, icon }) => (
          <div key={name} className={name === 'glass' ? 'p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl' : ''}>
            <BaseBox 
              variant={name} 
              title={label}
              icon={icon}
              size="md"
            >
              <p className="text-body text-ink-80">
                variant: <code className="bg-ink/10 px-2 py-0.5 rounded">{name}</code>
              </p>
            </BaseBox>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== عرض جميع الأحجام =====

export const AllSizesShowcase = () => {
  const sizes = ['none', 'sm', 'md', 'lg'] as const;

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">جميع الأحجام</h2>
      
      <div className="space-y-4">
        {sizes.map(size => (
          <BaseBox key={size} variant="unified" size={size} title={`حجم: ${size}`}>
            <p className="text-body text-ink-80">
              size: <code className="bg-ink/10 px-2 py-0.5 rounded">{size}</code>
            </p>
          </BaseBox>
        ))}
      </div>
    </div>
  );
};

// ===== عرض الألوان =====

export const ColorsShowcase = () => {
  const colors = [
    { name: 'info', icon: <Bell size={20} />, label: 'معلومات' },
    { name: 'success', icon: <CheckCircle size={20} />, label: 'نجاح' },
    { name: 'warning', icon: <AlertTriangle size={20} />, label: 'تحذير' },
    { name: 'error', icon: <Zap size={20} />, label: 'خطأ' },
    { name: 'crimson', icon: <Heart size={20} />, label: 'قرمزي' },
  ] as const;

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">الألوان</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colors.map(({ name, icon, label }) => (
          <BaseBox key={name} color={name} size="sm" title={label} icon={icon}>
            <p className="text-body">
              color: <code className="bg-ink/10 px-2 py-0.5 rounded">{name}</code>
            </p>
          </BaseBox>
        ))}
      </div>
    </div>
  );
};

// ===== عرض تأثير النيون =====

export const NeonRingsShowcase = () => {
  const rings = ['info', 'success', 'warning', 'error'] as const;

  return (
    <div className="p-8 space-y-6 bg-panel min-h-screen" dir="rtl">
      <h2 className="text-display-m font-bold text-ink">تأثير النيون</h2>
      
      <div className="grid grid-cols-2 gap-8">
        {rings.map(ring => (
          <BaseBox key={ring} neonRing={ring} size="md" title={`نيون ${ring}`}>
            <p className="text-body text-ink-80">
              neonRing: <code className="bg-ink/10 px-2 py-0.5 rounded">{ring}</code>
            </p>
          </BaseBox>
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
      
      {/* KPI Card */}
      <BaseBox variant="unified" size="md" neonRing="success" animate>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-label text-ink-60">إجمالي المشاريع</p>
            <p className="text-display-l font-bold text-ink">156</p>
            <p className="text-label text-accent-green flex items-center gap-1">
              <TrendingUp size={14} /> +12% هذا الشهر
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center">
            <Briefcase size={28} className="text-accent-green" />
          </div>
        </div>
      </BaseBox>

      {/* Task Card */}
      <BaseBox variant="operations" size="md" title="المهام القادمة" icon={<Calendar size={20} />}>
        <div className="space-y-3">
          {['مراجعة التصميم', 'اجتماع الفريق', 'تسليم المشروع'].map((task, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-panel rounded-lg">
              <CheckCircle size={18} className="text-accent-green" />
              <span className="text-body text-ink-80">{task}</span>
            </div>
          ))}
        </div>
      </BaseBox>

      {/* Alert Card */}
      <BaseBox color="warning" size="sm" title="تنبيه" icon={<AlertTriangle size={20} />}>
        <p className="text-body">يوجد 3 مهام متأخرة تحتاج إلى اهتمامك</p>
      </BaseBox>

      {/* Glass Card */}
      <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
        <BaseBox variant="glass" size="lg" title="إحصائيات سريعة" icon={<TrendingUp size={20} />}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-display-m font-bold">24</p>
              <p className="text-label text-ink-60">نشط</p>
            </div>
            <div>
              <p className="text-display-m font-bold">156</p>
              <p className="text-label text-ink-60">مكتمل</p>
            </div>
            <div>
              <p className="text-display-m font-bold">8</p>
              <p className="text-label text-ink-60">معلق</p>
            </div>
          </div>
        </BaseBox>
      </div>
    </div>
  );
};

// ===== Default Export =====

const BaseBoxStories = {
  InteractivePlayground,
  AllVariantsShowcase,
  AllSizesShowcase,
  ColorsShowcase,
  NeonRingsShowcase,
  RealWorldExamples,
};

export default BaseBoxStories;
