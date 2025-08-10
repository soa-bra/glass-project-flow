// ===============================
// SoaBra Design System Constants
// نظام التصميم الموحد لسوبرا
// ===============================

export const SPACING = {
  // Standard spacing values
  CARD_PADDING: 'p-9',
  SECTION_MARGIN: 'my-[24px]',
  CARD_MARGIN: 'mb-6',
  GRID_GAP: 'gap-6',
  
  // Specific paddings
  CONTENT_PADDING: 'px-0',
  HEADER_PADDING: 'px-0 pt-0 mb-6',
} as const;

export const COLORS = {
  // SoaBra Unified Theme Colors
  APP_BACKGROUND: 'bg-[var(--sb-bg-00)]',
  PANEL_BACKGROUND: 'bg-[var(--sb-surface-01)]',
  CARD_BACKGROUND: 'bg-[var(--sb-surface-00)]',
  TRANSPARENT_BACKGROUND: 'bg-transparent',
  
  // Border and ring colors
  BORDER_COLOR: 'ring-1 ring-[var(--sb-border)]',
  
  // Text colors
  PRIMARY_TEXT: 'text-[var(--sb-ink)]',
  SECONDARY_TEXT: 'text-[var(--sb-ink-70)]',
  MUTED_TEXT: 'text-[var(--sb-ink-40)]',
  
  // Badge colors (keeping original for brand consistency)
  BADGE_SUCCESS: 'bg-[#bdeed3] text-[var(--sb-ink)]',
  BADGE_WARNING: 'bg-[#fbe2aa] text-[var(--sb-ink)]',
  BADGE_ERROR: 'bg-[#f1b5b9] text-[var(--sb-ink)]',
  BADGE_INFO: 'bg-[#a4e2f6] text-[var(--sb-ink)]',
  BADGE_PRIMARY: 'bg-[#d9d2fd] text-[var(--sb-ink)]',
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
  // SoaBra Card styles with new radii and shadows
  CARD_ROUNDED: 'rounded-t-[24px] rounded-b-[6px]',
  CARD_SHADOW: 'shadow-[var(--sb-shadow-soft)] hover:shadow-[var(--sb-shadow-strong)] transition-shadow duration-300',
  PANEL_SHADOW: 'shadow-[var(--sb-shadow-strong)]',
  
  // Grid layouts
  TWO_COLUMN_GRID: 'grid grid-cols-1 lg:grid-cols-2',
  FOUR_COLUMN_GRID: 'grid grid-cols-4',
  
  // Flex layouts
  FLEX_CENTER: 'flex items-center justify-center',
  FLEX_BETWEEN: 'flex items-center justify-between',
  FLEX_GAP: 'flex items-center gap-2',
  
  // Icon containers - SoaBra style
  ICON_CONTAINER: 'w-8 h-8 rounded-full bg-transparent ring-1 ring-[var(--sb-ink)] flex items-center justify-center',
  ICON_SIZE: 'h-4 w-4 text-[var(--sb-ink)]',
  ICON_CONTAINER_LG: 'w-10 h-10 rounded-full bg-transparent ring-1 ring-[var(--sb-ink)] flex items-center justify-center',
} as const;

export const TRANSITIONS = {
  DEFAULT: 'transition-all duration-300',
  SHADOW: 'transition-shadow duration-300',
} as const;

// Unified component class builders
export const buildCardClasses = (customClasses = '') => 
  `${COLORS.CARD_BACKGROUND} ${SPACING.CARD_PADDING} ${LAYOUT.CARD_ROUNDED} ${COLORS.BORDER_COLOR} ${LAYOUT.CARD_SHADOW} ${customClasses}`.trim();

export const buildPanelClasses = (customClasses = '') => 
  `${COLORS.PANEL_BACKGROUND} ${SPACING.CARD_PADDING} ${LAYOUT.CARD_ROUNDED} ${COLORS.BORDER_COLOR} ${LAYOUT.PANEL_SHADOW} backdrop-blur-[2px] ${customClasses}`.trim();

export const buildTitleClasses = (customClasses = '') => 
  `${TYPOGRAPHY.TITLE_SIZE} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} ${LAYOUT.FLEX_GAP} ${customClasses}`.trim();

export const buildBadgeClasses = (variant: 'success' | 'warning' | 'error' | 'info' | 'primary' = 'primary') => {
  const variantColors = {
    success: COLORS.BADGE_SUCCESS,
    warning: COLORS.BADGE_WARNING,
    error: COLORS.BADGE_ERROR,
    info: COLORS.BADGE_INFO,
    primary: COLORS.BADGE_PRIMARY,
  };
  
  return `px-3 py-1 ${LAYOUT.CARD_ROUNDED} ${TYPOGRAPHY.CAPTION_TEXT} ${variantColors[variant]}`;
};