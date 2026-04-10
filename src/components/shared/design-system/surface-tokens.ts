// ===============================
// SoaBra Surface Tokens — UI System Contract
// Phase 0: Centralized design tokens for surfaces, z-index, spacing, and responsive rules
// ===============================

// ─── SURFACE FAMILIES ───────────────────────────────────────────
// Static: persistent in-page UI (cards, boxes, panels)
// Overlay: temporary floating UI (modals, drawers, popovers, tooltips)

export const SURFACE = {
  /** Static surface — white bg, neutral border, no glass */
  STATIC: {
    bg: '#FFFFFF',
    border: '#DADCE0',
    borderWidth: 1,
    radius: 24,
    shadow: '0 1px 1px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)',
    padding: 24,
  },
  /** Overlay surface — glass/frosted, for modals & drawers only */
  OVERLAY: {
    bg: 'rgba(255,255,255,0.65)',
    backdropBg: 'rgba(255,255,255,0.30)',
    blur: 18,
    border: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    radius: 18,
    shadow: '0 1px 1px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.10)',
    padding: 24,
  },
} as const;

// Tailwind class builders for surfaces
export const SURFACE_CLASSES = {
  /** White card: persistent in-page surface */
  STATIC_CARD: 'bg-white border border-[#DADCE0] rounded-[24px] shadow-[0_1px_1px_rgba(0,0,0,0.03),_0_8px_24px_rgba(0,0,0,0.06)]',
  /** Flat panel section (no shadow) */
  STATIC_PANEL: 'bg-white border border-[#DADCE0] rounded-[18px]',
  /** Glass overlay for modals/drawers */
  OVERLAY_GLASS: 'bg-[rgba(255,255,255,0.65)] backdrop-blur-[18px] border border-[rgba(255,255,255,0.6)] rounded-[18px] shadow-[0_1px_1px_rgba(0,0,0,0.04),_0_12px_28px_rgba(0,0,0,0.10)]',
  /** Overlay scrim/backdrop */
  OVERLAY_SCRIM: 'bg-[rgba(255,255,255,0.30)] backdrop-blur-[8px]',
} as const;

// ─── Z-INDEX HIERARCHY ─────────────────────────────────────────
// Deterministic stacking order for all layers

export const Z_INDEX = {
  /** Base content layer */
  CANVAS: 1,
  /** Sticky headers, sidebars */
  CHROME: 100,
  /** Dashboard panels */
  PANEL: 200,
  /** Floating action buttons */
  FAB: 500,
  /** Dropdown menus, selects */
  DROPDOWN: 1000,
  /** Popovers */
  POPOVER: 2000,
  /** Drawers */
  DRAWER: 3000,
  /** Modal scrim/backdrop */
  MODAL_SCRIM: 9000,
  /** Modal content */
  MODAL_CONTENT: 9100,
  /** Tooltips (always on top of modals) */
  TOOLTIP: 10000,
  /** Command palette */
  COMMAND: 10100,
  /** Toast notifications (topmost) */
  TOAST: 10200,
} as const;

// CSS variable string for injection
export const Z_INDEX_CSS_VARS = `
  --z-canvas: ${Z_INDEX.CANVAS};
  --z-chrome: ${Z_INDEX.CHROME};
  --z-panel: ${Z_INDEX.PANEL};
  --z-fab: ${Z_INDEX.FAB};
  --z-dropdown: ${Z_INDEX.DROPDOWN};
  --z-popover: ${Z_INDEX.POPOVER};
  --z-drawer: ${Z_INDEX.DRAWER};
  --z-modal-scrim: ${Z_INDEX.MODAL_SCRIM};
  --z-modal-content: ${Z_INDEX.MODAL_CONTENT};
  --z-tooltip: ${Z_INDEX.TOOLTIP};
  --z-command: ${Z_INDEX.COMMAND};
  --z-toast: ${Z_INDEX.TOAST};
`;

// ─── SPACING TOKENS ─────────────────────────────────────────────

export const SPACE = {
  /** 4px */  XS: 4,
  /** 8px */  SM: 8,
  /** 12px */ MD: 12,
  /** 16px */ LG: 16,
  /** 24px */ XL: 24,
  /** 32px */ XXL: 32,
  /** 40px */ XXXL: 40,
} as const;

// ─── RADIUS TOKENS ──────────────────────────────────────────────

export const RADIUS = {
  /** Static cards */
  CARD: 24,
  /** Panels, overlays */
  PANEL: 18,
  /** Small elements */
  SMALL: 12,
  /** Chips, pills */
  CHIP: 9999,
  /** Tooltip */
  TOOLTIP: 10,
} as const;

// ─── RESPONSIVE BREAKPOINTS ─────────────────────────────────────

export const BREAKPOINTS = {
  /** Mobile max */
  SM: 640,
  /** Tablet */
  MD: 768,
  /** Small desktop */
  LG: 1024,
  /** Desktop */
  XL: 1280,
  /** Wide desktop */
  XXL: 1536,
} as const;

// ─── GRID SYSTEM SPEC ───────────────────────────────────────────

export const GRID = {
  /** Desktop column count */
  DESKTOP_COLS: 12,
  /** Tablet column count */
  TABLET_COLS: 6,
  /** Mobile column count */
  MOBILE_COLS: 1,
  /** Default gap between grid items (px) */
  GAP: 10,
  /** Row height hint for auto-placement */
  ROW_HEIGHT_HINT: 'auto',
} as const;

// ─── CHART TOOLTIP SPEC ─────────────────────────────────────────

export const CHART_TOOLTIP = {
  bg: '#0B0F12',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.7)',
  radius: 10,
  paddingX: 12,
  paddingY: 8,
  shadow: '0 8px 24px rgba(0,0,0,0.24)',
  valueFontSize: 16,
  labelFontSize: 12,
  pointerLine: {
    color: 'rgba(11,15,18,0.45)',
    dash: [2, 4],
    width: 2,
  },
} as const;

// ─── COMPONENT DECISION MATRIX ──────────────────────────────────
// Documentation-only: which component to use when
//
// | Need                              | Component            |
// |-----------------------------------|----------------------|
// | Single big number + optional desc | NumericStatCard      |
// | Big number + inline chart         | DataCardFrame        |
// | Bar chart card                    | CapsuleBarChart      |
// | Line chart card                   | MinimalLineChart     |
// | Ring/donut metric                 | RingMetricCard       |
// | Arc/gauge metric                  | ArcGaugeCard         |
// | Radial progress                   | RadialProgressCard   |
// | Hero metric + comparison          | MetricHeroCard       |
// | Comparison two values             | ComparisonMetricCard |
// | Generic content container         | BaseBox              |
// | Grid layout wrapper               | AppDashboardGrid     |
// | Grid cell                         | AppGridItem          |
//
// RULES:
// - NO glass/blur on static cards
// - NO GenericCard or BaseStatsCard (deprecated)
// - All persistent cards use white bg + #DADCE0 border
// - Glass is ONLY for overlays (modals, drawers, popovers)
