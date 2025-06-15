
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
}

export const GenericCard: React.FC<GenericCardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = true,
  variant = 'glass',
  color = 'pinkblue',
  neonRing = null
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <BaseCard 
      variant={variant}
      color={color}
      neonRing={neonRing}
      className={`${paddingClasses[padding]} ${className}`}
    >
      {children}
    </BaseCard>
  );
};
