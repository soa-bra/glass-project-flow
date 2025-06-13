
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface GlassWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean;          // تفعيل تدرّج لوني (مثل البطاقة البنفسجية في المرجع)
  glowing?: boolean;         // تفعيل توهج ملون
}

export default function GlassWidget({
  accent,
  glowing,
  className,
  children,
  ...rest
}: PropsWithChildren<GlassWidgetProps>) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-[22px] p-6',
        'border border-white/10',
        'backdrop-blur-[20px]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        'before:absolute before:inset-0 before:rounded-[22px]',
        'before:pointer-events-none',
        // الخلفية الأساسية - لون داكن شبه شفاف
        !accent && 'before:bg-[rgba(22,22,25,0.85)]',
        // الخلفية المُلونة للبطائق المميزة
        accent && 'before:bg-[linear-gradient(135deg,rgba(147,112,255,0.8),rgba(255,137,231,0.8))]',
        // التوهج للبطاقات الخاصة
        glowing && 'shadow-[0_0_30px_rgba(147,112,255,0.3)]',
        className
      )}
    >
      {/* حافة زجاجية داخلية محسنة */}
      <div className="absolute inset-0 rounded-[22px] pointer-events-none ring-1 ring-white/10" />
      
      {/* انعكاس علوي للتأثير الزجاجي */}
      <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-[22px] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
      
      {/* المحتوى */}
      <div className="relative z-10 text-white">{children}</div>
    </div>
  );
}
