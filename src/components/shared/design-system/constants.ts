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
  
  // Colors from specification - Updated according to requirements
  COLORS: {
    INK: '#000000',
    INK_60: 'rgba(11,15,18,0.6)',
    INK_30: 'rgba(11,15,18,0.3)',
    SURFACE: '#FFFFFF',
    SURFACE_MUTED: '#F6F7F8',
    BORDER: '#DADCE0',
    
    // Main background colors
    PANEL_BG: '#F8F9FA',          // خلفية اللوحات
    BOX_BG: '#FFFFFF',            // خلفية الصناديق
    
    // Project layouts
    PROJECT_COLUMN_BG: '#ebeff2',     // خلفية عامود المشاريع
    PROJECT_CARD_BG: '#F1F5F9',       // خلفية بطاقات المشاريع
    PROJECT_CARD_CAPSULE_BG: '#FFFFFF', // خلفية كبسولات بطاقات المشاريع
    
    // Task layouts  
    TASK_LIST_BOX_BG: '#eaecef',      // خلفية صندوق قائمة المهام
    TASK_CARD_BG: '#f8f9fa',          // خلفية بطاقات المهام
    TASK_CARD_CAPSULE_BG: '#FFFFFF',  // خلفية كبسولات بطاقات المهام
    
    // Financial status backgrounds
    FINANCIAL_PROFIT_BG: '#96D8D0',   // خلفية ربح/ضمن الميزانية
    FINANCIAL_LOSS_BG: '#F1B5B9',     // خلفية خسارة/أعلى من الميزانية
    
    // Additional sidebar background
    ADDITIONAL_SIDEBAR_BG: '#ebeff2',  // خلفية البار الإضافي
    
    // Project card elements
    PROJECT_CARD_DAYS_CIRCLE_BG: 'transparent', // خلفية فقاعة الأيام المتبقية
    PROJECT_CARD_TASKS_CIRCLE_BG: '#d1e1ea',    // خلفية فقاعة المهام
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
  // SoaBra Design System Colors - Updated with new tokens
  PANEL_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.PANEL_BG}]`,
  BOX_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.BOX_BG}]`,
  
  // Project layout backgrounds
  PROJECT_COLUMN_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.PROJECT_COLUMN_BG}]`,
  PROJECT_CARD_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.PROJECT_CARD_BG}] border border-[${DESIGN_TOKENS.COLORS.BORDER}]`,
  PROJECT_CARD_CAPSULE_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.PROJECT_CARD_CAPSULE_BG}] border border-[${DESIGN_TOKENS.COLORS.BORDER}]`,
  
  // Task layout backgrounds  
  TASK_LIST_BOX_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.TASK_LIST_BOX_BG}]`,
  TASK_CARD_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.TASK_CARD_BG}] border border-[${DESIGN_TOKENS.COLORS.BORDER}]`,
  TASK_CARD_CAPSULE_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.TASK_CARD_CAPSULE_BG}] border border-[${DESIGN_TOKENS.COLORS.BORDER}]`,
  
  // Financial status backgrounds
  FINANCIAL_PROFIT_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.FINANCIAL_PROFIT_BG}]`,
  FINANCIAL_LOSS_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.FINANCIAL_LOSS_BG}]`,
  
  TRANSPARENT_BACKGROUND: 'bg-transparent',
  
  // Legacy compatibility - keeping CARD_BACKGROUND for existing components
  CARD_BACKGROUND: `bg-[${DESIGN_TOKENS.COLORS.BOX_BG}]`,
  
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
  
  // Canvas and Background colors for inline style replacements
  CANVAS_BACKGROUND: 'bg-[#f8f9fa]',
  CANVAS_ELEMENT_BACKGROUND: 'bg-[#ffffff]',
  CANVAS_STICKY_BACKGROUND: 'bg-[#fef08a]',
  CANVAS_TEXT_BACKGROUND: 'bg-[#f8fafc]',
  CANVAS_ANNOTATION_BACKGROUND: 'bg-[#fff3cd]',
  OVERLAY_BACKGROUND: 'bg-[rgba(255,255,255,0.9)]',
  OVERLAY_BACKGROUND_95: 'bg-[rgba(255,255,255,0.95)]',
  
  // Canvas Style Classes for inline style replacement
  CANVAS_CLASS_BG_F8F9FA: 'bg-[#f8f9fa]',
  CANVAS_CLASS_BG_FFFFFF: 'bg-white',
  CANVAS_CLASS_BG_FEF08A: 'bg-[#fef08a]',
  CANVAS_CLASS_BG_F8FAFC: 'bg-[#f8fafc]',
  CANVAS_CLASS_BG_FFF3CD: 'bg-[#fff3cd]',
  CANVAS_CLASS_OVERLAY_90: 'bg-white/90',
  CANVAS_CLASS_OVERLAY_95: 'bg-white/95',

  // Position and Layout Classes
  POSITION_ABSOLUTE: 'absolute',
  POSITION_RELATIVE: 'relative',
  POSITION_FIXED: 'fixed',
  FULL_SIZE: 'w-full h-full',
  
  // Common Canvas Element Classes
  CANVAS_ELEMENT_BASE: 'absolute select-none',
  CANVAS_SELECTION_BOX: 'absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10',
  CANVAS_RESIZE_HANDLE: 'absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-pointer',

  // Complete Color Palette for Canvas Elements (Phase 2 Implementation)
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

  // Task Management Colors
  TASK_CARD_BG: '#aec2cf',
  TASK_PRIORITY_HIGH: '#ef4444',
  TASK_PRIORITY_MEDIUM: '#f59e0b',
  TASK_PRIORITY_LOW: '#10b981',
  TASK_MUSTARD: '#D4A574',

  // Collaboration Colors
  COLLAB_USER_BG: 'rgba(255,255,255,0.9)',
  COLLAB_FEED_BG: 'rgba(255,255,255,0.95)',
  COLLAB_COMMENT_BG: '#f8fafc',

  // Project Progress Colors
  PROGRESS_COMPLETED: '#d9f3a8',
  PROGRESS_INCOMPLETE: 'rgba(255, 255, 255, 0.3)',
  PROGRESS_BACKGROUND: '#d1e1ea',
  
  // Additional background colors for specific elements
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
  
  // Task Status Colors (for UI consistency)
  TASK_STATUS_COMPLETED: '#bdeed3',
  TASK_STATUS_IN_PROGRESS: '#a4e2f6', 
  TASK_STATUS_TODO: '#dfecf2',
  TASK_STATUS_STOPPED: '#f1b5b9',
  TASK_STATUS_TREATING: '#d9d2fd',
  TASK_STATUS_LATE: '#fbe2aa',
  
  // NPS Score colors
  NPS_EXCELLENT: '#22c55e',    // Green-500
  NPS_VERY_GOOD: '#4ade80',    // Green-400
  NPS_GOOD: '#facc15',         // Yellow-400
  NPS_POOR: '#ef4444',         // Red-500
  
  // Common element colors for canvas
  ELEMENT_SHAPE_FILL: '#3B82F6',
  ELEMENT_STICKY_NOTE: '#FEF3C7',
  ELEMENT_TEXT_BOX: '#ffffff',
  ELEMENT_BORDER: '#DADCE0',
  ELEMENT_USER_COLOR: 'rgba(255,255,255,0.9)',
  
  // Notification and user interface colors
  STATUS_SUCCESS: '#10b981',
  STATUS_WARNING: '#f59e0b', 
  STATUS_ERROR: '#ef4444',
  STATUS_INFO: '#3b82f6',
  STATUS_NEUTRAL: '#6b7280',
  
  
  // Color Picker Palette Colors (for dynamic styling)
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
  
  // Category Badge Colors
  CATEGORY_EMERALD_BG: '#bdeed3',
  CATEGORY_EMERALD_TEXT: '#000000',
  CATEGORY_BLUE_BG: '#a4e2f6',
  CATEGORY_BLUE_TEXT: '#000000',
  CATEGORY_PURPLE_BG: '#d9d2fd',
  CATEGORY_PURPLE_TEXT: '#000000',
  CATEGORY_ORANGE_BG: '#fbe2aa',
  CATEGORY_ORANGE_TEXT: '#000000',
  CATEGORY_GREEN_BG: '#bdeed3',
  CATEGORY_GREEN_TEXT: '#000000',
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

// Updated component class builders with SoaBra Tokens v1.2.5 - Backward Compatible
export const buildCardClasses = (variantOrCustom: 'default' | 'project' | 'task' | 'box' | string = 'default', customClasses = '') => {
  // Handle backward compatibility - if first param looks like custom classes, treat as old signature
  if (typeof variantOrCustom === 'string' && !['default', 'project', 'task', 'box'].includes(variantOrCustom)) {
    return `bg-[var(--sb-box-bg)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-soft)] rounded-lg ${SPACING.CARD_PADDING} ${variantOrCustom}`.trim();
  }
  
  const variant = variantOrCustom as 'default' | 'project' | 'task' | 'box';
  const base = variant === 'project' 
    ? 'bg-[var(--sb-project-card-bg)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-soft)] rounded-t-[24px] rounded-b-[6px]'
    : variant === 'task' 
    ? 'bg-[var(--sb-task-card-bg)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-soft)] rounded-t-[24px] rounded-b-[6px]'
    : variant === 'box'
    ? 'bg-[var(--sb-box-bg)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-soft)] rounded-lg'
    : 'bg-[var(--sb-card-bg)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-soft)] rounded-t-[24px] rounded-b-[6px]';
  return `${base} ${SPACING.CARD_PADDING} ${customClasses}`.trim();
};

export const buildPanelClasses = (customClasses = '') => 
  `bg-[var(--sb-panel-bg)] border border-[var(--sb-border)] shadow-[var(--sb-shadow-strong)] rounded-[18px] ${SPACING.CARD_PADDING} ${customClasses}`.trim();

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
  HANDLE_BASE: 'w-3 h-3 bg-blue-500 border border-white pointer-events-auto',
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