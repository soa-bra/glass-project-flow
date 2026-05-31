/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Smart Document Type System
 * نظام أنواع المستندات الذكية
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file defines all Zod schemas for smart documents in SoaBra.
 * Smart documents include Interactive Sheets and Smart Text Documents.
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Smart Document Types Enum
// ─────────────────────────────────────────────────────────────────────────────

export const SmartDocTypes = [
  'interactive_sheet',
  'smart_text_doc',
] as const;

export const SmartDocTypeSchema = z.enum(SmartDocTypes);
export type SmartDocType = z.infer<typeof SmartDocTypeSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Sheet - ورقة البيانات التفاعلية
// ─────────────────────────────────────────────────────────────────────────────

export const SheetCellFormatSchema = z.object({
  type: z.enum(['text', 'number', 'currency', 'percentage', 'date', 'boolean']).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  verticalAlign: z.enum(['top', 'middle', 'bottom']).optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  fontSize: z.number().optional(),
  wrap: z.boolean().optional(),
});

export const SheetCellSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  formula: z.string().optional(), // e.g., "=SUM(A1:A10)"
  format: SheetCellFormatSchema.optional(),
  note: z.string().optional(),
  validation: z.object({
    type: z.enum(['list', 'number', 'date', 'text']).optional(),
    criteria: z.unknown().optional(),
  }).optional(),
});

export const SheetLinkedElementSchema = z.object({
  cellRef: z.string(), // e.g., "A1"
  elementId: z.string(),
  property: z.string(), // which property to sync
  direction: z.enum(['read', 'write', 'both']).default('read'),
});

export const InteractiveSheetDataSchema = z.object({
  rows: z.number().min(1).max(1000).default(20),
  columns: z.number().min(1).max(100).default(10),
  cells: z.record(z.string(), SheetCellSchema).default({}), // key format: "A1", "B2"
  columnWidths: z.record(z.string(), z.number()).default({}),
  rowHeights: z.record(z.string(), z.number()).default({}),
  frozenRows: z.number().default(0),
  frozenColumns: z.number().default(0),
  linkedElements: z.array(SheetLinkedElementSchema).default([]),
  showGridLines: z.boolean().default(true),
  showRowNumbers: z.boolean().default(true),
  showColumnHeaders: z.boolean().default(true),
  allowFormulas: z.boolean().default(true),
  allowAIAnalysis: z.boolean().default(true),
});

export type SheetCellFormat = z.infer<typeof SheetCellFormatSchema>;
export type SheetCell = z.infer<typeof SheetCellSchema>;
export type SheetLinkedElement = z.infer<typeof SheetLinkedElementSchema>;
export type InteractiveSheetData = z.infer<typeof InteractiveSheetDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Smart Text Document - مستند نصي ذكي
// ─────────────────────────────────────────────────────────────────────────────

export const SmartTextDocSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  order: z.number(),
});

export const SmartTextDocDataSchema = z.object({
  title: z.string().default('مستند جديد'),
  content: z.string().default(''),
  format: z.enum(['plain', 'rich', 'markdown']).default('rich'),
  aiAssist: z.boolean().default(true),
  readOnly: z.boolean().default(false),
  showToolbar: z.boolean().default(true),
  autoSave: z.boolean().default(true),
  lastEditedAt: z.string().datetime().optional(),
  wordCount: z.number().default(0),
  sections: z.array(SmartTextDocSectionSchema).default([]),
});

export type SmartTextDocSection = z.infer<typeof SmartTextDocSectionSchema>;
export type SmartTextDocData = z.infer<typeof SmartTextDocDataSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Unified Type Map & Helpers
// ─────────────────────────────────────────────────────────────────────────────

export const SmartDocDataSchemaMap = {
  interactive_sheet: InteractiveSheetDataSchema,
  smart_text_doc: SmartTextDocDataSchema,
} as const;

export type SmartDocDataType<T extends SmartDocType> = z.infer<typeof SmartDocDataSchemaMap[T]>;

export type AnySmartDocData = InteractiveSheetData | SmartTextDocData;

// ─────────────────────────────────────────────────────────────────────────────
// Labels
// ─────────────────────────────────────────────────────────────────────────────

export const SmartDocLabels: Record<SmartDocType, string> = {
  interactive_sheet: 'ورقة تفاعلية',
  smart_text_doc: 'مستند نصي ذكي',
};

// ─────────────────────────────────────────────────────────────────────────────
// Validation Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function validateSmartDocData<T extends SmartDocType>(
  type: T,
  data: unknown
): { success: true; data: SmartDocDataType<T> } | { success: false; errors: z.ZodError } {
  const schema = SmartDocDataSchemaMap[type];
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data as SmartDocDataType<T> };
  }
  return { success: false, errors: result.error };
}

export function getDefaultSmartDocData<T extends SmartDocType>(
  type: T
): SmartDocDataType<T> {
  const schema = SmartDocDataSchemaMap[type];
  return schema.parse({}) as SmartDocDataType<T>;
}
