import { z } from "zod";

export const ConnectorSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  route: z.array(z.tuple([z.number(), z.number()])).optional(), // [[x,y],...]
  style: z.record(z.any()).optional(),
  label: z.string().optional(),
  boardId: z.string(),
});
export type Connector = z.infer<typeof ConnectorSchema>;
