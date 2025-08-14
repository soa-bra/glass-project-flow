import React from 'react';
import { cn } from '@/lib/utils';

interface SoaTypographyProps {
  children: React.ReactNode;
  variant?: 'display-l' | 'display-m' | 'title' | 'subtitle' | 'body' | 'label';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export const SoaTypography: React.FC<SoaTypographyProps> = ({
  children,
  variant = 'body',
  className = '',
  as
}) => {
  const variantClasses = {
    'display-l': 'text-display-l font-bold text-soabra-ink font-arabic',  // 40px/48px/700
    'display-m': 'text-display-m font-bold text-soabra-ink font-arabic',  // 32px/40px/700
    'title': 'text-title font-bold text-soabra-ink font-arabic',          // 20px/28px/700
    'subtitle': 'text-subtitle font-semibold text-soabra-ink font-arabic', // 16px/24px/600
    'body': 'text-body font-normal text-soabra-ink font-arabic',          // 14px/22px/400
    'label': 'text-label font-medium text-soabra-ink font-arabic',        // 12px/18px/500
  };

  const defaultElement = {
    'display-l': 'h1',
    'display-m': 'h2',
    'title': 'h3',
    'subtitle': 'h4',
    'body': 'p',
    'label': 'span',
  } as const;

  const Component = as || defaultElement[variant];

  return React.createElement(
    Component,
    { 
      className: cn(variantClasses[variant], className) 
    },
    children
  );
};