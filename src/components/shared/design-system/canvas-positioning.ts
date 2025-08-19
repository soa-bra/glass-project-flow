// Canvas Positioning Classes - Design System Extension
export const CANVAS_POSITIONING = {
  // Position classes for Canvas elements
  ELEMENT_ABSOLUTE: 'absolute',
  ELEMENT_RELATIVE: 'relative',
  ELEMENT_FIXED: 'fixed',
  
  // Z-index classes
  Z_INDEX_BASE: 'z-[1]',
  Z_INDEX_SELECTED: 'z-[1000]',
  Z_INDEX_OVERLAY: 'z-[998]',
  Z_INDEX_HANDLES: 'z-[1001]',
  Z_INDEX_MODAL: 'z-[9999]',
  
  // Cursor classes for tools
  CURSOR_MOVE: 'cursor-move',
  CURSOR_POINTER: 'cursor-pointer',
  CURSOR_GRAB: 'cursor-grab',
  CURSOR_GRABBING: 'cursor-grabbing',
  CURSOR_CROSSHAIR: 'cursor-crosshair',
  CURSOR_TEXT: 'cursor-text',
  CURSOR_DEFAULT: 'cursor-default',
  
  // Transform classes
  TRANSFORM_CENTER: 'transform -translate-x-1/2 -translate-y-1/2',
  TRANSFORM_CENTER_X: 'transform -translate-x-1/2',
  TRANSFORM_CENTER_Y: 'transform -translate-y-1/2',
  
  // Positioning utilities
  TOP_FULL: 'top-full',
  LEFT_FULL: 'left-full',
  RIGHT_FULL: 'right-full',
  BOTTOM_FULL: 'bottom-full',
  
  // Handle positions
  HANDLE_TOP_LEFT: 'top-[-2px] left-[-2px]',
  HANDLE_TOP_RIGHT: 'top-[-2px] right-[-2px]',
  HANDLE_BOTTOM_LEFT: 'bottom-[-2px] left-[-2px]',
  HANDLE_BOTTOM_RIGHT: 'bottom-[-2px] right-[-2px]',
  HANDLE_TOP_CENTER: 'top-[-2px] left-1/2 transform -translate-x-1/2',
  HANDLE_BOTTOM_CENTER: 'bottom-[-2px] left-1/2 transform -translate-x-1/2',
  HANDLE_LEFT_CENTER: 'left-[-2px] top-1/2 transform -translate-y-1/2',
  HANDLE_RIGHT_CENTER: 'right-[-2px] top-1/2 transform -translate-y-1/2',
  
  // Selection box positions
  SELECTION_LABEL_TOP: 'top-[-20px] left-1/2 transform -translate-x-1/2',
  SELECTION_INFO_TOP: 'top-[-17px] left-1/2 transform -translate-x-1/2',
  
  // Resize handle sizes
  RESIZE_HANDLE_SIZE: 'w-2 h-2',
  RESIZE_HANDLE_HOVER: 'hover:w-3 hover:h-3',
} as const;

// Archive Component Classes
export const ARCHIVE_CLASSES = {
  // Sidebar widths using CSS variables
  SIDEBAR_COLLAPSED: 'w-[var(--departments-sidebar-width-collapsed)]',
  SIDEBAR_EXPANDED: 'w-[var(--departments-sidebar-width-expanded)]',
  
  // Background using CSS variables
  PROJECT_COLUMN_BG: 'bg-[var(--backgrounds-project-column-bg)]',
  SIDEBAR_BG: 'bg-[var(--sb-bg-00)]',
  
  // Transitions using CSS variables
  MAIN_TRANSITION: 'transition-all duration-[var(--animation-duration-main)] ease-[var(--animation-easing)]',
  SYNC_TRANSITION: 'sync-transition',
  
  // Archive specific layouts
  ARCHIVE_BACKDROP: 'backdrop-blur-xl',
  ARCHIVE_ROUNDED: 'rounded-3xl',
  ARCHIVE_OVERFLOW: 'overflow-hidden',
} as const;

// Style Preset Classes  
export const STYLE_PRESET_CLASSES = {
  // Preset preview backgrounds
  PRESET_MINIMAL_BG: 'bg-[#f9fafb]',
  PRESET_CARD_WHITE: 'bg-[#ffffff]',
  PRESET_GLASS_WHITE: 'bg-[rgba(255,255,255,0.2)]',
  PRESET_GLASS_BORDER: 'border-[rgba(255,255,255,0.18)]',
  
  // Border radius utilities
  BORDER_RADIUS_SM: 'rounded',
  BORDER_RADIUS_MD: 'rounded-md',
  BORDER_RADIUS_LG: 'rounded-lg',
  BORDER_RADIUS_XL: 'rounded-xl',
  BORDER_RADIUS_FULL: 'rounded-full',
  
  // Border width utilities
  BORDER_WIDTH_1: 'border',
  BORDER_WIDTH_2: 'border-2',
  BORDER_WIDTH_4: 'border-4',
  
  // Shadow utilities for presets
  SHADOW_NONE: 'shadow-none',
  SHADOW_SM: 'shadow-sm',
  SHADOW_MD: 'shadow-md',
  SHADOW_LG: 'shadow-lg',
  SHADOW_XL: 'shadow-xl',
} as const;