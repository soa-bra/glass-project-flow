import { z } from "zod";

export const FrameSchema = z.object({
  id: z.string(),
  name: z.string().default("Frame"),
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive(),
  locked: z.boolean().default(false),
  background: z.string().optional(),
  boardId: z.string(),
});
export type Frame = z.infer<typeof FrameSchema>;
