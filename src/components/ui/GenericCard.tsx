
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
    <div 
      className={`
        glass-enhanced rounded-[40px] 
        ${paddingClasses[padding]}
        ${hover ? 'transition-all duration-200 ease-in-out hover:bg-white/50' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
