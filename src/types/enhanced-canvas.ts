/**
 * Enhanced Canvas Types - Re-export للتوافقية
 */
export * from '@/features/planning/domain/types/enhanced.types';

// Legacy aliases for backwards compatibility
export type { 
  EnhancedStylePreset as StylePreset,
  EnhancedTextStyle as TextStyle,
  EnhancedBorderStyle as BorderStyle,
  EnhancedPoint as Point,
  EnhancedSelectedElement as SelectedElement
} from '@/features/planning/domain/types/enhanced.types';
