/**
 * Smart Doc Contract (P1.c)
 * ─────────────────────────
 * Authoritative Zod contract describing the shape of `content` for
 * `planning_elements` rows of type `smart_doc` / `interactive_sheet`.
 *
 * Stored inline inside `planning_elements.content` (jsonb) with the row's
 * `schema_version` column carrying the contract version. See
 * docs/CANVAS_LIMITATIONS.md for the rationale behind the inline approach.
 */
import { z } from "zod";

export const SMART_DOC_SCHEMA_VERSION = 1;

export const smartDocFormatSchema = z.enum(["rich-text", "spreadsheet"]);
export type SmartDocFormat = z.infer<typeof smartDocFormatSchema>;

const richTextBlockSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["paragraph", "heading", "list", "quote", "code", "divider"]),
  text: z.string().optional(),
  level: z.number().int().min(1).max(6).optional(),
  children: z.array(z.unknown()).optional(),
  attrs: z.record(z.unknown()).optional(),
});

const spreadsheetCellSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  formula: z.string().optional(),
  format: z.record(z.unknown()).optional(),
});

const spreadsheetBlockSchema = z.object({
  rows: z.number().int().min(1).max(2000),
  cols: z.number().int().min(1).max(200),
  cells: z.record(spreadsheetCellSchema), // key = "row:col"
});

export const smartDocContentSchema = z.object({
  version: z.literal(SMART_DOC_SCHEMA_VERSION),
  format: smartDocFormatSchema,
  title: z.string().max(500).optional(),
  // Rich-text payload — present when format = rich-text.
  blocks: z.array(richTextBlockSchema).optional(),
  // Spreadsheet payload — present when format = spreadsheet.
  sheet: spreadsheetBlockSchema.optional(),
  meta: z.record(z.unknown()).optional(),
}).superRefine((val, ctx) => {
  if (val.format === "rich-text" && !val.blocks) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "rich-text smart doc requires `blocks` array",
      path: ["blocks"],
    });
  }
  if (val.format === "spreadsheet" && !val.sheet) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "spreadsheet smart doc requires `sheet` object",
      path: ["sheet"],
    });
  }
});

export type SmartDocContent = z.infer<typeof smartDocContentSchema>;

/**
 * Validates the inbound content payload. Throws ZodError on failure so the
 * caller (service layer) can surface a clear error to the user.
 */
export function validateSmartDocContent(input: unknown): SmartDocContent {
  return smartDocContentSchema.parse(input);
}

/**
 * Future-proof migration entry point. Upgrades older payloads to the latest
 * `SMART_DOC_SCHEMA_VERSION` before validation. Currently a no-op because we
 * only ship v1, but the call site is in place so future migrations are
 * additive and safe.
 */
export function migrateSmartDocContent(
  input: unknown,
  _fromVersion?: number,
): unknown {
  return input;
}

export const SMART_DOC_ELEMENT_TYPES = ["smart_doc", "interactive_sheet"] as const;
export type SmartDocElementType = (typeof SMART_DOC_ELEMENT_TYPES)[number];

export function isSmartDocElementType(value: string): value is SmartDocElementType {
  return (SMART_DOC_ELEMENT_TYPES as readonly string[]).includes(value);
}
