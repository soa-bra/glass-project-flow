
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface GlassWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean;          // تفعيل تدرّج لوني (مثل البطاقة البنفسجية في المرجع)
}

export default function GlassWidget({
  accent,
  className,
  children,
  ...rest
}: PropsWithChildren<GlassWidgetProps>) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-[22px] p-6',
        'border border-white/5',
        'backdrop-blur-[12px]',
        'shadow-[0_8px_20px_rgba(0,0,0,0.45)]',
        'before:absolute before:inset-0 before:rounded-[21px]',
        'before:pointer-events-none',
        accent
          ? 'before:bg-[linear-gradient(135deg,#9270ff,#ff89e7)] before:opacity-80'
          : 'before:bg-[rgba(22,22,25,0.35)] before:opacity-90',
        className
      )}
    >
      {/* حافة زجاجية داخلية */}
      <div className="absolute inset-0 rounded-[22px] pointer-events-none ring-1 ring-white/5" />
      {/* المحتوى */}
      <div className="relative z-10 text-gray-100">{children}</div>
    </div>
  );
}
