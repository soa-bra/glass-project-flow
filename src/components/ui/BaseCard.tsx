
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
  adminBoardStyle?: boolean; // جديد: لتفعيل نمط لوحة الإدارة فقط
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
  className = '',
  adminBoardStyle = false // جديد: لوحة الإدارة فقط
}) => {
  // الألوان الموحدة للوحة الإدارة
  const palette = {
    blue: '#add8ea',
    green: '#bdeed3',
    red: '#fcd8ce',
    yellow: '#f9e2a9',
    gray: '#dfecf2',
    violet: '#d9d2fd',
    white: '#fff',
  };

  // Glass effect/gradient/background:
  const adminClasses = adminBoardStyle
    ? `border border-white/50 rounded-3xl shadow-xl bg-white/40 backdrop-blur-[20px] glass-enhanced`
    : '';
  // لهوية البطاقة المالية:
  const adminBgColor =
    adminBoardStyle && color === 'success'
      ? 'bg-[#bdeed5]'
      : adminBoardStyle && color === 'crimson'
      ? 'bg-[#fcd8ce]'
      : '';

  // Variant:
  const variantClass =
    variant === 'glass'
      ? `${adminClasses} ${adminBgColor} ${!adminBoardStyle ? 'advanced-glass-card hover-glow-enhanced' : ''}`
      : variant === 'gradient'
      ? `grad-${color}`
      : `flat-${color}`;

  const sizeClass = `card-${size}`;
  const neonClass = neonRing ? `neon-ring-${neonRing}` : '';

  return (
    <div
      className={`${variantClass} ${sizeClass} ${neonClass} ${className} font-arabic`}
      onClick={onClick}
      style={adminBoardStyle ? {
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: 'rtl',
        boxShadow: '0 8px 40px 0 rgba(70,90,160,.08), 0 2px 16px 0 rgba(53,90,202,.03)',
        background: variant === 'glass'
          ? 'rgba(255,255,255,0.37)'
          : undefined,
        backdropFilter: 'blur(20px) saturate(140%)',
      } : undefined}
    >
      {header && <div className="card-header mb-2">{header}</div>}
      <div className="card-content">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
