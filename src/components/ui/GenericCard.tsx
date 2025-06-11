
import React, { ReactNode } from 'react';

interface GenericCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const GenericCard: React.FC<GenericCardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = true
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`
      relative rounded-3xl backdrop-blur-xl border border-white/20
      bg-gradient-to-br from-white/25 via-white/15 to-white/10
      shadow-2xl shadow-black/5
      ${hover ? 'hover:bg-white/30 hover:border-white/30 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300 ease-out' : ''}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {/* خلفية منحنية داخلية للتأثير الإضافي */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
      
      {/* المحتوى */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
