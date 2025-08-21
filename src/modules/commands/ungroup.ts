import type { CommandUnGroup, CommandResult } from "@/src/features/planning/types/commands";
import { useCanvasStore } from "@/src/features/planning/store/canvas.store";
export function execUnGroup(cmd:CommandUnGroup): CommandResult{
  const st = useCanvasStore.getState();
  const groupId = cmd.groupId;
  st.widgets.filter(w=> w.data?.groupId===groupId).forEach(w=>{
    const { data, ...rest } = w as any; const nd = { ...(data??{}) }; delete nd.groupId;
    st.updateWidget(w.id, { data: nd });
  });
  return { ok:true };
}
