import { useCanvasStore } from "@/src/features/planning/store/canvas.store";
export class SelectionManager{
  select(id:string, multi=false){
    const st = useCanvasStore.getState();
    st.toggleSelection(id, multi);
  }
  clear(){ useCanvasStore.getState().clearSelection(); }
  get(){ return useCanvasStore.getState().selection; }
}
