import { z } from "zod";

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  ownerId: z.string(),
  settings: z.record(z.any()).optional(),
});
export type Board = z.infer<typeof BoardSchema>;
