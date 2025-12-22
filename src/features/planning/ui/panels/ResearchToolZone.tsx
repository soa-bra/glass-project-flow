import React from 'react';
import { Search, BookOpen, Globe, FileSearch, Sparkles } from 'lucide-react';

/**
 * ResearchToolZone - أداة الريسيرش
 * قريباً: سيتم إضافة الخصائص الكاملة
 */
const ResearchToolZone: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 text-[hsl(var(--accent-blue))]">
        <Search size={24} />
        <h3 className="text-[16px] font-bold">أداة الريسيرش</h3>
      </div>

      {/* Coming Soon Banner */}
      <div className="p-4 bg-gradient-to-br from-[hsl(var(--accent-blue))]/10 to-[hsl(var(--accent-green))]/10 rounded-[18px] border border-[hsl(var(--accent-blue))]/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-[hsl(var(--accent-blue))]" />
          <span className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            قيد التطوير
          </span>
        </div>
        <p className="text-[12px] text-[hsl(var(--ink-60))] leading-relaxed">
          أداة البحث والريسيرش ستكون متاحة قريباً. سيتم تزويدها بخصائص متقدمة للبحث والتحليل.
        </p>
      </div>

      {/* Planned Features */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          الميزات المخططة
        </h4>
        <div className="space-y-2">
          {[
            { icon: <Globe size={16} />, label: 'البحث عبر الويب', desc: 'بحث ذكي في المصادر المتعددة' },
            { icon: <BookOpen size={16} />, label: 'تحليل المحتوى', desc: 'استخلاص الأفكار الرئيسية' },
            { icon: <FileSearch size={16} />, label: 'مقارنة المصادر', desc: 'تحليل مقارن للمعلومات' },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-[hsl(var(--panel))] rounded-[12px]"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[hsl(var(--ink-60))]">
                {feature.icon}
              </div>
              <div>
                <p className="text-[12px] font-medium text-[hsl(var(--ink))]">
                  {feature.label}
                </p>
                <p className="text-[10px] text-[hsl(var(--ink-60))]">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <p className="text-[11px] text-[hsl(var(--ink-60))] text-center">
          سيتم تفعيل هذه الأداة في التحديث القادم
        </p>
      </div>
    </div>
  );
};

export default ResearchToolZone;
