/**
 * Canvas AI Tools Types - Re-export للتوافقية
 */
export * from '@/features/planning/domain/types/ai-tools.types';

// Legacy aliases for backwards compatibility
export type {
  AIToolsMindMapData as MindMapData,
  AIToolsSmartConnection as SmartConnection,
  AIToolsAnalysisResult as AIAnalysisResult
} from '@/features/planning/domain/types/ai-tools.types';
