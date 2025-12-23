/**
 * BaseListItem Stories - قصص مكون عنصر القائمة
 */
import React, { useState } from 'react';
import { BaseListItem } from '@/components/shared/BaseListItem';
import { CheckCircle, AlertCircle, Clock, User, FileText, Star } from 'lucide-react';

export default {
  title: 'Components/BaseListItem',
  component: BaseListItem,
};

// Interactive Playground
export const Playground = () => {
  const [selectedVariant, setSelectedVariant] = useState<'success' | 'warning' | 'error' | 'info' | 'default'>('success');
  
  return (
    <div className="p-8 space-y-6 font-arabic" dir="rtl">
      <h2 className="text-2xl font-bold text-ink">🎮 Interactive Playground</h2>
      
      <div className="flex gap-2 flex-wrap">
        {(['success', 'warning', 'error', 'info', 'default'] as const).map((variant) => (
          <button
            key={variant}
            onClick={() => setSelectedVariant(variant)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedVariant === variant ? 'bg-ink text-white' : 'bg-panel text-ink'
            }`}
          >
            {variant}
          </button>
        ))}
      </div>
      
      <BaseListItem
        icon={<CheckCircle className="w-5 h-5" />}
        badge={{ text: 'مكتمل', variant: selectedVariant }}
      >
        مهمة تجريبية - اختر نوع الشارة من الأزرار أعلاه
      </BaseListItem>
    </div>
  );
};

// All Variants
export const AllVariants = () => (
  <div className="p-8 space-y-4 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">📋 جميع أنواع الشارات</h2>
    
    <BaseListItem
      icon={<CheckCircle className="w-5 h-5 text-accent-green" />}
      badge={{ text: 'مكتمل', variant: 'success' }}
    >
      مهمة مكتملة بنجاح
    </BaseListItem>
    
    <BaseListItem
      icon={<AlertCircle className="w-5 h-5 text-accent-yellow" />}
      badge={{ text: 'تحذير', variant: 'warning' }}
    >
      مهمة تحتاج مراجعة
    </BaseListItem>
    
    <BaseListItem
      icon={<AlertCircle className="w-5 h-5 text-accent-red" />}
      badge={{ text: 'خطأ', variant: 'error' }}
    >
      مهمة فاشلة
    </BaseListItem>
    
    <BaseListItem
      icon={<Clock className="w-5 h-5 text-accent-blue" />}
      badge={{ text: 'معلومات', variant: 'info' }}
    >
      مهمة قيد الانتظار
    </BaseListItem>
    
    <BaseListItem
      icon={<Star className="w-5 h-5" />}
      badge={{ text: 'افتراضي', variant: 'default' }}
    >
      مهمة عادية
    </BaseListItem>
  </div>
);

// Without Badge
export const WithoutBadge = () => (
  <div className="p-8 space-y-4 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">📝 بدون شارة</h2>
    
    <BaseListItem icon={<User className="w-5 h-5" />}>
      أحمد محمد - مدير المشروع
    </BaseListItem>
    
    <BaseListItem icon={<FileText className="w-5 h-5" />}>
      تقرير المبيعات الشهري
    </BaseListItem>
  </div>
);

// Without Icon
export const WithoutIcon = () => (
  <div className="p-8 space-y-4 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">📄 بدون أيقونة</h2>
    
    <BaseListItem badge={{ text: 'جديد', variant: 'info' }}>
      عنصر قائمة بسيط مع شارة
    </BaseListItem>
    
    <BaseListItem>
      عنصر قائمة بسيط بدون أيقونة أو شارة
    </BaseListItem>
  </div>
);

// Real World Examples
export const RealWorldExamples = () => (
  <div className="p-8 space-y-6 font-arabic" dir="rtl">
    <h2 className="text-2xl font-bold text-ink mb-6">🌍 أمثلة واقعية</h2>
    
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-ink-80">قائمة المهام</h3>
      <BaseListItem
        icon={<CheckCircle className="w-5 h-5 text-accent-green" />}
        badge={{ text: 'مكتمل', variant: 'success' }}
      >
        تصميم واجهة المستخدم
      </BaseListItem>
      <BaseListItem
        icon={<Clock className="w-5 h-5 text-accent-blue" />}
        badge={{ text: 'قيد التنفيذ', variant: 'info' }}
      >
        تطوير API الخلفية
      </BaseListItem>
      <BaseListItem
        icon={<AlertCircle className="w-5 h-5 text-accent-yellow" />}
        badge={{ text: 'متأخر', variant: 'warning' }}
      >
        اختبار الوحدات
      </BaseListItem>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-ink-80">قائمة الموظفين</h3>
      <BaseListItem
        icon={<User className="w-5 h-5" />}
        badge={{ text: 'مدير', variant: 'default' }}
      >
        سارة أحمد
      </BaseListItem>
      <BaseListItem
        icon={<User className="w-5 h-5" />}
        badge={{ text: 'مطور', variant: 'info' }}
      >
        محمد علي
      </BaseListItem>
    </div>
  </div>
);
