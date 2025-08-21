type KeyHandler = (e:KeyboardEvent)=>void;
const map = new Map<string, KeyHandler[]>();

export function bindKey(combo:string, handler:KeyHandler){
  const k = combo.toLowerCase();
  const arr = map.get(k) ?? [];
  arr.push(handler); map.set(k, arr);
}
export function unbindKey(combo:string, handler:KeyHandler){
  const k = combo.toLowerCase();
  const arr = (map.get(k) ?? []).filter(h=>h!==handler);
  map.set(k, arr);
}

export function installKeyboard(){
  const handler = (e:KeyboardEvent)=>{
    const parts = [
      e.ctrlKey||e.metaKey ? "mod" : "",
      e.shiftKey ? "shift" : "",
      e.altKey ? "alt" : "",
      e.key.toLowerCase()
    ].filter(Boolean).join("+");
    (map.get(parts) ?? []).forEach(h=>h(e));
  };
  window.addEventListener("keydown", handler);
  return ()=> window.removeEventListener("keydown", handler);
}
