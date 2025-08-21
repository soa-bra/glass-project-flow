import { z } from "zod";

export const WidgetSchema = z.object({
  id: z.string(),
  type: z.enum(["sticky","shape","text","image","table","pen","connector","frame","widget","smart"]),
  parentId: z.string().nullable(),
  x: z.number(), y: z.number(), w: z.number().positive(), h: z.number().positive(),
  zIndex: z.number().int().default(0),
  style: z.object({
    fill: z.string().optional(),
    stroke: z.string().optional(),
    opacity: z.number().min(0).max(1).optional(),
    radius: z.number().optional(),
    font: z.object({
      family: z.string().optional(),
      size: z.number().optional(),
      weight: z.number().optional()
    }).optional()
  }).optional(),
  data: z.record(z.any()).optional(),
  locks: z.object({ movable: z.boolean().optional(), resizable: z.boolean().optional() }).optional(),
  createdBy: z.string(),
  updatedAt: z.number()
});
export type Widget = z.infer<typeof WidgetSchema>;
