import React from 'react';
interface BaseCardProps {
  variant?: 'glass' | 'gradient' | 'flat';
  color?: 'pinkblue' | 'orange' | 'crimson' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  neonRing?: 'success' | 'warning' | 'error' | 'info' | null;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
export const BaseCard: React.FC<BaseCardProps> = ({
  variant = 'glass',
  color = 'pinkblue',
  size = 'md',
  neonRing = null,
  onClick,
  header,
  footer,
  children,
  className = ''
}) => {
  const variantClass = variant === 'glass' ? 'advanced-glass-card hover-glow-enhanced' : variant === 'gradient' ? `grad-${color}` : `flat-${color}`;
  const sizeClass = `card-${size}`;
  const neonClass = neonRing ? `neon-ring-${neonRing}` : '';
  return;
};