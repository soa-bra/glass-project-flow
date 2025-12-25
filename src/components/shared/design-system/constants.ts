// ===============================
// SoaBra Design System Constants
// نظام التصميم الموحد لسوبرا
// SoaBra Design System — Full Specification v1.0.0
// ===============================

// Import new token system
import { 
  DS_COLORS, 
  DS_SPACING, 
  DS_RADIUS, 
  DS_ELEVATION, 
  DS_MOTION, 
  DS_Z_INDEX,
  DS_TYPOGRAPHY,
  OC_PROJECT,
  OC_TASK,
  OC_STATUS,
  OC_PRIORITY,
  OC_CANVAS,
  OC_CHART,
  OC_FINANCIAL,
  OC_PROGRESS
} from '@/design-system';

// Re-export tokens for backward compatibility
export { 
  DS_COLORS, 
  DS_SPACING, 
  DS_RADIUS, 
  DS_ELEVATION, 
  DS_MOTION, 
  DS_Z_INDEX,
  OC_PROJECT,
  OC_TASK,
  OC_STATUS,
  OC_PRIORITY,
  OC_CANVAS,
  OC_CHART,
  OC_FINANCIAL,
  OC_PROGRESS
} from '@/design-system';

export const DESIGN_TOKENS = {
  // Radius tokens - mapped to new DS tokens
  RADIUS: {
    CARD_TOP: 'rounded-t-[24px]',
    CARD_BOTTOM: 'rounded-b-[6px]',
    CARD_FULL: 'rounded-[24px]',
    ICON_CONTAINER: 'rounded-full',
    // New DS references
    GLOBAL: DS_RADIUS['3XL'],
    SM: DS_RADIUS.SM,
    MD: DS_RADIUS.MD,
    LG: DS_RADIUS.LG,
  },
  
  // Spacing tokens (4px base unit) - mapped to new DS tokens
  SPACING: {
    XS: 'p-1', // 4px
    SM: 'p-2', // 8px
    MD: 'p-3', // 12px
    LG: 'p-4', // 16px
    XL: 'p-6', // 24px
    // New DS references
    ...DS_SPACING,
  },
  
  // Colors from specification - Updated to use new tokens
  COLORS: {
    // DS Colors
    INK: DS_COLORS.INK,
    INK_60: DS_COLORS.INK_60,
    INK_30: DS_COLORS.INK_30,
    SURFACE: DS_COLORS.SURFACE,
    SURFACE_MUTED: DS_COLORS.SURFACE_MUTED,
    BORDER: DS_COLORS.BORDER,
    
    // Main background colors - using OC tokens
    PANEL_BG: '#F8F9FA',
    BOX_BG: '#FFFFFF',
    
    // Project layouts - using OC tokens
    PROJECT_COLUMN_BG: '#ebeff2',
    PROJECT_CARD_BG: '#F1F5F9',
    PROJECT_CARD_CAPSULE_BG: '#FFFFFF',
    
    // Task layouts - using OC tokens
    TASK_LIST_BOX_BG: '#eaecef',
    TASK_CARD_BG: '#f8f9fa',
    TASK_CARD_CAPSULE_BG: '#FFFFFF',
    
    // Financial status backgrounds - using OC tokens
    FINANCIAL_PROFIT_BG: '#96D8D0',
    FINANCIAL_LOSS_BG: '#F1B5B9',
    
    // Additional sidebar background
    ADDITIONAL_SIDEBAR_BG: '#ebeff2',
    
    // Project card elements
    PROJECT_CARD_DAYS_CIRCLE_BG: 'transparent',
    PROJECT_CARD_TASKS_CIRCLE_BG: '#d1e1ea',
    
    // Brand palette from DS
    MINT: DS_COLORS.MINT,
    SKY: DS_COLORS.SKY,
    LILAC: DS_COLORS.LILAC,
    ROSE: DS_COLORS.ROSE,
    AMBER: DS_COLORS.AMBER,
  },
  
  // Elevation/Shadow - using DS tokens
  ELEVATION: {
    CARD: DS_ELEVATION[2],
    MODAL: DS_ELEVATION.MODAL,
    SOFT: DS_ELEVATION[1],
    STRONG: DS_ELEVATION[3],
  },
  
  // Z-Index - using DS tokens
  Z_INDEX: {
    ...DS_Z_INDEX,
  },
  
  // Motion - using DS tokens
  MOTION: {
    ...DS_MOTION,
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
  // SoaBra Design System Colors - Using new token system
  PANEL_BACKGROUND: `bg-[var(--ds-color-surface-muted)]`,
  BOX_BACKGROUND: `bg-[var(--ds-color-surface)]`,
  
  // Project layout backgrounds - using OC CSS variables
  PROJECT_COLUMN_BACKGROUND: `bg-[var(--oc-project-column-bg)]`,
  PROJECT_CARD_BACKGROUND: `bg-[var(--oc-project-card-bg)] border border-[var(--ds-color-border)]`,
  PROJECT_CARD_CAPSULE_BACKGROUND: `bg-[var(--oc-project-capsule-bg)] border border-[var(--ds-color-border)]`,
  
  // Task layout backgrounds - using OC CSS variables
  TASK_LIST_BOX_BACKGROUND: `bg-[var(--oc-task-list-bg)]`,
  TASK_CARD_BACKGROUND: `bg-[var(--oc-task-card-bg)] border border-[var(--ds-color-border)]`,
  TASK_CARD_CAPSULE_BACKGROUND: `bg-[var(--ds-color-surface)] border border-[var(--ds-color-border)]`,
  
  // Financial status backgrounds - using OC CSS variables
  FINANCIAL_PROFIT_BACKGROUND: `bg-[var(--oc-financial-profit-bg)]`,
  FINANCIAL_LOSS_BACKGROUND: `bg-[var(--oc-financial-loss-bg)]`,
  
  TRANSPARENT_BACKGROUND: 'bg-transparent',
  
  // Legacy compatibility
  CARD_BACKGROUND: `bg-[var(--ds-color-surface)]`,
  
  // Border colors from design system
  BORDER_COLOR: `border border-[var(--ds-color-border)]`,
  RING_BORDER: `border border-[var(--ds-color-border)]`,
  
  // Text colors from design system
  PRIMARY_TEXT: `text-[var(--ds-color-ink)]`,
  SECONDARY_TEXT: `text-[var(--ds-color-ink-60)]`,
  MUTED_TEXT: `text-[var(--ds-color-ink-30)]`,
  
  // Badge colors - using OC status/priority tokens
  BADGE_SUCCESS: 'bg-[var(--oc-status-on-plan)] text-[var(--ds-color-ink)]',
  BADGE_WARNING: 'bg-[var(--oc-status-delayed)] text-[var(--ds-color-ink)]',
  BADGE_ERROR: 'bg-[var(--oc-status-stopped)] text-[var(--ds-color-ink)]',
  BADGE_INFO: 'bg-[var(--oc-status-in-preparation)] text-[var(--ds-color-ink)]',
  BADGE_PRIMARY: 'bg-[var(--oc-status-in-progress)] text-[var(--ds-color-ink)]',
  
  // Canvas and Background colors
  CANVAS_BACKGROUND: 'bg-[var(--oc-canvas-bg)]',
  CANVAS_ELEMENT_BACKGROUND: 'bg-[var(--oc-canvas-element-bg)]',
  CANVAS_STICKY_BACKGROUND: 'bg-[var(--oc-canvas-sticky-bg)]',
  CANVAS_TEXT_BACKGROUND: 'bg-[#f8fafc]',
  CANVAS_ANNOTATION_BACKGROUND: 'bg-[var(--oc-canvas-annotation-bg)]',
  OVERLAY_BACKGROUND: 'bg-[rgba(255,255,255,0.9)]',
  OVERLAY_BACKGROUND_95: 'bg-[rgba(255,255,255,0.95)]',
  
  // Canvas Style Classes
  CANVAS_CLASS_BG_F8F9FA: 'bg-[var(--oc-canvas-bg)]',
  CANVAS_CLASS_BG_FFFFFF: 'bg-white',
  CANVAS_CLASS_BG_FEF08A: 'bg-[var(--oc-canvas-sticky-bg)]',
  CANVAS_CLASS_BG_F8FAFC: 'bg-[#f8fafc]',
  CANVAS_CLASS_BG_FFF3CD: 'bg-[var(--oc-canvas-annotation-bg)]',
  CANVAS_CLASS_OVERLAY_90: 'bg-white/90',
  CANVAS_CLASS_OVERLAY_95: 'bg-white/95',

  // Position and Layout Classes
  POSITION_ABSOLUTE: 'absolute',
  POSITION_RELATIVE: 'relative',
  POSITION_FIXED: 'fixed',
  FULL_SIZE: 'w-full h-full',
  
  // Common Canvas Element Classes
  CANVAS_ELEMENT_BASE: 'absolute select-none',
  CANVAS_SELECTION_BOX: `absolute pointer-events-none border-2 border-[var(--oc-canvas-selection-border)] bg-[var(--oc-canvas-selection-fill)]`,
  CANVAS_RESIZE_HANDLE: `absolute w-2 h-2 bg-[var(--oc-canvas-handle-bg)] border border-white rounded-sm cursor-pointer`,

  // Complete Color Palette for Canvas Elements
  CANVAS_COLOR_RED: '#FF0000',
  CANVAS_COLOR_ORANGE: '#FF8000',
  CANVAS_COLOR_YELLOW: '#FFFF00',
  CANVAS_COLOR_LIME: '#80FF00',
  CANVAS_COLOR_GREEN: '#00FF00',
  CANVAS_COLOR_MINT: '#00FF80',
  CANVAS_COLOR_CYAN: '#00FFFF',
  CANVAS_COLOR_BLUE: '#0080FF',
  CANVAS_COLOR_NAVY: '#0000FF',
  CANVAS_COLOR_PURPLE: '#8000FF',
  CANVAS_COLOR_MAGENTA: '#FF00FF',
  CANVAS_COLOR_PINK: '#FF0080',
  CANVAS_COLOR_BLACK: '#000000',
  CANVAS_COLOR_DARK_GRAY: '#404040',
  CANVAS_COLOR_GRAY: '#808080',
  CANVAS_COLOR_LIGHT_GRAY: '#C0C0C0',
  CANVAS_COLOR_WHITE: '#FFFFFF',
  CANVAS_COLOR_BROWN: '#8B4513',
  CANVAS_COLOR_BEIGE: '#FFE4B5',
  CANVAS_COLOR_PLUM: '#DDA0DD',
  CANVAS_COLOR_LIGHT_GREEN: '#98FB98',
  CANVAS_COLOR_KHAKI: '#F0E68C',
  CANVAS_COLOR_SKY_BLUE: '#87CEEB',
  CANVAS_COLOR_TAN: '#DEB887',

  // Canvas Element Background Classes
  CANVAS_BG_RED: 'bg-[#FF0000]',
  CANVAS_BG_ORANGE: 'bg-[#FF8000]',
  CANVAS_BG_YELLOW: 'bg-[#FFFF00]',
  CANVAS_BG_LIME: 'bg-[#80FF00]',
  CANVAS_BG_GREEN: 'bg-[#00FF00]',
  CANVAS_BG_MINT: 'bg-[#00FF80]',
  CANVAS_BG_CYAN: 'bg-[#00FFFF]',
  CANVAS_BG_BLUE: 'bg-[#0080FF]',
  CANVAS_BG_NAVY: 'bg-[#0000FF]',
  CANVAS_BG_PURPLE: 'bg-[#8000FF]',
  CANVAS_BG_MAGENTA: 'bg-[#FF00FF]',
  CANVAS_BG_PINK: 'bg-[#FF0080]',
  CANVAS_BG_BLACK: 'bg-[#000000]',
  CANVAS_BG_DARK_GRAY: 'bg-[#404040]',
  CANVAS_BG_GRAY: 'bg-[#808080]',
  CANVAS_BG_LIGHT_GRAY: 'bg-[#C0C0C0]',
  CANVAS_BG_WHITE: 'bg-[#FFFFFF]',
  CANVAS_BG_BROWN: 'bg-[#8B4513]',
  CANVAS_BG_BEIGE: 'bg-[#FFE4B5]',
  CANVAS_BG_PLUM: 'bg-[#DDA0DD]',
  CANVAS_BG_LIGHT_GREEN: 'bg-[#98FB98]',
  CANVAS_BG_KHAKI: 'bg-[#F0E68C]',
  CANVAS_BG_SKY_BLUE: 'bg-[#87CEEB]',
  CANVAS_BG_TAN: 'bg-[#DEB887]',

  // Operations Board Colors
  OPERATIONS_CARD_BG: '#ffffff',
  OPERATIONS_ALERT_BG: '#ffffff',
  OPERATIONS_STATS_BG: '#ffffff',
  OPERATIONS_TIMELINE_BG: '#ffffff',
  OPERATIONS_PROJECT_BG: '#ffffff',

  // Task Management Colors - using OC tokens
  TASK_CARD_BG: '#aec2cf',
  TASK_PRIORITY_HIGH: 'var(--ds-color-negative)',
  TASK_PRIORITY_MEDIUM: 'var(--ds-color-warning)',
  TASK_PRIORITY_LOW: 'var(--ds-color-positive)',
  TASK_MUSTARD: '#D4A574',

  // Collaboration Colors
  COLLAB_USER_BG: 'rgba(255,255,255,0.9)',
  COLLAB_FEED_BG: 'rgba(255,255,255,0.95)',
  COLLAB_COMMENT_BG: '#f8fafc',

  // Project Progress Colors - using OC tokens
  PROGRESS_COMPLETED: 'var(--oc-progress-active)',
  PROGRESS_INCOMPLETE: 'var(--oc-progress-inactive)',
  PROGRESS_BACKGROUND: 'var(--oc-progress-bg)',
  
  // Additional background colors
  SHAPE_FILL_BLUE: 'bg-[#3B82F6]',
  STICKY_NOTE_YELLOW: 'bg-[#FEF3C7]',
  TEXT_EDITOR_WHITE: 'bg-[#ffffff]',
  COLLABORATION_BACKGROUND: 'bg-[rgba(255,255,255,0.9)]',
  
  // Canvas specific background tokens
  CANVAS_SHAPE_FILL: '#3B82F6',
  CANVAS_STICKY_BG: '#FEF3C7',
  CANVAS_TEXT_BOX_BG: '#ffffff',
  CANVAS_TRANSPARENT: 'transparent',
  CANVAS_COLLAB_USER_BG: 'rgba(255,255,255,0.9)',
  
  // Task Status Colors - using OC tokens
  TASK_STATUS_COMPLETED: 'var(--oc-status-on-plan)',
  TASK_STATUS_IN_PROGRESS: 'var(--oc-status-in-preparation)', 
  TASK_STATUS_TODO: 'var(--oc-status-todo)',
  TASK_STATUS_STOPPED: 'var(--oc-status-stopped)',
  TASK_STATUS_TREATING: 'var(--oc-status-in-progress)',
  TASK_STATUS_LATE: 'var(--oc-status-delayed)',
  
  // NPS Score colors - using DS feedback colors
  NPS_EXCELLENT: 'var(--ds-color-positive)',
  NPS_VERY_GOOD: '#4ade80',
  NPS_GOOD: 'var(--ds-color-warning)',
  NPS_POOR: 'var(--ds-color-negative)',
  
  // Common element colors for canvas
  ELEMENT_SHAPE_FILL: '#3B82F6',
  ELEMENT_STICKY_NOTE: '#FEF3C7',
  ELEMENT_TEXT_BOX: '#ffffff',
  ELEMENT_BORDER: 'var(--ds-color-border)',
  ELEMENT_USER_COLOR: 'rgba(255,255,255,0.9)',
  
  // Notification and user interface colors - using DS feedback
  STATUS_SUCCESS: 'var(--ds-color-positive)',
  STATUS_WARNING: 'var(--ds-color-warning)', 
  STATUS_ERROR: 'var(--ds-color-negative)',
  STATUS_INFO: 'var(--ds-color-info)',
  STATUS_NEUTRAL: 'var(--ds-color-neutral)',
  
  // Color Picker Palette Colors
  PALETTE_RED: '#FF0000',
  PALETTE_ORANGE: '#FF8000',
  PALETTE_YELLOW: '#FFFF00',
  PALETTE_LIME: '#80FF00',
  PALETTE_GREEN: '#00FF00',
  PALETTE_MINT: '#00FF80',
  PALETTE_CYAN: '#00FFFF',
  PALETTE_BLUE: '#0080FF',
  PALETTE_NAVY: '#0000FF',
  PALETTE_PURPLE: '#8000FF',
  PALETTE_MAGENTA: '#FF00FF',
  PALETTE_PINK: '#FF0080',
  PALETTE_BLACK: '#000000',
  PALETTE_DARK_GRAY: '#404040',
  PALETTE_GRAY: '#808080',
  PALETTE_LIGHT_GRAY: '#C0C0C0',
  PALETTE_WHITE: '#FFFFFF',
  PALETTE_BROWN: '#8B4513',
  PALETTE_BEIGE: '#FFE4B5',
  PALETTE_PLUM: '#DDA0DD',
  PALETTE_LIGHT_GREEN: '#98FB98',
  PALETTE_KHAKI: '#F0E68C',
  PALETTE_SKY_BLUE: '#87CEEB',
  PALETTE_TAN: '#DEB887',
  
  // Style Preset Colors
  PRESET_CARD_WHITE: '#ffffff',
  PRESET_GRADIENT_START: '#667eea',
  PRESET_GRADIENT_END: '#764ba2',
  PRESET_NEON_GREEN: '#00ff88',
  PRESET_GLASS_WHITE: 'rgba(255, 255, 255, 0.2)',
  PRESET_GLASS_BORDER: 'rgba(255, 255, 255, 0.18)',
  PRESET_MINIMAL_BG: '#f9fafb',
  PRESET_MINIMAL_BORDER: '#d1d5db',
  
  // Category Badge Colors - using brand palette
  CATEGORY_EMERALD_BG: 'var(--ds-color-mint)',
  CATEGORY_EMERALD_TEXT: 'var(--ds-color-ink)',
  CATEGORY_BLUE_BG: 'var(--ds-color-sky)',
  CATEGORY_BLUE_TEXT: 'var(--ds-color-ink)',
  CATEGORY_PURPLE_BG: 'var(--ds-color-lilac)',
  CATEGORY_PURPLE_TEXT: 'var(--ds-color-ink)',
  CATEGORY_ORANGE_BG: 'var(--ds-color-amber)',
  CATEGORY_ORANGE_TEXT: 'var(--ds-color-ink)',
  CATEGORY_GREEN_BG: 'var(--ds-color-mint)',
  CATEGORY_GREEN_TEXT: 'var(--ds-color-ink)',
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
} as const;

export const LAYOUT = {
  // Card styles from design system
  CARD_ROUNDED: DESIGN_TOKENS.RADIUS.CARD_FULL,
  CARD_SHADOW: 'shadow-[var(--ds-elevation-2)]',
  PANEL_ROUNDED: DESIGN_TOKENS.RADIUS.CARD_TOP + ' ' + DESIGN_TOKENS.RADIUS.CARD_BOTTOM,
  PANEL_SHADOW: 'shadow-[var(--ds-elevation-2)]',
  
  // Grid layouts
  TWO_COLUMN_GRID: 'grid grid-cols-1 lg:grid-cols-2',
  FOUR_COLUMN_GRID: 'grid grid-cols-4',
  
  // Flex layouts
  FLEX_CENTER: 'flex items-center justify-center',
  FLEX_BETWEEN: 'flex items-center justify-between',
  FLEX_GAP: 'flex items-center gap-2',
  
  // Icon containers from specification
  ICON_CONTAINER: `w-6 h-6 rounded-full bg-transparent border border-[var(--ds-color-ink)] border-[1.5px] flex items-center justify-center p-[6px]`,
  ICON_CONTAINER_MD: `w-7 h-7 rounded-full bg-transparent border border-[var(--ds-color-ink)] border-[1.5px] flex items-center justify-center p-[6px]`,
  ICON_CONTAINER_LG: `w-8 h-8 rounded-full bg-transparent border border-[var(--ds-color-ink)] border-[1.5px] flex items-center justify-center p-[6px]`,
  ICON_SIZE: `h-3 w-3 text-[var(--ds-color-ink)] stroke-2`,
} as const;

export const TRANSITIONS = {
  DEFAULT: 'transition-all duration-[var(--ds-duration-slow)] ease-[var(--ds-ease-default)]',
  SHADOW: 'transition-shadow duration-[var(--ds-duration-slow)] ease-[var(--ds-ease-default)]',
  FAST: 'transition-all duration-[var(--ds-duration-fast)] ease-[var(--ds-ease-default)]',
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
  `sb-surface-box p-6 ${customClasses}`.trim();

export const buildPanelClasses = (customClasses = '') => 
  `${COLORS.PANEL_BACKGROUND} ${SPACING.CARD_PADDING} ${LAYOUT.PANEL_ROUNDED} ${COLORS.RING_BORDER} ${LAYOUT.PANEL_SHADOW} backdrop-blur-[2px] ${customClasses}`.trim();

export const buildBoxClasses = (customClasses = '') => 
  `sb-surface-box ${DESIGN_TOKENS.SPACING.LG} ${customClasses}`.trim();

export const buildTitleClasses = (customClasses = '') => 
  `${TYPOGRAPHY.H3} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} ${LAYOUT.FLEX_GAP} ${customClasses}`.trim();

// بناء classes للصناديق المستثناة (النظرة المالية وقائمة المهام)
export const buildExceptionBoxClasses = (customClasses = '') => 
  `bg-transparent border-transparent shadow-none p-6 ${customClasses}`.trim();

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

// Canvas positioning and dynamic style classes
export const CANVAS_POSITION_CLASSES = {
  // Resize handle positions (absolute positioning)
  HANDLE_TOP_LEFT: 'absolute top-[-6px] left-[-6px]',
  HANDLE_TOP_RIGHT: 'absolute top-[-6px] right-[-6px]',
  HANDLE_BOTTOM_LEFT: 'absolute bottom-[-6px] left-[-6px]',
  HANDLE_BOTTOM_RIGHT: 'absolute bottom-[-6px] right-[-6px]',
  HANDLE_TOP_CENTER: 'absolute top-[-6px] left-1/2 transform -translate-x-1/2',
  HANDLE_BOTTOM_CENTER: 'absolute bottom-[-6px] left-1/2 transform -translate-x-1/2',
  HANDLE_LEFT_CENTER: 'absolute top-1/2 left-[-6px] transform -translate-y-1/2',
  HANDLE_RIGHT_CENTER: 'absolute top-1/2 right-[-6px] transform -translate-y-1/2',
  
  // Handle sizes and hover effects
  HANDLE_BASE: 'w-3 h-3 bg-[var(--oc-canvas-handle-bg)] border border-white pointer-events-auto',
  HANDLE_HOVER: 'hover:bg-blue-600',
  
  // Cursor styles for handles
  CURSOR_NW_RESIZE: 'cursor-nw-resize',
  CURSOR_NE_RESIZE: 'cursor-ne-resize',
  CURSOR_SW_RESIZE: 'cursor-sw-resize',
  CURSOR_SE_RESIZE: 'cursor-se-resize',
  CURSOR_N_RESIZE: 'cursor-n-resize',
  CURSOR_S_RESIZE: 'cursor-s-resize',
  CURSOR_E_RESIZE: 'cursor-e-resize',
  CURSOR_W_RESIZE: 'cursor-w-resize',
} as const;

// Dynamic utility functions for style generation
export const DYNAMIC_CLASSES = {
  // Position utilities
  createPositionClasses: (x: number, y: number) => `left-[${x}px] top-[${y}px]`,
  createSizeClasses: (width: number, height: number) => `w-[${width}px] h-[${height}px]`,
  createTransformClasses: (scale: number, x: number, y: number) => 
    `transform scale-[${scale}] translate-x-[${x}px] translate-y-[${y}px]`,
  
  // Background utilities for Canvas elements
  createBgColorClass: (color: string) => `bg-[${color}]`,
  createBorderClass: (color: string, width: number) => `border-[${width}px] border-[${color}]`,
  createFontSizeClass: (size: number) => `text-[${size}px]`,
  
  // Shadow utilities
  createBoxShadowClass: (shadow: string) => `shadow-[${shadow}]`,
  
  // Border radius utilities
  createBorderRadiusClass: (radius: number) => `rounded-[${radius}px]`,
} as const;
