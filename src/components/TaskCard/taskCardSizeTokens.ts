import { useEffect, useState, type CSSProperties } from 'react';

interface TaskCardSizeTokens {
  circleSize: number;
  daysNumberFontSize: number;
  daysLabelFontSize: number;
  priorityLine1FontSize: number;
  priorityLine2FontSize: number;
  titleFontSize: number;
  descriptionFontSize: number;
  titleOuterMarginInline: number;
  titleOuterMarginBlock: number;
  titleInnerMarginInline: number;
  pillHeight: number;
  pillRadius: number;
  pillPaddingBlock: number;
  pillPaddingInline: number;
  pillFontSize: number;
  footerGap: number;
  footerMarginTop: number;
  statusDotSize: number;
  iconButtonSize: number;
  iconSize: number;
}

const LARGE_TOKENS: TaskCardSizeTokens = {
  circleSize: 60,
  daysNumberFontSize: 16,
  daysLabelFontSize: 10,
  priorityLine1FontSize: 10,
  priorityLine2FontSize: 8,
  titleFontSize: 16,
  descriptionFontSize: 12,
  titleOuterMarginInline: 15,
  titleOuterMarginBlock: 15,
  titleInnerMarginInline: 4,
  pillHeight: 20,
  pillRadius: 15,
  pillPaddingBlock: 3,
  pillPaddingInline: 8,
  pillFontSize: 10,
  footerGap: 6,
  footerMarginTop: 8,
  statusDotSize: 8,
  iconButtonSize: 20,
  iconSize: 12
};

const MEDIUM_TOKENS: TaskCardSizeTokens = {
  ...LARGE_TOKENS,
  circleSize: 54,
  daysNumberFontSize: 14,
  titleFontSize: 14,
  descriptionFontSize: 11,
  titleOuterMarginInline: 12,
  titleOuterMarginBlock: 12,
  pillPaddingInline: 6,
  pillFontSize: 9,
  footerGap: 4
};

const SMALL_TOKENS: TaskCardSizeTokens = {
  ...MEDIUM_TOKENS,
  circleSize: 48,
  daysNumberFontSize: 13,
  daysLabelFontSize: 9,
  priorityLine1FontSize: 9,
  priorityLine2FontSize: 7,
  titleFontSize: 13,
  descriptionFontSize: 10,
  titleOuterMarginInline: 10,
  titleOuterMarginBlock: 10,
  titleInnerMarginInline: 2,
  pillHeight: 18,
  pillRadius: 13,
  pillPaddingBlock: 2,
  pillPaddingInline: 5,
  pillFontSize: 8,
  footerGap: 3,
  footerMarginTop: 6,
  statusDotSize: 7,
  iconButtonSize: 18,
  iconSize: 10
};

const px = (value: number) => `${value}px`;

export const taskCardSingleLineTextStyle: CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0
};

const getTokensByWidth = (width: number): TaskCardSizeTokens => {
  if (width <= 1023) return SMALL_TOKENS;
  if (width <= 1279) return MEDIUM_TOKENS;
  return LARGE_TOKENS;
};

export const useTaskCardSizeTokens = () => {
  const getCurrentWidth = () => (typeof window === 'undefined' ? 1440 : window.innerWidth);
  const [width, setWidth] = useState(getCurrentWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeTokens = getTokensByWidth(width);

  return {
    ...activeTokens,
    circleSizePx: px(activeTokens.circleSize),
    daysNumberFontSizePx: px(activeTokens.daysNumberFontSize),
    daysLabelFontSizePx: px(activeTokens.daysLabelFontSize),
    priorityLine1FontSizePx: px(activeTokens.priorityLine1FontSize),
    priorityLine2FontSizePx: px(activeTokens.priorityLine2FontSize),
    titleFontSizePx: px(activeTokens.titleFontSize),
    descriptionFontSizePx: px(activeTokens.descriptionFontSize),
    titleOuterMarginInlinePx: px(activeTokens.titleOuterMarginInline),
    titleOuterMarginBlockPx: px(activeTokens.titleOuterMarginBlock),
    titleInnerMarginInlinePx: px(activeTokens.titleInnerMarginInline),
    pillHeightPx: px(activeTokens.pillHeight),
    pillRadiusPx: px(activeTokens.pillRadius),
    pillPaddingBlockPx: px(activeTokens.pillPaddingBlock),
    pillPaddingInlinePx: px(activeTokens.pillPaddingInline),
    pillFontSizePx: px(activeTokens.pillFontSize),
    footerGapPx: px(activeTokens.footerGap),
    footerMarginTopPx: px(activeTokens.footerMarginTop),
    statusDotSizePx: px(activeTokens.statusDotSize),
    iconButtonSizePx: px(activeTokens.iconButtonSize),
    iconSizePx: px(activeTokens.iconSize)
  };
};
