export function alignTo(type:"left"|"center"|"right"|"top"|"middle"|"bottom", selection:any[], anchor:any){
  const res = selection.map((w:any)=>{
    switch(type){
      case "left": return { id:w.id, x: anchor.x };
      case "right": return { id:w.id, x: anchor.x + anchor.w - w.w };
      case "center": return { id:w.id, x: anchor.x + anchor.w/2 - w.w/2 };
      case "top": return { id:w.id, y: anchor.y };
      case "bottom": return { id:w.id, y: anchor.y + anchor.h - w.h };
      case "middle": return { id:w.id, y: anchor.y + anchor.h/2 - w.h/2 };
    }
  });
  return res;
}
