
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
  adminBoardStyle?: boolean;
  onClick?: () => void; // <--- أضفنا الخاصية هنا
}

export const GenericCard: React.FC<GenericCardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = true,
  variant = 'glass',
  color = 'pinkblue',
  neonRing = null,
  adminBoardStyle = false,
  onClick // <--- وتمريرها هنا
}) => {
  // تحديث هوامش البطاقة لجعلها أكثر راحة خاصة في اللوحة الرئيسية
  const paddingClasses = {
    sm: 'px-7 py-5 md:px-9 md:py-7',
    md: 'px-10 py-7 md:px-12 md:py-9',
    lg: 'px-14 py-10 md:px-16 md:py-12'
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
      onClick={onClick} // <--- تمرير الخاصية لمكون BaseCard
    >
      {children}
    </BaseCard>
  );
};
