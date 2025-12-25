/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Design System Tokens - TypeScript Exports
 * توكنات محايدة - قابلة لإعادة الاستخدام في أي مشروع
 * 
 * @layer Design System
 * @version 1.0.0
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────────────────

export const DS_COLORS = {
  // Ink (Text)
  INK: 'var(--ds-color-ink)',
  INK_90: 'var(--ds-color-ink-90)',
  INK_80: 'var(--ds-color-ink-80)',
  INK_70: 'var(--ds-color-ink-70)',
  INK_60: 'var(--ds-color-ink-60)',
  INK_40: 'var(--ds-color-ink-40)',
  INK_30: 'var(--ds-color-ink-30)',
  INK_20: 'var(--ds-color-ink-20)',
  INK_10: 'var(--ds-color-ink-10)',
  INK_08: 'var(--ds-color-ink-08)',
  INK_05: 'var(--ds-color-ink-05)',

  // White
  WHITE: 'var(--ds-color-white)',
  WHITE_90: 'var(--ds-color-white-90)',
  WHITE_80: 'var(--ds-color-white-80)',
  WHITE_70: 'var(--ds-color-white-70)',
  WHITE_60: 'var(--ds-color-white-60)',
  WHITE_40: 'var(--ds-color-white-40)',
  WHITE_20: 'var(--ds-color-white-20)',

  // Surface
  SURFACE: 'var(--ds-color-surface)',
  SURFACE_MUTED: 'var(--ds-color-surface-muted)',
  SURFACE_SUBTLE: 'var(--ds-color-surface-subtle)',
  SURFACE_ELEVATED: 'var(--ds-color-surface-elevated)',
  SURFACE_OVERLAY: 'var(--ds-color-surface-overlay)',

  // Panel
  PANEL: 'var(--ds-color-panel)',
  PANEL_MUTED: 'var(--ds-color-panel-muted)',
  PANEL_SUBTLE: 'var(--ds-color-panel-subtle)',

  // Border
  BORDER: 'var(--ds-color-border)',
  BORDER_SUBTLE: 'var(--ds-color-border-subtle)',
  BORDER_FOCUS: 'var(--ds-color-border-focus)',

  // Brand Palette
  MINT: 'var(--ds-color-mint)',
  MINT_MUTED: 'var(--ds-color-mint-muted)',
  SKY: 'var(--ds-color-sky)',
  LILAC: 'var(--ds-color-lilac)',
  ROSE: 'var(--ds-color-rose)',
  AMBER: 'var(--ds-color-amber)',
  MUTED_BLUE: 'var(--ds-color-muted-blue)',
  CREAM: 'var(--ds-color-cream)',

  // Feedback
  POSITIVE: 'var(--ds-color-positive)',
  POSITIVE_MUTED: 'var(--ds-color-positive-muted)',
  WARNING: 'var(--ds-color-warning)',
  WARNING_MUTED: 'var(--ds-color-warning-muted)',
  NEGATIVE: 'var(--ds-color-negative)',
  NEGATIVE_MUTED: 'var(--ds-color-negative-muted)',
  INFO: 'var(--ds-color-info)',
  INFO_MUTED: 'var(--ds-color-info-muted)',
  NEUTRAL: 'var(--ds-color-neutral)',

  // Interactive States
  HOVER: 'var(--ds-color-hover)',
  ACTIVE: 'var(--ds-color-active)',
  DISABLED: 'var(--ds-color-disabled)',
  FOCUS_RING: 'var(--ds-color-focus-ring)',

  // Glass
  GLASS_BG: 'var(--ds-color-glass-bg)',
  GLASS_BORDER: 'var(--ds-color-glass-border)',
  GLASS_BACKDROP: 'var(--ds-color-glass-backdrop)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Spacing
// ─────────────────────────────────────────────────────────────────────────────

export const DS_SPACING = {
  0: 'var(--ds-space-0)',
  PX: 'var(--ds-space-px)',
  0.5: 'var(--ds-space-0-5)',
  1: 'var(--ds-space-1)',
  1.5: 'var(--ds-space-1-5)',
  2: 'var(--ds-space-2)',
  2.5: 'var(--ds-space-2-5)',
  3: 'var(--ds-space-3)',
  3.5: 'var(--ds-space-3-5)',
  4: 'var(--ds-space-4)',
  5: 'var(--ds-space-5)',
  6: 'var(--ds-space-6)',
  7: 'var(--ds-space-7)',
  8: 'var(--ds-space-8)',
  9: 'var(--ds-space-9)',
  10: 'var(--ds-space-10)',
  11: 'var(--ds-space-11)',
  12: 'var(--ds-space-12)',
  14: 'var(--ds-space-14)',
  16: 'var(--ds-space-16)',
  20: 'var(--ds-space-20)',
  24: 'var(--ds-space-24)',
  28: 'var(--ds-space-28)',
  32: 'var(--ds-space-32)',

  // Semantic
  XS: 'var(--ds-space-xs)',
  SM: 'var(--ds-space-sm)',
  MD: 'var(--ds-space-md)',
  LG: 'var(--ds-space-lg)',
  XL: 'var(--ds-space-xl)',
  '2XL': 'var(--ds-space-2xl)',
  '3XL': 'var(--ds-space-3xl)',

  // Component
  INPUT_X: 'var(--ds-space-input-x)',
  INPUT_Y: 'var(--ds-space-input-y)',
  BUTTON_X: 'var(--ds-space-button-x)',
  BUTTON_Y: 'var(--ds-space-button-y)',
  CARD: 'var(--ds-space-card)',
  MODAL: 'var(--ds-space-modal)',
  SECTION: 'var(--ds-space-section)',
} as const;

export const DS_GAP = {
  XS: 'var(--ds-gap-xs)',
  SM: 'var(--ds-gap-sm)',
  MD: 'var(--ds-gap-md)',
  LG: 'var(--ds-gap-lg)',
  XL: 'var(--ds-gap-xl)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Radius
// ─────────────────────────────────────────────────────────────────────────────

export const DS_RADIUS = {
  NONE: 'var(--ds-radius-none)',
  XS: 'var(--ds-radius-xs)',
  SM: 'var(--ds-radius-sm)',
  MD: 'var(--ds-radius-md)',
  LG: 'var(--ds-radius-lg)',
  XL: 'var(--ds-radius-xl)',
  '2XL': 'var(--ds-radius-2xl)',
  '3XL': 'var(--ds-radius-3xl)',
  FULL: 'var(--ds-radius-full)',

  // Component-specific
  BUTTON: 'var(--ds-radius-button)',
  INPUT: 'var(--ds-radius-input)',
  CARD: 'var(--ds-radius-card)',
  CARD_TOP: 'var(--ds-radius-card-top)',
  CARD_BOTTOM: 'var(--ds-radius-card-bottom)',
  MODAL: 'var(--ds-radius-modal)',
  PANEL: 'var(--ds-radius-panel)',
  TOOLTIP: 'var(--ds-radius-tooltip)',
  BADGE: 'var(--ds-radius-badge)',
  CHIP: 'var(--ds-radius-chip)',
  AVATAR: 'var(--ds-radius-avatar)',
  BAR: 'var(--ds-radius-bar)',
  DOT: 'var(--ds-radius-dot)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Elevation (Shadows)
// ─────────────────────────────────────────────────────────────────────────────

export const DS_ELEVATION = {
  0: 'var(--ds-elevation-0)',
  1: 'var(--ds-elevation-1)',
  2: 'var(--ds-elevation-2)',
  3: 'var(--ds-elevation-3)',
  4: 'var(--ds-elevation-4)',
  5: 'var(--ds-elevation-5)',

  // Semantic
  CARD: 'var(--ds-elevation-card)',
  DROPDOWN: 'var(--ds-elevation-dropdown)',
  MODAL: 'var(--ds-elevation-modal)',
  POPOVER: 'var(--ds-elevation-popover)',
  TOOLTIP: 'var(--ds-elevation-tooltip)',
  TOAST: 'var(--ds-elevation-toast)',
  GLASS: 'var(--ds-elevation-glass)',

  // Inset
  INSET_SM: 'var(--ds-elevation-inset-sm)',
  INSET_MD: 'var(--ds-elevation-inset-md)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Motion
// ─────────────────────────────────────────────────────────────────────────────

export const DS_DURATION = {
  INSTANT: 'var(--ds-duration-instant)',
  FASTEST: 'var(--ds-duration-fastest)',
  FASTER: 'var(--ds-duration-faster)',
  FAST: 'var(--ds-duration-fast)',
  NORMAL: 'var(--ds-duration-normal)',
  SLOW: 'var(--ds-duration-slow)',
  SLOWER: 'var(--ds-duration-slower)',
  SLOWEST: 'var(--ds-duration-slowest)',
} as const;

export const DS_EASE = {
  LINEAR: 'var(--ds-ease-linear)',
  DEFAULT: 'var(--ds-ease-default)',
  IN: 'var(--ds-ease-in)',
  OUT: 'var(--ds-ease-out)',
  IN_OUT: 'var(--ds-ease-in-out)',
  BOUNCE: 'var(--ds-ease-bounce)',
  ELASTIC: 'var(--ds-ease-elastic)',
  SOABRA: 'var(--ds-ease-soabra)',
} as const;

export const DS_TRANSITION = {
  COLORS: 'var(--ds-transition-colors)',
  OPACITY: 'var(--ds-transition-opacity)',
  TRANSFORM: 'var(--ds-transition-transform)',
  ALL: 'var(--ds-transition-all)',
} as const;

export const DS_MOTION = {
  DURATION: DS_DURATION,
  EASE: DS_EASE,
  TRANSITION: DS_TRANSITION,
  REVEAL: {
    Y: 'var(--ds-motion-reveal-y)',
    DURATION: 'var(--ds-motion-reveal-duration)',
    DELAY: 'var(--ds-motion-reveal-delay)',
  },
  STAGGER: {
    GAP: 'var(--ds-motion-stagger-gap)',
    CHILD_Y: 'var(--ds-motion-stagger-child-y)',
    CHILD_DURATION: 'var(--ds-motion-stagger-child-duration)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Z-Index
// ─────────────────────────────────────────────────────────────────────────────

export const DS_Z_INDEX = {
  BEHIND: 'var(--ds-z-behind)',
  BASE: 'var(--ds-z-base)',
  RAISED: 'var(--ds-z-raised)',
  ELEVATED: 'var(--ds-z-elevated)',
  DROPDOWN: 'var(--ds-z-dropdown)',
  STICKY: 'var(--ds-z-sticky)',
  FIXED: 'var(--ds-z-fixed)',
  OVERLAY: 'var(--ds-z-overlay)',
  MODAL_BACKDROP: 'var(--ds-z-modal-backdrop)',
  MODAL: 'var(--ds-z-modal)',
  MODAL_CONTENT: 'var(--ds-z-modal-content)',
  POPOVER: 'var(--ds-z-popover)',
  TOOLTIP: 'var(--ds-z-tooltip)',
  TOAST: 'var(--ds-z-toast)',
  MAX: 'var(--ds-z-max)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Typography
// ─────────────────────────────────────────────────────────────────────────────

export const DS_FONT_FAMILY = {
  DEFAULT: 'var(--ds-font-family)',
  MONO: 'var(--ds-font-family-mono)',
} as const;

export const DS_FONT_WEIGHT = {
  REGULAR: 'var(--ds-font-weight-regular)',
  MEDIUM: 'var(--ds-font-weight-medium)',
  SEMIBOLD: 'var(--ds-font-weight-semibold)',
  BOLD: 'var(--ds-font-weight-bold)',
} as const;

export const DS_FONT_SIZE = {
  XS: 'var(--ds-font-size-xs)',
  SM: 'var(--ds-font-size-sm)',
  BASE: 'var(--ds-font-size-base)',
  MD: 'var(--ds-font-size-md)',
  LG: 'var(--ds-font-size-lg)',
  XL: 'var(--ds-font-size-xl)',
  '2XL': 'var(--ds-font-size-2xl)',
  '3XL': 'var(--ds-font-size-3xl)',
  '4XL': 'var(--ds-font-size-4xl)',
  '5XL': 'var(--ds-font-size-5xl)',
} as const;

export const DS_LINE_HEIGHT = {
  NONE: 'var(--ds-line-height-none)',
  TIGHT: 'var(--ds-line-height-tight)',
  SNUG: 'var(--ds-line-height-snug)',
  NORMAL: 'var(--ds-line-height-normal)',
  RELAXED: 'var(--ds-line-height-relaxed)',
  LOOSE: 'var(--ds-line-height-loose)',
} as const;

export const DS_TRACKING = {
  TIGHTER: 'var(--ds-tracking-tighter)',
  TIGHT: 'var(--ds-tracking-tight)',
  NORMAL: 'var(--ds-tracking-normal)',
  WIDE: 'var(--ds-tracking-wide)',
  WIDER: 'var(--ds-tracking-wider)',
  WIDEST: 'var(--ds-tracking-widest)',
} as const;

export const DS_TEXT = {
  DISPLAY_L: {
    SIZE: 'var(--ds-text-display-l-size)',
    LINE: 'var(--ds-text-display-l-line)',
    WEIGHT: 'var(--ds-text-display-l-weight)',
  },
  DISPLAY_M: {
    SIZE: 'var(--ds-text-display-m-size)',
    LINE: 'var(--ds-text-display-m-line)',
    WEIGHT: 'var(--ds-text-display-m-weight)',
  },
  TITLE: {
    SIZE: 'var(--ds-text-title-size)',
    LINE: 'var(--ds-text-title-line)',
    WEIGHT: 'var(--ds-text-title-weight)',
  },
  SUBTITLE: {
    SIZE: 'var(--ds-text-subtitle-size)',
    LINE: 'var(--ds-text-subtitle-line)',
    WEIGHT: 'var(--ds-text-subtitle-weight)',
  },
  BODY: {
    SIZE: 'var(--ds-text-body-size)',
    LINE: 'var(--ds-text-body-line)',
    WEIGHT: 'var(--ds-text-body-weight)',
  },
  LABEL: {
    SIZE: 'var(--ds-text-label-size)',
    LINE: 'var(--ds-text-label-line)',
    WEIGHT: 'var(--ds-text-label-weight)',
  },
  CAPTION: {
    SIZE: 'var(--ds-text-caption-size)',
    LINE: 'var(--ds-text-caption-line)',
    WEIGHT: 'var(--ds-text-caption-weight)',
  },
  KPI: {
    NUMBER_SIZE: 'var(--ds-text-kpi-number-size)',
    NUMBER_WEIGHT: 'var(--ds-text-kpi-number-weight)',
    UNIT_SIZE: 'var(--ds-text-kpi-unit-size)',
    UNIT_WEIGHT: 'var(--ds-text-kpi-unit-weight)',
  },
} as const;

export const DS_TYPOGRAPHY = {
  FAMILY: DS_FONT_FAMILY,
  WEIGHT: DS_FONT_WEIGHT,
  SIZE: DS_FONT_SIZE,
  LINE_HEIGHT: DS_LINE_HEIGHT,
  TRACKING: DS_TRACKING,
  TEXT: DS_TEXT,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined DS Export
// ─────────────────────────────────────────────────────────────────────────────

export const DS = {
  COLORS: DS_COLORS,
  SPACING: DS_SPACING,
  GAP: DS_GAP,
  RADIUS: DS_RADIUS,
  ELEVATION: DS_ELEVATION,
  MOTION: DS_MOTION,
  Z_INDEX: DS_Z_INDEX,
  TYPOGRAPHY: DS_TYPOGRAPHY,
} as const;

export default DS;
