/**
 * Text Element Types - أنواع عنصر النص الموحدة
 * @module features/planning/elements/text/types
 */

// ============================================
// Basic Types - الأنواع الأساسية
// ============================================

/** نوع النص - Text type */
export type TextType = 'line' | 'box' | 'attached';

/** محاذاة النص الأفقية - Horizontal text alignment */
export type TextAlign = 'left' | 'center' | 'right';

/** اتجاه النص - Text direction */
export type TextDirection = 'rtl' | 'ltr';

/** المحاذاة الرأسية - Vertical alignment */
export type VerticalAlign = 'top' | 'middle' | 'bottom' | 'flex-start' | 'center' | 'flex-end';

// ============================================
// Style Interface - واجهة الأنماط
// ============================================

/**
 * أنماط عنصر النص
 * Text element style properties
 */
export interface TextElementStyle {
  /** عائلة الخط - Font family */
  fontFamily: string;
  
  /** حجم الخط - Font size in pixels */
  fontSize: number;
  
  /** وزن الخط - Font weight */
  fontWeight: string;
  
  /** نمط الخط - Font style (normal/italic) */
  fontStyle: string;
  
  /** لون النص - Text color */
  color: string;
  
  /** لون الخلفية - Background color */
  backgroundColor?: string;
  
  /** محاذاة النص الأفقية - Horizontal text alignment */
  textAlign: TextAlign;
  
  /** اتجاه النص - Text direction */
  direction: TextDirection;
  
  /** المحاذاة العمودية - Vertical alignment (flex values) */
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  
  /** زخرفة النص - Text decoration */
  textDecoration?: string;
}

// ============================================
// Data Interface - واجهة البيانات
// ============================================

/**
 * بيانات إضافية لعنصر النص
 * Additional text element data
 */
export interface TextElementData {
  /** نوع النص - Text type */
  textType: TextType;
  
  /** التمدد التلقائي - Auto grow enabled */
  autoGrow?: boolean;
  
  /** الحد الأدنى للعرض - Minimum width */
  minWidth?: number;
  
  /** الحد الأدنى للارتفاع - Minimum height */
  minHeight?: number;
  
  /** الحشوة الداخلية - Internal padding */
  padding?: number;
}

// ============================================
// Editor API Interface - واجهة المحرر
// ============================================

/**
 * واجهة API لمحرر النص
 * Text editor API interface for context
 */
export interface TextEditorAPI {
  /** تطبيق تنسيق - Apply formatting */
  applyFormat: (command: string, value?: string) => void;
  
  /** تبديل القائمة - Toggle list */
  toggleList: (listType: 'ul' | 'ol') => void;
  
  /** إزالة التنسيق - Remove formatting */
  removeFormatting: () => void;
  
  /** مرجع المحرر - Editor ref */
  editorRef: HTMLDivElement | null;
  
  /** معرف العنصر - Element ID */
  elementId: string;
  
  /** إعادة التركيز - Restore focus */
  restoreFocus: () => void;
}

// ============================================
// Default Values - القيم الافتراضية
// ============================================

/**
 * الأنماط الافتراضية لعنصر النص
 * Default text element styles
 */
export const DEFAULT_TEXT_STYLE: TextElementStyle = {
  fontFamily: 'IBM Plex Sans Arabic',
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#0B0F12',
  backgroundColor: 'transparent',
  textAlign: 'right',
  direction: 'rtl',
  alignItems: 'flex-start',
  textDecoration: 'none',
};

/**
 * البيانات الافتراضية لعنصر النص
 * Default text element data
 */
export const DEFAULT_TEXT_DATA: TextElementData = {
  textType: 'line',
  autoGrow: true,
  minWidth: 50,
  minHeight: 20,
  padding: 8,
};

/**
 * الحجم الافتراضي لعنصر النص
 * Default text element size
 */
export const DEFAULT_TEXT_SIZE = {
  width: 150,
  height: 30,
};
