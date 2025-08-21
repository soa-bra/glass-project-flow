import type { CommandMove, CommandResult } from "@/src/features/planning/types/commands";
import { useCanvasStore } from "@/src/features/planning/store/canvas.store";

export function execMove(cmd:CommandMove): CommandResult{
  const st = useCanvasStore.getState();
  if (cmd.target==="frame"){
    st.updateFrame(cmd.id, (p:any)=>({ x:(p?.x??0)+cmd.delta.dx, y:(p?.y??0)+cmd.delta.dy }) as any);
    return { ok:true };
  } else {
    const w = st.getWidgetById(cmd.id); if (!w) return { ok:false, error:"widget not found" };
    st.updateWidget(cmd.id, { x: w.x + cmd.delta.dx, y: w.y + cmd.delta.dy });
    return { ok:true };
  }
}
