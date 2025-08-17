import designTokensData from '@/styles/designTokens.json';

export type DesignTokens = typeof designTokensData['design-tokens'];
export type ComponentMappings = typeof designTokensData['component-mappings'];

// تصدير ديزاين التوكن
export const designTokens: DesignTokens = designTokensData['design-tokens'];
export const componentMappings: ComponentMappings = designTokensData['component-mappings'];

// دوال مساعدة لبناء الكلاسات
export const buildGlassmorphismClasses = (): string => {
  return [
    'backdrop-blur-[20px]',
    'bg-white/40',
    'border',
    'border-white/20',
    'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'
  ].join(' ');
};

export const buildModalClasses = (size: 'sm' | 'md' | 'lg' | 'xl' = 'lg'): string => {
  const modalSize = designTokens.dimensions.modal[size];
  return [
    buildGlassmorphismClasses(),
    modalSize.maxWidth,
    modalSize.maxHeight,
    modalSize.borderRadius,
    modalSize.padding,
    'fixed',
    'left-1/2',
    'top-1/2',
    '-translate-x-1/2',
    '-translate-y-1/2',
    'z-[9999]',
    'overflow-hidden'
  ].join(' ');
};

export const buildBackdropClasses = (): string => {
  return [
    'fixed',
    'inset-0',
    'bg-white/30',
    'backdrop-blur-sm',
    'z-[9999]'
  ].join(' ');
};

export const buildHeaderClasses = (): string => {
  return designTokens.header.layout;
};

export const buildTitleClasses = (): string => {
  const title = designTokens.header.title;
  return [
    title.fontSize,
    title.fontWeight,
    title.color,
    title.fontFamily
  ].join(' ');
};

export const buildCloseButtonClasses = (): string => {
  const closeBtn = designTokens.header.closeButton;
  return [
    closeBtn.size,
    closeBtn.borderRadius,
    closeBtn.border,
    closeBtn.background,
    closeBtn.hover,
    closeBtn.position,
    closeBtn.zIndex,
    'flex',
    'items-center',
    'justify-center',
    'transition-colors',
    'duration-200'
  ].join(' ');
};

export const buildIconContainerClasses = (): string => {
  const icon = designTokens.header.icon;
  return [
    icon.size,
    icon.background,
    icon.borderRadius,
    'flex',
    'items-center',
    'justify-center',
    'ml-3'
  ].join(' ');
};

export const buildLabelClasses = (): string => {
  const labels = designTokens['interactive-elements'].labels;
  return [
    labels.fontWeight,
    labels.color,
    labels.fontFamily,
    labels.spacing
  ].join(' ');
};

export const buildInputClasses = (): string => {
  const input = designTokens['interactive-elements']['input-fields'];
  return [
    input.borderRadius,
    input.background,
    input.border.default,
    input.border.focus,
    input.padding,
    input.text.align,
    input.text.fontFamily,
    input.placeholder,
    input.transition,
    'w-full'
  ].join(' ');
};

export const buildTextareaClasses = (): string => {
  const textarea = designTokens['interactive-elements'].textarea;
  return [
    textarea.borderRadius,
    textarea.background,
    textarea.border.default,
    textarea.border.focus,
    textarea.padding,
    textarea.text.align,
    textarea.text.fontFamily,
    textarea.placeholder,
    textarea.transition,
    textarea.resize,
    'w-full'
  ].join(' ');
};

export const buildSelectClasses = (): string => {
  const select = designTokens['interactive-elements'].select;
  return [
    select.borderRadius,
    select.background,
    select.border.default,
    select.border.focus,
    select.padding,
    select.text.align,
    select.text.fontFamily,
    select.transition,
    'w-full'
  ].join(' ');
};

export const buildPrimaryButtonClasses = (): string => {
  const primary = designTokens['action-buttons'].primary;
  return [
    primary.background.default,
    primary.background.hover,
    primary.color,
    primary.padding,
    primary.borderRadius,
    primary.fontFamily,
    primary.fontWeight,
    primary.transition,
    primary.disabled
  ].join(' ');
};

export const buildSecondaryButtonClasses = (): string => {
  const secondary = designTokens['action-buttons'].secondary;
  return [
    secondary.background.default,
    secondary.background.hover,
    secondary.border,
    secondary.color,
    secondary.padding,
    secondary.borderRadius,
    secondary.fontFamily,
    secondary.fontWeight,
    secondary.transition
  ].join(' ');
};

export const buildDestructiveButtonClasses = (): string => {
  const destructive = designTokens['action-buttons'].destructive;
  return [
    destructive.background.default,
    destructive.background.hover,
    destructive.color,
    destructive.padding,
    destructive.borderRadius,
    destructive.fontFamily,
    destructive.fontWeight,
    destructive.transition,
    destructive.disabled
  ].join(' ');
};

export const buildToggleContainerClasses = (): string => {
  const container = designTokens['interactive-elements']['toggle-buttons'].container;
  return [
    container.border,
    container.borderRadius,
    container.padding,
    container.background,
    'flex'
  ].join(' ');
};

export const buildToggleButtonClasses = (isSelected: boolean): string => {
  const button = designTokens['interactive-elements']['toggle-buttons'].button;
  const states = designTokens['interactive-elements']['toggle-buttons'].states;
  
  const baseClasses = [
    button.padding,
    button.borderRadius,
    button.fontSize,
    button.fontWeight,
    button.transition,
    button.fontFamily
  ];
  
  if (isSelected) {
    baseClasses.push(states.selected.background, states.selected.color);
  } else {
    baseClasses.push(states.unselected.color, states.unselected.hover);
  }
  
  return baseClasses.join(' ');
};

export const buildActionButtonsLayoutClasses = (): string => {
  return designTokens['action-buttons'].layout;
};

export const buildFieldGroupClasses = (): string => {
  return designTokens.spacing.vertical.fieldGroups;
};

export const buildSectionsClasses = (): string => {
  return designTokens.spacing.vertical.sections;
};

// دوال مساعدة للحصول على قيم محددة
export const getModalSizes = () => designTokens.dimensions.modal;
export const getSemanticColors = () => designTokens['semantic-colors'];
export const getSpacing = () => designTokens.spacing;
export const getTypography = () => designTokens.typography;
export const getEffects = () => designTokens.effects;

// دالة لبناء كلاسات مخصصة
export const buildCustomClasses = (tokenPath: string[]): string => {
  let current: any = designTokens;
  for (const path of tokenPath) {
    current = current[path];
    if (!current) return '';
  }
  
  if (typeof current === 'string') {
    return current;
  } else if (typeof current === 'object') {
    return Object.values(current).filter(val => typeof val === 'string').join(' ');
  }
  
  return '';
};

// تصدير جميع الدوال
export {
  designTokensData
};