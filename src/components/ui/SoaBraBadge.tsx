
import React from 'react';

interface SoaBraBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const SoaBraBadge = ({ children, className = '' }: SoaBraBadgeProps) => (
  <span className={`glass-card h-[34px] px-3 flex items-center text-[14px] text-[#444] rounded-2xl ${className}`}>
    {children}
  </span>
);
