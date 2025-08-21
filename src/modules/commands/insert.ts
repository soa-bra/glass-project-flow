import type { CommandInsert, CommandResult } from "@/src/features/planning/types/commands";
import { useCanvasStore } from "@/src/features/planning/store/canvas.store";

export function execInsert(cmd:CommandInsert): CommandResult{
  const st = useCanvasStore.getState();
  const it:any = cmd.item;
  if ("w" in it && "h" in it && "x" in it) {
    st.insertWidget(it);
    return { ok:true };
  }
  if ("background" in it) {
    st.insertFrame(it);
    return { ok:true };
  }
  if ("sourceId" in it) {
    st.connect(it.sourceId, it.targetId, it.style);
    return { ok:true };
  }
  return { ok:false, error:"unsupported insert item" };
}
