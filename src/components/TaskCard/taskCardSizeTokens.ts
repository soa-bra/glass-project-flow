import type { CSSProperties } from 'react';

export const taskCardSizeTokens = {
  circleSize: 'var(--task-card-circle-size)',
  daysNumberFontSize: 'var(--task-card-days-number-font-size)',
  daysLabelFontSize: 'var(--task-card-days-label-font-size)',
  priorityLine1FontSize: 'var(--task-card-priority-line1-font-size)',
  priorityLine2FontSize: 'var(--task-card-priority-line2-font-size)',
  titleFontSize: 'var(--task-card-title-font-size)',
  descriptionFontSize: 'var(--task-card-description-font-size)',
  titleOuterMarginInline: 'var(--task-card-title-margin-inline)',
  titleOuterMarginBlock: 'var(--task-card-title-margin-block)',
  titleInnerMarginInline: 'var(--task-card-title-inner-margin-inline)',
  pillHeight: 'var(--task-card-pill-height)',
  pillRadius: 'var(--task-card-pill-radius)',
  pillPaddingBlock: 'var(--task-card-pill-padding-block)',
  pillPaddingInline: 'var(--task-card-pill-padding-inline)',
  pillFontSize: 'var(--task-card-pill-font-size)',
  footerGap: 'var(--task-card-footer-gap)',
  footerMarginTop: 'var(--task-card-footer-margin-top)',
  statusDotSize: 'var(--task-card-status-dot-size)',
  iconButtonSize: 'var(--task-card-icon-button-size)',
  iconSize: 'var(--task-card-icon-size)'
} as const;

export const taskCardSingleLineTextStyle: CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0
};
