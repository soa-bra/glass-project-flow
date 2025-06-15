
import React, { ReactNode } from 'react';
import { BaseCard } from './BaseCard';

interface GenericCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  variant?: 'glass' | 'gradient' | 'flat';
  color?: 'pinkblue' | 'orange' | 'crimson' | 'success' | 'warning' | 'info';
  neonRing?: 'success' | 'warning' | 'error' | 'info' | null;
  adminBoardStyle?: boolean; // جديد: لتنسيق البطاقات داخل لوحة الإدارة فقط
}

export const GenericCard: React.FC<GenericCardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = true,
  variant = 'glass',
  color = 'pinkblue',
  neonRing = null,
  adminBoardStyle = false
}) => {
  // الهوامش الداخلية الافتراضية أكثر راحة
  const paddingClasses = {
    sm: 'px-5 py-4',
    md: 'px-8 py-6',
    lg: 'px-12 py-8'
  };

  return (
    <BaseCard 
      variant={variant}
      color={color}
      neonRing={neonRing}
      className={`
        ${paddingClasses[padding]} 
        ${className} 
        ${hover && adminBoardStyle ? 'transition-all duration-200 hover:scale-105 hover:shadow-2xl' : ''}
      `}
      adminBoardStyle={adminBoardStyle}
    >
      {children}
    </BaseCard>
  );
};
