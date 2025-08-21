import type { CommandGroup, CommandResult } from "@/src/features/planning/types/commands";
// تبسيط: نكتب groupId داخل data لكل عنصر
import { useCanvasStore } from "@/src/features/planning/store/canvas.store";
export function execGroup(cmd:CommandGroup): CommandResult{
  const st = useCanvasStore.getState();
  cmd.ids.forEach(id=>{
    const w = st.getWidgetById(id); if (w) st.updateWidget(id, { data: { ...(w.data??{}), groupId: cmd.ids[0] }});
  });
  return { ok:true };
}
