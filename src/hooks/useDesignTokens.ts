import { useMemo } from 'react';
import {
  designTokens,
  buildGlassmorphismClasses,
  buildModalClasses,
  buildBackdropClasses,
  buildHeaderClasses,
  buildTitleClasses,
  buildCloseButtonClasses,
  buildIconContainerClasses,
  buildLabelClasses,
  buildInputClasses,
  buildTextareaClasses,
  buildSelectClasses,
  buildPrimaryButtonClasses,
  buildSecondaryButtonClasses,
  buildDestructiveButtonClasses,
  buildToggleContainerClasses,
  buildToggleButtonClasses,
  buildActionButtonsLayoutClasses,
  buildFieldGroupClasses,
  buildSectionsClasses,
  getModalSizes,
  getSemanticColors,
  getSpacing,
  getTypography,
  getEffects,
  buildCustomClasses,
  type DesignTokens
} from '@/utils/designTokens';

export interface UseDesignTokensReturn {
  tokens: DesignTokens;
  classes: {
    glassmorphism: string;
    modal: (size?: 'sm' | 'md' | 'lg' | 'xl') => string;
    backdrop: string;
    header: string;
    title: string;
    closeButton: string;
    iconContainer: string;
    label: string;
    input: string;
    textarea: string;
    select: string;
    primaryButton: string;
    secondaryButton: string;
    destructiveButton: string;
    toggleContainer: string;
    toggleButton: (isSelected: boolean) => string;
    actionButtonsLayout: string;
    fieldGroup: string;
    sections: string;
    custom: (tokenPath: string[]) => string;
  };
  values: {
    modalSizes: ReturnType<typeof getModalSizes>;
    semanticColors: ReturnType<typeof getSemanticColors>;
    spacing: ReturnType<typeof getSpacing>;
    typography: ReturnType<typeof getTypography>;
    effects: ReturnType<typeof getEffects>;
  };
}

/**
 * Hook مخصص لاستخدام ديزاين التوكن بطريقة منظمة ومحسنة للأداء
 */
export const useDesignTokens = (): UseDesignTokensReturn => {
  const classes = useMemo(() => ({
    glassmorphism: buildGlassmorphismClasses(),
    modal: buildModalClasses,
    backdrop: buildBackdropClasses(),
    header: buildHeaderClasses(),
    title: buildTitleClasses(),
    closeButton: buildCloseButtonClasses(),
    iconContainer: buildIconContainerClasses(),
    label: buildLabelClasses(),
    input: buildInputClasses(),
    textarea: buildTextareaClasses(),
    select: buildSelectClasses(),
    primaryButton: buildPrimaryButtonClasses(),
    secondaryButton: buildSecondaryButtonClasses(),
    destructiveButton: buildDestructiveButtonClasses(),
    toggleContainer: buildToggleContainerClasses(),
    toggleButton: buildToggleButtonClasses,
    actionButtonsLayout: buildActionButtonsLayoutClasses(),
    fieldGroup: buildFieldGroupClasses(),
    sections: buildSectionsClasses(),
    custom: buildCustomClasses
  }), []);

  const values = useMemo(() => ({
    modalSizes: getModalSizes(),
    semanticColors: getSemanticColors(),
    spacing: getSpacing(),
    typography: getTypography(),
    effects: getEffects()
  }), []);

  return {
    tokens: designTokens,
    classes,
    values
  };
};

// Hook مخصص لكلاسات الأزرار مع حالات مختلفة
export const useButtonClasses = (
  variant: 'primary' | 'secondary' | 'destructive' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  disabled: boolean = false
) => {
  return useMemo(() => {
    const { classes } = useDesignTokens();
    
    let baseClasses = '';
    switch (variant) {
      case 'primary':
        baseClasses = classes.primaryButton;
        break;
      case 'secondary':
        baseClasses = classes.secondaryButton;
        break;
      case 'destructive':
        baseClasses = classes.destructiveButton;
        break;
    }

    // إضافة كلاسات الحجم
    switch (size) {
      case 'sm':
        baseClasses += ' px-4 py-2 text-sm';
        break;
      case 'md':
        baseClasses += ' px-6 py-3';
        break;
      case 'lg':
        baseClasses += ' px-8 py-4 text-lg';
        break;
    }

    if (disabled) {
      baseClasses += ' opacity-70 cursor-not-allowed';
    }

    return baseClasses;
  }, [variant, size, disabled]);
};

// Hook مخصص للحقول التفاعلية
export const useInputClasses = (
  type: 'input' | 'textarea' | 'select' = 'input',
  hasError: boolean = false
) => {
  return useMemo(() => {
    const { classes } = useDesignTokens();
    
    let baseClasses = '';
    switch (type) {
      case 'input':
        baseClasses = classes.input;
        break;
      case 'textarea':
        baseClasses = classes.textarea;
        break;
      case 'select':
        baseClasses = classes.select;
        break;
    }

    if (hasError) {
      baseClasses = baseClasses.replace('border-black/20', 'border-red-500');
      baseClasses = baseClasses.replace('focus:border-black', 'focus:border-red-500');
    }

    return baseClasses;
  }, [type, hasError]);
};

// Hook مخصص للتبديل
export const useToggleClasses = () => {
  const { classes } = useDesignTokens();
  
  return useMemo(() => ({
    container: classes.toggleContainer,
    button: classes.toggleButton
  }), [classes]);
};

export default useDesignTokens;