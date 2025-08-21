import type { CommandStyle, CommandResult } from "@/src/features/planning/types/commands";
import { useCanvasStore } from "@/src/features/planning/store/canvas.store";

export function execStyle(cmd:CommandStyle): CommandResult{
  const st = useCanvasStore.getState();
  if (cmd.target==="frame"){ st.updateFrame(cmd.id, { ...cmd.patch } as any); return { ok:true }; }
  if (cmd.target==="connector"){ st.updateConnector(cmd.id, { style: cmd.patch } as any); return { ok:true }; }
  const w = st.getWidgetById(cmd.id); if (!w) return { ok:false, error:"widget not found" };
  st.updateWidget(cmd.id, { style: { ...(w.style ?? {}), ...cmd.patch } });
  return { ok:true };
}
