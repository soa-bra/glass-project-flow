import type React from 'react';

export const BOTTOM_TOOLBAR_BUTTON_SIZE_PX = 32;
export const BOTTOM_TOOLBAR_GAP_PX = 8;
export const BOTTOM_TOOLBAR_INLINE_PADDING_PX = 24;

export const bottomToolbarCssVars = {
  width: '--planning-bottom-toolbar-width',
  buttonSize: '--planning-bottom-toolbar-button-size',
  adjacentGap: '--planning-bottom-toolbar-adjacent-gap',
} as const;

export const getBottomToolbarWidthPx = (itemCount: number): number => (
  (itemCount * BOTTOM_TOOLBAR_BUTTON_SIZE_PX)
  + (Math.max(itemCount - 1, 0) * BOTTOM_TOOLBAR_GAP_PX)
  + BOTTOM_TOOLBAR_INLINE_PADDING_PX
);

export const getBottomToolbarLayoutStyle = (itemCount: number): React.CSSProperties => ({
  [bottomToolbarCssVars.width]: `${getBottomToolbarWidthPx(itemCount)}px`,
  [bottomToolbarCssVars.buttonSize]: `${BOTTOM_TOOLBAR_BUTTON_SIZE_PX}px`,
  [bottomToolbarCssVars.adjacentGap]: `${BOTTOM_TOOLBAR_GAP_PX}px`,
} as React.CSSProperties);
