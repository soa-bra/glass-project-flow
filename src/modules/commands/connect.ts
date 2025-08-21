import type { CommandConnect, CommandResult } from "@/src/features/planning/types/commands";
import { useCanvasStore } from "@/src/features/planning/store/canvas.store";

export function execConnect(cmd:CommandConnect): CommandResult{
  const st = useCanvasStore.getState();
  st.connect(cmd.sourceId, cmd.targetId, cmd.style);
  return { ok:true };
}
