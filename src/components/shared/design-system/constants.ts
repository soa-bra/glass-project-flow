// ===============================
// SoaBra Unified Design System
// نظام التصميم الموحد الشامل لسوبرا
// ===============================

// Core spacing system
export const SPACING = {
  // Card spacing (استخدام موحد للكاردات)
  CARD_PADDING: 'p-6',
  CARD_PADDING_LG: 'p-9',
  CARD_MARGIN: 'mb-6',
  SECTION_MARGIN: 'my-[24px]',
  GRID_GAP: 'gap-6',
  
  // Content spacing
  CONTENT_PADDING: 'px-0',
  HEADER_PADDING: 'px-0 pt-0 mb-6',
  
  // Element spacing
  ELEMENT_SPACING: 'space-y-4',
  BUTTON_SPACING: 'gap-3',
} as const;

// Unified color system (متطابق مع لوحة الأحوال القانونية)
export const COLORS = {
  // Primary backgrounds (الخلفيات الأساسية)
  CARD_BACKGROUND: 'bg-[#f2ffff]',
  DASHBOARD_BACKGROUND: 'bg-[#dfecf2]',
  TRANSPARENT_BACKGROUND: 'bg-transparent',
  
  // Border system (نظام الحدود - للتوافق مع النظام القديم)
  BORDER_COLOR: 'border border-black/10',
  BORDER_PRIMARY: 'border border-black/10',
  BORDER_SECONDARY: 'border border-black/5',
  
  // Text colors (ألوان النصوص)
  PRIMARY_TEXT: 'text-black',
  SECONDARY_TEXT: 'text-black/70',
  MUTED_TEXT: 'text-black/50',
  
  // Status colors (ألوان الحالات - موحدة)
  STATUS_SUCCESS: 'bg-[#bdeed3] text-black',
  STATUS_WARNING: 'bg-[#fbe2aa] text-black', 
  STATUS_ERROR: 'bg-[#f1b5b9] text-black',
  STATUS_INFO: 'bg-[#a4e2f6] text-black',
  STATUS_PRIMARY: 'bg-[#d9d2fd] text-black',
  STATUS_NEUTRAL: 'bg-[#e9eff4] text-black',
  
  // Badge colors (للتوافق مع النظام القديم)
  BADGE_SUCCESS: 'bg-[#bdeed3] text-black',
  BADGE_WARNING: 'bg-[#fbe2aa] text-black',
  BADGE_ERROR: 'bg-[#f1b5b9] text-black',
  BADGE_INFO: 'bg-[#a4e2f6] text-black',
  BADGE_PRIMARY: 'bg-[#d9d2fd] text-black',
  
  // Button colors (ألوان الأزرار)
  BUTTON_PRIMARY: 'bg-black text-white hover:bg-black/90',
  BUTTON_SECONDARY: 'bg-transparent text-black border border-black/10 hover:bg-black/5',
  BUTTON_OUTLINE: 'bg-transparent text-black border border-black hover:bg-black hover:text-white',
  BUTTON_SUCCESS: 'bg-[#bdeed3] text-black hover:bg-[#a8e6c1]',
  BUTTON_WARNING: 'bg-[#fbe2aa] text-black hover:bg-[#f9d97c]',
  BUTTON_DANGER: 'bg-[#f1b5b9] text-black hover:bg-[#eda3a8]',
} as const;

export const TYPOGRAPHY = {
  // Font classes
  ARABIC_FONT: 'font-arabic',
  
  // Title sizes
  TITLE_SIZE: 'text-xl font-semibold',
  LARGE_TITLE_SIZE: 'text-large font-semibold',
  
  // Body text
  BODY_TEXT: 'text-sm font-medium',
  CAPTION_TEXT: 'text-xs font-normal',
} as const;

export const LAYOUT = {
  // Card styles
  CARD_ROUNDED: 'rounded-3xl',
  CARD_SHADOW: 'shadow-sm hover:shadow-md transition-shadow duration-300',
  
  // Grid layouts
  TWO_COLUMN_GRID: 'grid grid-cols-1 lg:grid-cols-2',
  FOUR_COLUMN_GRID: 'grid grid-cols-4',
  
  // Flex layouts
  FLEX_CENTER: 'flex items-center justify-center',
  FLEX_BETWEEN: 'flex items-center justify-between',
  FLEX_GAP: 'flex items-center gap-2',
  
  // Icon containers
  ICON_CONTAINER: 'w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center',
  ICON_SIZE: 'h-4 w-4 text-black',
} as const;

export const TRANSITIONS = {
  DEFAULT: 'transition-all duration-300',
  SHADOW: 'transition-shadow duration-300',
  HOVER: 'hover:scale-105 transition-transform duration-200',
} as const;

// Enhanced icon system (نظام الآيقونات الموحد)
export const ICONS = {
  // Sizes (أحجام الآيقونات)
  XS: 'h-3 w-3',
  SM: 'h-4 w-4',
  MD: 'h-5 w-5',
  LG: 'h-6 w-6',
  XL: 'h-8 w-8',
  
  // Icon containers (حاويات الآيقونات)
  CONTAINER_SM: 'w-6 h-6 rounded-full bg-transparent border border-black flex items-center justify-center',
  CONTAINER_MD: 'w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center',
  CONTAINER_LG: 'w-10 h-10 rounded-full bg-transparent border border-black flex items-center justify-center',
} as const;

// Button system (نظام الأزرار الموحد)
export const BUTTONS = {
  // Base classes
  BASE: 'rounded-full font-medium transition-all duration-300 font-arabic disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Sizes
  SM: 'px-3 py-1.5 text-sm',
  MD: 'px-4 py-2 text-base', 
  LG: 'px-6 py-3 text-lg',
  
  // Action button sizes
  ACTION_SM: 'w-8 h-8',
  ACTION_MD: 'w-10 h-10',
} as const;

// Unified component class builders
export const buildCardClasses = (customClasses = '') => 
  `${COLORS.CARD_BACKGROUND} ${SPACING.CARD_PADDING} ${LAYOUT.CARD_ROUNDED} ${COLORS.BORDER_COLOR} ${LAYOUT.CARD_SHADOW} ${customClasses}`.trim();

export const buildTitleClasses = (customClasses = '') => 
  `${TYPOGRAPHY.TITLE_SIZE} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} ${LAYOUT.FLEX_GAP} ${customClasses}`.trim();

export const buildBadgeClasses = (variant: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral' | 'default' = 'primary') => {
  const variantColors = {
    success: COLORS.STATUS_SUCCESS,
    warning: COLORS.STATUS_WARNING,
    error: COLORS.STATUS_ERROR,
    info: COLORS.STATUS_INFO,
    primary: COLORS.STATUS_PRIMARY,
    neutral: COLORS.STATUS_NEUTRAL,
    default: COLORS.STATUS_PRIMARY, // ربط 'default' بـ 'primary'
  };
  
  return `px-3 py-1 ${LAYOUT.CARD_ROUNDED} ${TYPOGRAPHY.CAPTION_TEXT} ${variantColors[variant]}`;
};

// Build button classes (بناء أصناف الأزرار)
export const buildButtonClasses = (variant: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
  const variantColors = {
    primary: COLORS.BUTTON_PRIMARY,
    secondary: COLORS.BUTTON_SECONDARY,
    outline: COLORS.BUTTON_OUTLINE,
    success: COLORS.BUTTON_SUCCESS,
    warning: COLORS.BUTTON_WARNING,
    danger: COLORS.BUTTON_DANGER,
  };
  
  const sizeClasses = {
    sm: BUTTONS.SM,
    md: BUTTONS.MD,
    lg: BUTTONS.LG,
  };
  
  return `${BUTTONS.BASE} ${variantColors[variant]} ${sizeClasses[size]}`;
};

// Build icon classes (بناء أصناف الآيقونات)
export const buildIconClasses = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md', withContainer: boolean = false) => {
  const sizeClasses = {
    xs: ICONS.XS,
    sm: ICONS.SM,
    md: ICONS.MD,
    lg: ICONS.LG,
    xl: ICONS.XL,
  };
  
  const containerClasses = {
    xs: '',
    sm: ICONS.CONTAINER_SM,
    md: ICONS.CONTAINER_MD,
    lg: ICONS.CONTAINER_LG,
    xl: ICONS.CONTAINER_LG,
  };
  
  return withContainer ? containerClasses[size] : sizeClasses[size];
};