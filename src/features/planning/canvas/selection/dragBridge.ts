/**
 * dragBridge - جسر بدء السحب من عنصر غير محدد.
 *
 * يسمح لـ CanvasElement (وأخوته: MindMapNode / VisualNode) بأن يبدأ
 * سحبًا فوريًا بعد أن يقوم بالتحديد، بدون انتظار render جديد لظهور
 * طبقة السحب في BoundingBox. BoundingBox يسجّل دالة البدء عند التركيب.
 */
export type DragStarter = (event: PointerEvent, target: Element) => void;

let starter: DragStarter | null = null;

export const dragBridge = {
  register(fn: DragStarter | null) {
    starter = fn;
  },
  start(event: PointerEvent, target: Element): boolean {
    if (!starter) return false;
    starter(event, target);
    return true;
  },
  isReady(): boolean {
    return starter !== null;
  },
};
