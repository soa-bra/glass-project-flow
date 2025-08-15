// ===============================
// SoaBra Design System Constants
// نظام التصميم الموحد لسوبرا
// SoaBra Design System — Full Specification v1.0.0
// ===============================

export const DESIGN_TOKENS = {
  // Radius tokens
  RADIUS: {
    CARD_TOP: 'rounded-t-[24px]',
    CARD_BOTTOM: 'rounded-b-[6px]',
    CARD_FULL: 'rounded-[24px]',
    ICON_CONTAINER: 'rounded-full',
  },
  
  // Spacing tokens (4px base unit)
  SPACING: {
    XS: 'p-1', // 4px
    SM: 'p-2', // 8px
    MD: 'p-3', // 12px
    LG: 'p-4', // 16px
    XL: 'p-6', // 24px
  },
  
  // Colors from specification
  COLORS: {
    INK: '#000000',
    INK_60: 'rgba(11,15,18,0.6)',
    INK_30: 'rgba(11,15,18,0.3)',
    SURFACE: '#FFFFFF',
    SURFACE_MUTED: '#F6F7F8',
    BORDER: '#DADCE0',
    APP_BG: '#F6F8FA',
    PANEL_BG: '#FFFFFF',
    CARD_BG: '#FFFFFF',
    BOX_BG: '#FFFFFF',
  },
  
  // Elevation/Shadow
  ELEVATION: {
    CARD: 'shadow-[0_1px_1px_rgba(0,0,0,0.02),_0_8px_24px_rgba(0,0,0,0.06)]',
  },
} as const;

export const SPACING = {
  // Standard spacing values
  CARD_PADDING: 'p-6', // 24px - matches XL token
  SECTION_MARGIN: 'my-[24px]',
  CARD_MARGIN: 'mb-6',
  GRID_GAP: 'gap-6',
  
  // Specific paddings
  CONTENT_PADDING: 'px-0',
  HEADER_PADDING: 'px-0 pt-0 mb-6',
} as const;

export const COLORS = {
  // SoaBra Design System Colors
  APP_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.APP_BG}]`,
  PANEL_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.PANEL_BG}]`,
  CARD_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.CARD_BG}]`,
  BOX_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.BOX_BG}]`,
  TRANSPARENT_BACKGROUND: 'bg-transparent',
  
  // Border colors from design system
  BORDER_COLOR: `border border-[${DESIGN_TOKENS.COLORS.BORDER}]`,
  RING_BORDER: `border border-[${DESIGN_TOKENS.COLORS.BORDER}]`,
  
  // Text colors from design system
  PRIMARY_TEXT: `text-[${DESIGN_TOKENS.COLORS.INK}]`,
  SECONDARY_TEXT: `text-[${DESIGN_TOKENS.COLORS.INK_60}]`,
  MUTED_TEXT: `text-[${DESIGN_TOKENS.COLORS.INK_30}]`,
  
  // Badge colors (keeping original for brand consistency)
  BADGE_SUCCESS: 'bg-[#bdeed3] text-[#000000]',
  BADGE_WARNING: 'bg-[#fbe2aa] text-[#000000]',
  BADGE_ERROR: 'bg-[#f1b5b9] text-[#000000]',
  BADGE_INFO: 'bg-[#a4e2f6] text-[#000000]',
  BADGE_PRIMARY: 'bg-[#d9d2fd] text-[#000000]',
} as const;

export const TYPOGRAPHY = {
  // Font classes - IBM Plex Sans Arabic
  ARABIC_FONT: 'font-arabic',
  
  // Font weights from specification
  H1: 'text-2xl font-bold', // 700
  H2: 'text-xl font-semibold', // 600
  H3: 'text-lg font-semibold', // 600
  BODY: 'text-sm font-normal', // 400
  SMALL: 'text-xs font-normal', // 400
  
  // Legacy title sizes (deprecated)
  TITLE_SIZE: 'text-xl font-semibold',
  LARGE_TITLE_SIZE: 'text-large font-semibold',
  BODY_TEXT: 'text-sm font-medium',
  CAPTION_TEXT: 'text-xs font-normal',
} as const;

export const LAYOUT = {
  // Card styles from design system
  CARD_ROUNDED: DESIGN_TOKENS.RADIUS.CARD_FULL,
  CARD_SHADOW: DESIGN_TOKENS.ELEVATION.CARD,
  PANEL_ROUNDED: DESIGN_TOKENS.RADIUS.CARD_TOP + ' ' + DESIGN_TOKENS.RADIUS.CARD_BOTTOM,
  PANEL_SHADOW: DESIGN_TOKENS.ELEVATION.CARD,
  
  // Grid layouts
  TWO_COLUMN_GRID: 'grid grid-cols-1 lg:grid-cols-2',
  FOUR_COLUMN_GRID: 'grid grid-cols-4',
  
  // Flex layouts
  FLEX_CENTER: 'flex items-center justify-center',
  FLEX_BETWEEN: 'flex items-center justify-between',
  FLEX_GAP: 'flex items-center gap-2',
  
  // Icon containers from specification
  ICON_CONTAINER: `w-6 h-6 ${DESIGN_TOKENS.RADIUS.ICON_CONTAINER} bg-transparent border border-[${DESIGN_TOKENS.COLORS.INK}] border-[1.5px] flex items-center justify-center p-[6px]`, // 24px size
  ICON_CONTAINER_MD: `w-7 h-7 ${DESIGN_TOKENS.RADIUS.ICON_CONTAINER} bg-transparent border border-[${DESIGN_TOKENS.COLORS.INK}] border-[1.5px] flex items-center justify-center p-[6px]`, // 28px size
  ICON_CONTAINER_LG: `w-8 h-8 ${DESIGN_TOKENS.RADIUS.ICON_CONTAINER} bg-transparent border border-[${DESIGN_TOKENS.COLORS.INK}] border-[1.5px] flex items-center justify-center p-[6px]`, // 32px size
  ICON_SIZE: `h-3 w-3 text-[${DESIGN_TOKENS.COLORS.INK}] stroke-2`, // Geometric 2D style
} as const;

export const TRANSITIONS = {
  DEFAULT: 'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
  SHADOW: 'transition-shadow duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
} as const;

// Motion system from specification
export const MOTION = {
  REVEAL: {
    FADE_SLIDE_UP: 'animate-[fadeSlideUp_0.9s_cubic-bezier(0.22,1,0.36,1)]',
    Y_OFFSET: 24,
    DURATION: 0.9,
    EASE: [0.22, 1, 0.36, 1],
  },
  STAGGER: {
    GAP: 0.08,
    ITEM_DURATION: 0.9,
  },
} as const;

// Unified component class builders with design system tokens
export const buildCardClasses = (customClasses = '') => 
  `${COLORS.CARD_BACKGROUND} ${SPACING.CARD_PADDING} ${LAYOUT.CARD_ROUNDED} ${COLORS.RING_BORDER} ${LAYOUT.CARD_SHADOW} ${customClasses}`.trim();

export const buildPanelClasses = (customClasses = '') => 
  `${COLORS.PANEL_BACKGROUND} ${SPACING.CARD_PADDING} ${LAYOUT.PANEL_ROUNDED} ${COLORS.RING_BORDER} ${LAYOUT.PANEL_SHADOW} backdrop-blur-[2px] ${customClasses}`.trim();

export const buildBoxClasses = (customClasses = '') => 
  `${COLORS.BOX_BACKGROUND} ${DESIGN_TOKENS.SPACING.LG} ${LAYOUT.CARD_ROUNDED} ${COLORS.RING_BORDER} ${LAYOUT.CARD_SHADOW} ${customClasses}`.trim();

export const buildTitleClasses = (customClasses = '') => 
  `${TYPOGRAPHY.H3} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} ${LAYOUT.FLEX_GAP} ${customClasses}`.trim();

export const buildIconContainerClasses = (size: 'sm' | 'md' | 'lg' = 'sm') => {
  const sizeMap = {
    sm: LAYOUT.ICON_CONTAINER,
    md: LAYOUT.ICON_CONTAINER_MD,
    lg: LAYOUT.ICON_CONTAINER_LG,
  };
  return sizeMap[size];
};

export const buildBadgeClasses = (variant: 'success' | 'warning' | 'error' | 'info' | 'primary' = 'primary') => {
  const variantColors = {
    success: COLORS.BADGE_SUCCESS,
    warning: COLORS.BADGE_WARNING,
    error: COLORS.BADGE_ERROR,
    info: COLORS.BADGE_INFO,
    primary: COLORS.BADGE_PRIMARY,
  };
  
  return `px-3 py-1 ${LAYOUT.CARD_ROUNDED} ${TYPOGRAPHY.SMALL} ${variantColors[variant]}`;
};

// Scroll indicator from specification
export const SCROLL_INDICATOR = {
  CAPSULE: 'w-[6px] h-[20px] rounded-[3px]',
  DOT: 'w-[6px] h-[6px] rounded-full',
  DOT_GAP: 'gap-[8px]',
} as const;