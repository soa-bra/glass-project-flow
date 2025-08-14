// ===============================
// SoaBra Design System Constants v1.0.0
// نظام التصميم الموحد لسوبرا
// ===============================

export const DESIGN_TOKENS = {
  // Typography scale (exact pixel values from spec)
  TYPOGRAPHY: {
    DISPLAY_L: 'text-display-l font-arabic', // 40px/48px/700
    DISPLAY_M: 'text-display-m font-arabic', // 32px/40px/700
    TITLE: 'text-title font-arabic',         // 20px/28px/700
    SUBTITLE: 'text-subtitle font-arabic',   // 16px/24px/600
    BODY: 'text-body font-arabic',           // 14px/22px/400
    LABEL: 'text-label font-arabic',         // 12px/18px/500
  },

  // Color palette (from design tokens)
  COLORS: {
    INK: 'text-soabra-ink',           // #0B0F12
    INK_80: 'text-soabra-ink-80',     // rgba(11,15,18,0.80)
    INK_60: 'text-soabra-ink-60',     // rgba(11,15,18,0.60)
    INK_30: 'text-soabra-ink-30',     // rgba(11,15,18,0.30)
    
    SURFACE: 'bg-soabra-surface',     // #FFFFFF
    PANEL: 'bg-soabra-panel',         // #d9e7ed
    BORDER: 'border-soabra-border',   // #DADCE0
    
    ACCENT_GREEN: 'bg-soabra-accent-green',   // #3DBE8B
    ACCENT_YELLOW: 'bg-soabra-accent-yellow', // #F6C445
    ACCENT_RED: 'bg-soabra-accent-red',       // #E5564D
    ACCENT_BLUE: 'bg-soabra-accent-blue',     // #3DA8F5
  },

  // Border radius (from design tokens)
  RADIUS: {
    CARD_TOP: 'rounded-t-card-top',       // 24px
    CARD_BOTTOM: 'rounded-b-card-bottom', // 6px
    CARD_FULL: 'rounded-card-top rounded-card-bottom',
    PANEL: 'rounded-panel',               // 18px
    CHIP: 'rounded-chip',                 // 9999px (full)
    TOOLTIP: 'rounded-tooltip',           // 10px
  },

  // Spacing (from design tokens)
  SPACING: {
    XS: 'p-1',   // 4px
    SM: 'p-2',   // 8px
    MD: 'p-3',   // 12px
    LG: 'p-4',   // 16px
    XL: 'p-6',   // 24px
    XXL: 'p-8',  // 32px
    XXXL: 'p-10', // 40px
  },

  // Elevation/Shadows (from design tokens)
  ELEVATION: {
    CARD: 'shadow-[0_1px_1px_rgba(0,0,0,0.03),_0_8px_24px_rgba(0,0,0,0.06)]',
    GLASS: 'shadow-[0_1px_1px_rgba(0,0,0,0.04),_0_12px_28px_rgba(0,0,0,0.10)]',
    TOOLTIP: 'shadow-[0_8px_24px_rgba(0,0,0,0.24)]',
  },

  // Icon system (from design tokens)
  ICONS: {
    CONTAINER_24: 'w-[24px] h-[24px] rounded-full border-[1.5px] border-black bg-transparent p-[6px] flex items-center justify-center',
    CONTAINER_28: 'w-[28px] h-[28px] rounded-full border-[1.5px] border-black bg-transparent p-[6px] flex items-center justify-center',
    CONTAINER_32: 'w-[32px] h-[32px] rounded-full border-[1.5px] border-black bg-transparent p-[6px] flex items-center justify-center',
    GLYPH: 'stroke-[2px] stroke-black stroke-linecap-round stroke-linejoin-round fill-none',
    HIT_AREA: 'min-w-[40px] min-h-[40px]',
  },
} as const;

// Component builders using design tokens
export const buildCardClasses = (customClasses = '') => 
  `${DESIGN_TOKENS.COLORS.SURFACE} ${DESIGN_TOKENS.SPACING.XL} ${DESIGN_TOKENS.RADIUS.CARD_FULL} ring-1 ${DESIGN_TOKENS.COLORS.BORDER} ${DESIGN_TOKENS.ELEVATION.CARD} ${customClasses}`.trim();

export const buildPanelClasses = (customClasses = '') => 
  `${DESIGN_TOKENS.COLORS.PANEL} ${DESIGN_TOKENS.SPACING.XL} ${DESIGN_TOKENS.RADIUS.PANEL} ring-1 ${DESIGN_TOKENS.COLORS.BORDER} ${DESIGN_TOKENS.ELEVATION.CARD} ${customClasses}`.trim();

export const buildIconContainerClasses = (size: 'sm' | 'md' | 'lg' = 'sm') => {
  const sizeMap = {
    sm: DESIGN_TOKENS.ICONS.CONTAINER_24,
    md: DESIGN_TOKENS.ICONS.CONTAINER_28,
    lg: DESIGN_TOKENS.ICONS.CONTAINER_32,
  };
  return `${sizeMap[size]} ${DESIGN_TOKENS.ICONS.HIT_AREA}`;
};

export const buildTooltipClasses = (customClasses = '') =>
  `bg-soabra-ink text-soabra-white ${DESIGN_TOKENS.RADIUS.TOOLTIP} ${DESIGN_TOKENS.ELEVATION.TOOLTIP} px-3 py-2 ${DESIGN_TOKENS.TYPOGRAPHY.LABEL} ${customClasses}`.trim();

// Notification system (from design tokens)
export const NOTIFICATION_COLORS = {
  SUCCESS: 'border-l-[3px] border-l-soabra-accent-green',
  WARNING: 'border-l-[3px] border-l-soabra-accent-yellow', 
  ERROR: 'border-l-[3px] border-l-soabra-accent-red',
  INFO: 'border-l-[3px] border-l-soabra-accent-blue',
} as const;

export const buildNotificationClasses = (type: keyof typeof NOTIFICATION_COLORS, customClasses = '') =>
  `${DESIGN_TOKENS.COLORS.SURFACE} ${DESIGN_TOKENS.RADIUS.PANEL} ring-1 ${DESIGN_TOKENS.COLORS.BORDER} ${DESIGN_TOKENS.ELEVATION.CARD} p-4 gap-3 ${NOTIFICATION_COLORS[type]} ${customClasses}`.trim();

// KPI Cards (from design tokens)
export const KPI_STYLES = {
  NUMBER: 'text-[44px] leading-none font-bold',
  UNIT: 'text-[14px] leading-none font-normal',
  ICON_CIRCLE: 'w-[36px] h-[36px] rounded-full border-[1.5px] border-black bg-transparent flex items-center justify-center',
  GAP: 'gap-[8px]',
} as const;

// Progress Tape (from design tokens)
export const PROGRESS_TAPE = {
  TICK: 'w-[6px] h-full rounded-[3px]',
  TICK_GAP: 'gap-[6px]',
  DONE_COLOR: 'bg-[rgba(61,190,139,0.9)]',
  TODO_COLOR: 'bg-[rgba(11,15,18,0.10)]',
  MILESTONE: 'w-[36px] h-[36px] rounded-full bg-[rgba(217,231,237,0.95)] ring-1 ring-soabra-border flex items-center justify-center',
} as const;

// Financial Overview (from design tokens)
export const FINANCIAL_OVERVIEW = {
  TICK_COUNT: 72,
  TICK: 'w-[6px] h-full rounded-[3px]',
  TICK_GAP: 'gap-[6px]',
  PROJECT_MODE: {
    BASE_COLOR: 'bg-[rgba(11,15,18,0.08)]',
    FILL_COLOR: 'bg-[rgba(11,15,18,0.55)]',
    BG_GREEN: 'bg-[#BFE7D5]',
    BG_YELLOW: 'bg-[#FFF4CC]', 
    BG_RED: 'bg-[#FFE1E0]',
  },
  OPS_MODE: {
    INCOME_COLOR: 'bg-soabra-accent-green',
    EXPENSE_COLOR: 'bg-soabra-accent-red',
    BG_GREEN: 'bg-[#BFE7D5]',
    BG_RED: 'bg-[#FFE1E0]',
  },
} as const;

// Scroll Indicator (from design tokens)
export const SCROLL_INDICATOR = {
  CAPSULE: 'w-[6px] h-[20px] rounded-[3px] bg-soabra-ink opacity-40',
  CAPSULE_ACTIVE: 'w-[6px] h-[20px] rounded-[3px] bg-soabra-ink opacity-100',
  DOT: 'w-[6px] h-[6px] rounded-full bg-soabra-ink-30',
  DOT_GAP: 'gap-[8px]',
} as const;

// Motion system (from design tokens)
export const MOTION = {
  REVEAL: 'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
  STAGGER_DELAY: 80, // 0.08s in milliseconds
} as const;

// Glass system (from design tokens)
export const GLASS = {
  MODAL: 'bg-[rgba(255,255,255,0.65)] backdrop-blur-[18px] border border-[rgba(255,255,255,0.6)]',
  BACKDROP: 'bg-[rgba(255,255,255,0.30)]',
  RADIUS: 'rounded-[18px]',
  PADDING: 'p-6',
  SHADOW: DESIGN_TOKENS.ELEVATION.GLASS,
} as const;

// Charts system (from design tokens)
export const CHARTS = {
  GRID_COLOR: 'rgba(11,15,18,0.08)',
  AXIS_COLOR: 'rgba(11,15,18,0.30)',
  STROKE_WIDTH: 2,
  DOT_SIZE: 6,
  BAR_RADIUS: 8,
  POINTER_LINE: 'stroke-[rgba(11,15,18,0.45)] stroke-[2px] stroke-dasharray-[2_4]',
} as const;

// Legacy compatibility (deprecated - will be removed)
export const COLORS = {
  // Badge colors
  BADGE_SUCCESS: 'bg-[#bdeed3] text-[#0B0F12]',
  BADGE_WARNING: 'bg-[#fbe2aa] text-[#0B0F12]',
  BADGE_ERROR: 'bg-[#f1b5b9] text-[#0B0F12]',
  BADGE_INFO: 'bg-[#a4e2f6] text-[#0B0F12]',
  BADGE_PRIMARY: 'bg-[#d9d2fd] text-[#0B0F12]',
  
  // Background colors
  CARD_BACKGROUND: 'bg-soabra-surface',
  PANEL_BACKGROUND: 'bg-soabra-panel', 
  TRANSPARENT_BACKGROUND: 'bg-transparent',
  
  // Border colors
  BORDER_COLOR: 'border border-soabra-border',
  RING_BORDER: 'ring-1 ring-soabra-border',
  
  // Text colors
  PRIMARY_TEXT: 'text-soabra-ink',
  SECONDARY_TEXT: 'text-soabra-ink-60',
  MUTED_TEXT: 'text-soabra-ink-30',
} as const;

export const TYPOGRAPHY = {
  ARABIC_FONT: 'font-arabic',
  
  // Typography sizes
  H1: 'text-display-l font-bold',
  H2: 'text-display-m font-bold', 
  H3: 'text-title font-bold',
  BODY: 'text-body font-normal',
  SMALL: 'text-label font-normal',
  
  // Legacy sizes (deprecated)
  TITLE_SIZE: 'text-title font-bold',
  LARGE_TITLE_SIZE: 'text-display-m font-bold',
  BODY_TEXT: 'text-body font-normal',
  CAPTION_TEXT: 'text-label font-normal',
} as const;

export const SPACING = {
  // Card spacing
  CARD_PADDING: 'p-6',
  SECTION_MARGIN: 'my-6',
  CARD_MARGIN: 'mb-6', 
  GRID_GAP: 'gap-6',
  
  // Content spacing
  CONTENT_PADDING: 'px-0',
  HEADER_PADDING: 'px-0 pt-0 mb-6',
} as const;

export const LAYOUT = {
  // Card styles
  CARD_ROUNDED: 'rounded-t-card-top rounded-b-card-bottom',
  CARD_SHADOW: 'shadow-[0_1px_1px_rgba(0,0,0,0.03),_0_8px_24px_rgba(0,0,0,0.06)]',
  PANEL_ROUNDED: 'rounded-panel',
  PANEL_SHADOW: 'shadow-[0_1px_1px_rgba(0,0,0,0.03),_0_8px_24px_rgba(0,0,0,0.06)]',
  
  // Grid layouts
  TWO_COLUMN_GRID: 'grid grid-cols-1 lg:grid-cols-2',
  FOUR_COLUMN_GRID: 'grid grid-cols-4',
  
  // Flex layouts
  FLEX_CENTER: 'flex items-center justify-center',
  FLEX_BETWEEN: 'flex items-center justify-between',
  FLEX_GAP: 'flex items-center gap-2',
  
  // Icon containers
  ICON_CONTAINER: 'w-[24px] h-[24px] rounded-full border-[1.5px] border-black bg-transparent p-[6px] flex items-center justify-center',
  ICON_CONTAINER_MD: 'w-[28px] h-[28px] rounded-full border-[1.5px] border-black bg-transparent p-[6px] flex items-center justify-center',
  ICON_CONTAINER_LG: 'w-[32px] h-[32px] rounded-full border-[1.5px] border-black bg-transparent p-[6px] flex items-center justify-center',
  ICON_SIZE: 'w-4 h-4 stroke-[2px] stroke-black',
} as const;

export const buildBadgeClasses = (variant: 'success' | 'warning' | 'error' | 'info' | 'primary' = 'primary') => {
  const variantColors = {
    success: COLORS.BADGE_SUCCESS,
    warning: COLORS.BADGE_WARNING,
    error: COLORS.BADGE_ERROR,
    info: COLORS.BADGE_INFO,
    primary: COLORS.BADGE_PRIMARY,
  };
  
  return `px-3 py-1 ${DESIGN_TOKENS.RADIUS.CHIP} ${DESIGN_TOKENS.TYPOGRAPHY.LABEL} ${variantColors[variant]}`;
};

// Legacy builders (deprecated)
export const buildTitleClasses = (customClasses = '') => 
  `${TYPOGRAPHY.H3} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} flex items-center gap-2 ${customClasses}`.trim();