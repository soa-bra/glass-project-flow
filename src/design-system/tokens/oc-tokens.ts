/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Operating Components Tokens - TypeScript Exports
 * توكنات خاصة بمنتج سوبرا - تعتمد على DS Tokens
 * 
 * @layer Operating Components
 * @version 1.0.0
 * @depends-on DS Tokens
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// Project Tokens
// ─────────────────────────────────────────────────────────────────────────────

export const OC_PROJECT = {
  // Card
  CARD_BG: 'var(--oc-project-card-bg)',
  CARD_RADIUS: 'var(--oc-project-card-radius)',
  CARD_SHADOW: 'var(--oc-project-card-shadow)',
  CARD_BORDER: 'var(--oc-project-card-border)',
  CARD_PADDING: 'var(--oc-project-card-padding)',

  // Column
  COLUMN_BG: 'var(--oc-project-column-bg)',
  COLUMN_RADIUS: 'var(--oc-project-column-radius)',
  COLUMN_PADDING: 'var(--oc-project-column-padding)',
  COLUMN_GAP: 'var(--oc-project-column-gap)',

  // Sidebar
  SIDEBAR_WIDTH_COLLAPSED: 'var(--oc-project-sidebar-width-collapsed)',
  SIDEBAR_WIDTH_EXPANDED: 'var(--oc-project-sidebar-width-expanded)',
  SIDEBAR_BG: 'var(--oc-project-sidebar-bg)',

  // Elements
  DAYS_BUBBLE_BG: 'var(--oc-project-days-bubble-bg)',
  TASKS_BUBBLE_BG: 'var(--oc-project-tasks-bubble-bg)',
  CAPSULE_BG: 'var(--oc-project-capsule-bg)',
  CAPSULE_RADIUS: 'var(--oc-project-capsule-radius)',
  CAPSULE_PADDING_X: 'var(--oc-project-capsule-padding-x)',
  CAPSULE_PADDING_Y: 'var(--oc-project-capsule-padding-y)',

  // Header
  HEADER_HEIGHT: 'var(--oc-project-header-height)',
  HEADER_BG: 'var(--oc-project-header-bg)',
  HEADER_BORDER: 'var(--oc-project-header-border)',

  // Timeline
  TIMELINE_LINE_COLOR: 'var(--oc-project-timeline-line-color)',
  TIMELINE_DOT_SIZE: 'var(--oc-project-timeline-dot-size)',
  TIMELINE_DOT_COLOR: 'var(--oc-project-timeline-dot-color)',

  // Milestone
  MILESTONE_SIZE: 'var(--oc-project-milestone-size)',
  MILESTONE_BG: 'var(--oc-project-milestone-bg)',
  MILESTONE_RING: 'var(--oc-project-milestone-ring)',
  MILESTONE_ICON: 'var(--oc-project-milestone-icon)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Task Tokens
// ─────────────────────────────────────────────────────────────────────────────

export const OC_TASK = {
  // Card
  CARD_BG: 'var(--oc-task-card-bg)',
  CARD_RADIUS: 'var(--oc-task-card-radius)',
  CARD_SHADOW: 'var(--oc-task-card-shadow)',
  CARD_BORDER: 'var(--oc-task-card-border)',
  CARD_PADDING: 'var(--oc-task-card-padding)',

  // List
  LIST_BG: 'var(--oc-task-list-bg)',
  LIST_RADIUS: 'var(--oc-task-list-radius)',
  LIST_GAP: 'var(--oc-task-list-gap)',

  // Board (Kanban)
  BOARD_COLUMN_WIDTH: 'var(--oc-task-board-column-width)',
  BOARD_COLUMN_BG: 'var(--oc-task-board-column-bg)',
  BOARD_COLUMN_RADIUS: 'var(--oc-task-board-column-radius)',
  BOARD_GAP: 'var(--oc-task-board-gap)',

  // Checkbox
  CHECKBOX_SIZE: 'var(--oc-task-checkbox-size)',
  CHECKBOX_RADIUS: 'var(--oc-task-checkbox-radius)',
  CHECKBOX_BORDER: 'var(--oc-task-checkbox-border)',
  CHECKBOX_CHECKED_BG: 'var(--oc-task-checkbox-checked-bg)',

  // Due Date
  DUE_NORMAL: 'var(--oc-task-due-normal)',
  DUE_SOON: 'var(--oc-task-due-soon)',
  DUE_OVERDUE: 'var(--oc-task-due-overdue)',

  // Dependencies
  DEPENDENCY_LINE_COLOR: 'var(--oc-task-dependency-line-color)',
  DEPENDENCY_LINE_WIDTH: 'var(--oc-task-dependency-line-width)',
  DEPENDENCY_ARROW_COLOR: 'var(--oc-task-dependency-arrow-color)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Tokens
// ─────────────────────────────────────────────────────────────────────────────

export const OC_CANVAS = {
  // Z-Index
  Z: {
    BASE: 'var(--oc-canvas-z-base)',
    ELEMENT: 'var(--oc-canvas-z-element)',
    SELECTED: 'var(--oc-canvas-z-selected)',
    BOUNDING: 'var(--oc-canvas-z-bounding)',
    HANDLES: 'var(--oc-canvas-z-handles)',
    OVERLAY: 'var(--oc-canvas-z-overlay)',
    TOOLBAR: 'var(--oc-canvas-z-toolbar)',
  },

  // Background
  BG: 'var(--oc-canvas-bg)',
  GRID_COLOR: 'var(--oc-canvas-grid-color)',
  GRID_SIZE: 'var(--oc-canvas-grid-size)',

  // Elements
  ELEMENT_BG: 'var(--oc-canvas-element-bg)',
  ELEMENT_BORDER: 'var(--oc-canvas-element-border)',
  ELEMENT_RADIUS: 'var(--oc-canvas-element-radius)',
  ELEMENT_SHADOW: 'var(--oc-canvas-element-shadow)',

  // Sticky Notes
  STICKY_BG: 'var(--oc-canvas-sticky-bg)',
  STICKY_SHADOW: 'var(--oc-canvas-sticky-shadow)',
  STICKY_RADIUS: 'var(--oc-canvas-sticky-radius)',

  // Annotations
  ANNOTATION_BG: 'var(--oc-canvas-annotation-bg)',
  ANNOTATION_BORDER: 'var(--oc-canvas-annotation-border)',

  // Selection
  SELECTION: {
    BORDER: 'var(--oc-canvas-selection-border)',
    BORDER_WIDTH: 'var(--oc-canvas-selection-border-width)',
    FILL: 'var(--oc-canvas-selection-fill)',
    DASH: 'var(--oc-canvas-selection-dash)',
  },

  // Handles
  HANDLE: {
    SIZE: 'var(--oc-canvas-handle-size)',
    SIZE_HOVER: 'var(--oc-canvas-handle-size-hover)',
    BG: 'var(--oc-canvas-handle-bg)',
    BORDER: 'var(--oc-canvas-handle-border)',
    BORDER_WIDTH: 'var(--oc-canvas-handle-border-width)',
  },

  // Connectors
  CONNECTOR: {
    COLOR: 'var(--oc-canvas-connector-color)',
    WIDTH: 'var(--oc-canvas-connector-width)',
    HOVER_COLOR: 'var(--oc-canvas-connector-hover-color)',
    ARROW_SIZE: 'var(--oc-canvas-connector-arrow-size)',
  },

  // Toolbar
  TOOLBAR: {
    BG: 'var(--oc-canvas-toolbar-bg)',
    SHADOW: 'var(--oc-canvas-toolbar-shadow)',
    RADIUS: 'var(--oc-canvas-toolbar-radius)',
    PADDING: 'var(--oc-canvas-toolbar-padding)',
  },

  // Zoom
  ZOOM: {
    MIN: 'var(--oc-canvas-zoom-min)',
    MAX: 'var(--oc-canvas-zoom-max)',
    DEFAULT: 'var(--oc-canvas-zoom-default)',
    STEP: 'var(--oc-canvas-zoom-step)',
  },

  // Cursors
  CURSOR: {
    DEFAULT: 'var(--oc-canvas-cursor-default)',
    GRAB: 'var(--oc-canvas-cursor-grab)',
    GRABBING: 'var(--oc-canvas-cursor-grabbing)',
    CROSSHAIR: 'var(--oc-canvas-cursor-crosshair)',
    TEXT: 'var(--oc-canvas-cursor-text)',
    MOVE: 'var(--oc-canvas-cursor-move)',
    POINTER: 'var(--oc-canvas-cursor-pointer)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Status Tokens
// ─────────────────────────────────────────────────────────────────────────────

export const OC_STATUS = {
  // Project/Task Status
  ON_PLAN: 'var(--oc-status-on-plan)',
  IN_PREPARATION: 'var(--oc-status-in-preparation)',
  IN_PROGRESS: 'var(--oc-status-in-progress)',
  DELAYED: 'var(--oc-status-delayed)',
  STOPPED: 'var(--oc-status-stopped)',
  TODO: 'var(--oc-status-todo)',
  COMPLETED: 'var(--oc-status-completed)',

  // Indicator Sizes
  DOT_SIZE_SM: 'var(--oc-status-dot-size-sm)',
  DOT_SIZE_MD: 'var(--oc-status-dot-size-md)',
  DOT_SIZE_LG: 'var(--oc-status-dot-size-lg)',

  // Task Status (Kanban)
  TASK: {
    TODO: 'var(--oc-status-task-todo)',
    IN_PROGRESS: 'var(--oc-status-task-in-progress)',
    REVIEW: 'var(--oc-status-task-review)',
    COMPLETED: 'var(--oc-status-task-completed)',
  },

  // Health/Risk
  HEALTH: {
    GOOD: 'var(--oc-status-health-good)',
    WARNING: 'var(--oc-status-health-warning)',
    CRITICAL: 'var(--oc-status-health-critical)',
    NEUTRAL: 'var(--oc-status-health-neutral)',
  },

  // Online/Activity
  ONLINE: 'var(--oc-status-online)',
  AWAY: 'var(--oc-status-away)',
  BUSY: 'var(--oc-status-busy)',
  OFFLINE: 'var(--oc-status-offline)',

  // Approval
  APPROVAL: {
    APPROVED: 'var(--oc-status-approved)',
    PENDING: 'var(--oc-status-pending)',
    REJECTED: 'var(--oc-status-rejected)',
    DRAFT: 'var(--oc-status-draft)',
  },

  // Invoice
  INVOICE: {
    DRAFT: 'var(--oc-status-invoice-draft)',
    PENDING: 'var(--oc-status-invoice-pending)',
    PAID: 'var(--oc-status-invoice-paid)',
    OVERDUE: 'var(--oc-status-invoice-overdue)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Priority Tokens
// ─────────────────────────────────────────────────────────────────────────────

export const OC_PRIORITY = {
  // Standard Levels
  URGENT: 'var(--oc-priority-urgent)',
  HIGH: 'var(--oc-priority-high)',
  MEDIUM: 'var(--oc-priority-medium)',
  LOW: 'var(--oc-priority-low)',
  NONE: 'var(--oc-priority-none)',

  // Eisenhower Matrix
  EISENHOWER: {
    URGENT_IMPORTANT: 'var(--oc-priority-urgent-important)',
    NOT_URGENT_IMPORTANT: 'var(--oc-priority-not-urgent-important)',
    URGENT_NOT_IMPORTANT: 'var(--oc-priority-urgent-not-important)',
    NOT_URGENT_NOT_IMPORTANT: 'var(--oc-priority-not-urgent-not-important)',
  },

  // Badge Styles
  BADGE: {
    RADIUS: 'var(--oc-priority-badge-radius)',
    PADDING_X: 'var(--oc-priority-badge-padding-x)',
    PADDING_Y: 'var(--oc-priority-badge-padding-y)',
    FONT_SIZE: 'var(--oc-priority-badge-font-size)',
    FONT_WEIGHT: 'var(--oc-priority-badge-font-weight)',
  },

  // Indicator
  INDICATOR: {
    SIZE: 'var(--oc-priority-indicator-size)',
    RADIUS: 'var(--oc-priority-indicator-radius)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Visual Data / Charts Tokens
// ─────────────────────────────────────────────────────────────────────────────

export const OC_CHART = {
  // Colors
  PRIMARY: 'var(--oc-chart-primary)',
  PALETTE: {
    1: 'var(--oc-chart-1)',
    2: 'var(--oc-chart-2)',
    3: 'var(--oc-chart-3)',
    4: 'var(--oc-chart-4)',
    5: 'var(--oc-chart-5)',
    6: 'var(--oc-chart-6)',
  },

  // Grid & Axes
  GRID_COLOR: 'var(--oc-chart-grid-color)',
  AXIS_COLOR: 'var(--oc-chart-axis-color)',
  AXIS_WIDTH: 'var(--oc-chart-axis-width)',

  // Elements
  STROKE_WIDTH: 'var(--oc-chart-stroke-width)',
  DOT_SIZE: 'var(--oc-chart-dot-size)',
  BAR_RADIUS: 'var(--oc-chart-bar-radius)',
  BAR_GAP: 'var(--oc-chart-bar-gap)',

  // Tooltip
  TOOLTIP: {
    BG: 'var(--oc-chart-tooltip-bg)',
    TEXT: 'var(--oc-chart-tooltip-text)',
    MUTED: 'var(--oc-chart-tooltip-muted)',
    RADIUS: 'var(--oc-chart-tooltip-radius)',
    PADDING_X: 'var(--oc-chart-tooltip-padding-x)',
    PADDING_Y: 'var(--oc-chart-tooltip-padding-y)',
    SHADOW: 'var(--oc-chart-tooltip-shadow)',
    VALUE_SIZE: 'var(--oc-chart-tooltip-value-size)',
    SUB_VALUE_SIZE: 'var(--oc-chart-tooltip-sub-value-size)',
  },

  // Pointer Line
  POINTER: {
    COLOR: 'var(--oc-chart-pointer-color)',
    DASH: 'var(--oc-chart-pointer-dash)',
    WIDTH: 'var(--oc-chart-pointer-width)',
  },
} as const;

export const OC_PROGRESS = {
  ACTIVE: 'var(--oc-progress-active)',
  INACTIVE: 'var(--oc-progress-inactive)',
  BG: 'var(--oc-progress-bg)',
  HEIGHT: 'var(--oc-progress-height)',
  RADIUS: 'var(--oc-progress-radius)',

  // Tape (Tick-based)
  TAPE: {
    TICK_WIDTH: 'var(--oc-progress-tape-tick-width)',
    TICK_GAP: 'var(--oc-progress-tape-tick-gap)',
    TICK_RADIUS: 'var(--oc-progress-tape-tick-radius)',
    TICK_DONE: 'var(--oc-progress-tape-tick-done)',
    TICK_TODO: 'var(--oc-progress-tape-tick-todo)',
  },
} as const;

export const OC_KPI = {
  NUMBER_SIZE: 'var(--oc-kpi-number-size)',
  UNIT_SIZE: 'var(--oc-kpi-unit-size)',
  GAP_VERTICAL: 'var(--oc-kpi-gap-vertical)',
  ICON_CIRCLE_SIZE: 'var(--oc-kpi-icon-circle-size)',
  ICON_STROKE: 'var(--oc-kpi-icon-stroke)',
} as const;

export const OC_SCROLL = {
  CAPSULE: {
    WIDTH: 'var(--oc-scroll-capsule-width)',
    HEIGHT: 'var(--oc-scroll-capsule-height)',
    RADIUS: 'var(--oc-scroll-capsule-radius)',
    COLOR: 'var(--oc-scroll-capsule-color)',
    IDLE_OPACITY: 'var(--oc-scroll-capsule-idle-opacity)',
    ACTIVE_OPACITY: 'var(--oc-scroll-capsule-active-opacity)',
  },
  DOT: {
    SIZE: 'var(--oc-scroll-dot-size)',
    GAP: 'var(--oc-scroll-dot-gap)',
    COLOR: 'var(--oc-scroll-dot-color)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Financial Tokens
// ─────────────────────────────────────────────────────────────────────────────

export const OC_FINANCIAL = {
  // Status
  PROFIT: 'var(--oc-financial-profit)',
  LOSS: 'var(--oc-financial-loss)',
  NEUTRAL: 'var(--oc-financial-neutral)',
  PENDING: 'var(--oc-financial-pending)',

  // Budget
  BUDGET: {
    SPENT: 'var(--oc-budget-spent)',
    REMAINING: 'var(--oc-budget-remaining)',
    OVERRUN: 'var(--oc-budget-overrun)',
    TRACK_BG: 'var(--oc-budget-track-bg)',
    TRACK_HEIGHT: 'var(--oc-budget-track-height)',
    TRACK_RADIUS: 'var(--oc-budget-track-radius)',
  },

  // Invoice Card
  INVOICE: {
    CARD_BG: 'var(--oc-invoice-card-bg)',
    CARD_RADIUS: 'var(--oc-invoice-card-radius)',
    CARD_SHADOW: 'var(--oc-invoice-card-shadow)',
    CARD_PADDING: 'var(--oc-invoice-card-padding)',
  },

  // Expense Card
  EXPENSE: {
    CARD_BG: 'var(--oc-expense-card-bg)',
    CARD_RADIUS: 'var(--oc-expense-card-radius)',
    CATEGORY_ICON_SIZE: 'var(--oc-expense-category-icon-size)',
  },

  // Revenue Chart
  REVENUE: {
    LINE_COLOR: 'var(--oc-revenue-line-color)',
    FILL_COLOR: 'var(--oc-revenue-fill-color)',
  },
  EXPENSE_CHART: {
    LINE_COLOR: 'var(--oc-expense-line-color)',
    FILL_COLOR: 'var(--oc-expense-fill-color)',
  },

  // Currency Display
  CURRENCY: {
    POSITIVE: 'var(--oc-currency-positive)',
    NEGATIVE: 'var(--oc-currency-negative)',
    NEUTRAL: 'var(--oc-currency-neutral)',
    FONT_SIZE: 'var(--oc-currency-font-size)',
    FONT_WEIGHT: 'var(--oc-currency-font-weight)',
  },

  // Financial Glance
  GLANCE: {
    TICKS_COUNT: 'var(--oc-financial-ticks-count)',
    TICK_WIDTH: 'var(--oc-financial-tick-width)',
    TICK_GAP: 'var(--oc-financial-tick-gap)',
    TICK_RADIUS: 'var(--oc-financial-tick-radius)',
    TICK_BASE: 'var(--oc-financial-tick-base)',
    TICK_FILL: 'var(--oc-financial-tick-fill)',
    BG_GOOD: 'var(--oc-financial-bg-good)',
    BG_WARNING: 'var(--oc-financial-bg-warning)',
    BG_DANGER: 'var(--oc-financial-bg-danger)',
    INCOME_TICK: 'var(--oc-financial-income-tick)',
    EXPENSE_TICK: 'var(--oc-financial-expense-tick)',
    PROFIT_BG: 'var(--oc-financial-profit-bg)',
    LOSS_BG: 'var(--oc-financial-loss-bg)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined OC Export
// ─────────────────────────────────────────────────────────────────────────────

export const OC = {
  PROJECT: OC_PROJECT,
  TASK: OC_TASK,
  CANVAS: OC_CANVAS,
  STATUS: OC_STATUS,
  PRIORITY: OC_PRIORITY,
  CHART: OC_CHART,
  PROGRESS: OC_PROGRESS,
  KPI: OC_KPI,
  SCROLL: OC_SCROLL,
  FINANCIAL: OC_FINANCIAL,
} as const;

export default OC;
